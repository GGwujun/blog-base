"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

  return _extends.apply(this, arguments);
}

function escape(escapes, string) {
  return escapes.reduce(function (accumulator, escape) {
    return accumulator.replace(escape[0], escape[1]);
  }, string);
}

function isFence(options, node) {
  return !!(
    options.codeBlockStyle === "fenced" &&
    node.nodeName === "PRE" &&
    node.firstChild &&
    node.firstChild.nodeName === "CODE"
  );
}

function isCode(node) {
  var hasSiblings = node.previousSibling || node.nextSibling;
  var isCodeBlock =
    node.parentNode && node.parentNode.nodeName === "PRE" && !hasSiblings;
  return node.nodeName === "CODE" && !isCodeBlock;
}

function isKeep(options, node) {
  var filters = options.keepFilter ? options.keepFilter : ["div", "style"];
  return Array.isArray(filters)
    ? filters.some(function (filter) {
      return filter === node.nodeName.toLowerCase();
    })
    : typeof filters === "function"
      ? filters(node, options)
      : filters === node.nodeName.toLowerCase();
}

function fenceReplacement(content, node, options) {
  var className = node.firstChild ? node.firstChild.className : "";
  var language = (className.match(/language-(\S+)/) || [null, ""])[1];
  var startFence =
    options.startFence != undefined ? options.startFence : options.fence;
  var endFence =
    options.endFence != undefined ? options.endFence : options.fence;
  var parent = node.parentNode;
  var parentIsList = parent && parent.nodeName === "LI";
  return (
    (parentIsList ? "\n" : "\n\n") +
    startFence +
    language +
    "\n" +
    (node.firstChild ? node.firstChild.textContent : "") +
    ((node.firstChild &&
      node.firstChild.textContent &&
      node.firstChild.textContent.endsWith("\n")) ||
      !content
      ? ""
      : "\n") +
    endFence +
    "\n\n"
  );
}

function findParentNumber(node, parentName, count) {
  if (count === void 0) {
    count = 0;
  }

  if (!node.parentNode) {
    return count;
  }

  if (node.parentNode.nodeName === parentName) {
    count++;
  }

  return findParentNumber(node.parentNode, parentName, count);
}

function repeat(character, count) {
  return Array(count + 1).join(character);
}

function IndentCodeIsListfirstChild(list, options) {
  return (
    options.codeBlockStyle !== "fenced" &&
    list &&
    list.firstChild &&
    list.nodeName === "LI" &&
    list.firstChild.nodeName === "PRE"
  );
}

function findOrderListIndentNumber(node, count) {
  if (count === void 0) {
    count = 0;
  }

  var parentName = "OL";
  var parent = node.parentNode;

  if (!parent) {
    return count;
  }

  if (parent.nodeName === parentName) {
    var start = parent.getAttribute("start");

    if (start && start.length > 1) {
      count += start.length - 1;
    }
  }

  return findOrderListIndentNumber(parent, count);
}

var ListNode =
  /*#__PURE__*/
  (function () {
    function ListNode(node) {
      this.node = node;
    }

    var _proto = ListNode.prototype;

    _proto.lineIndent = function lineIndent(options) {
      var nestOLCount = this.nestOLCount,
        nestULCount = this.nestULCount,
        nestCount = this.nestCount,
        node = this.node;
      var indent = "\n    " + repeat(" ", nestCount - 1) + "$1";

      if (IndentCodeIsListfirstChild(node, options) && nestOLCount) {
        indent = "\n  " + repeat(" ", nestCount) + "$1";
      } else if (nestULCount) {
        indent = "\n" + repeat(" ", nestCount * 2) + "$1";
      }

      return indent;
    };

    _proto.caclPrefix = function caclPrefix(input) {
      var prefix = input;
      var nestOLCount = this.nestOLCount,
        nestULCount = this.nestULCount,
        parentIsOL = this.parentIsOL,
        node = this.node,
        parent = this.parent,
        isNewList = this.isNewList,
        inLast = this.inLast,
        isLoose = this.isLoose,
        followCode = this.followCode,
        nestListAndParentIsEmpty = this.nestListAndParentIsEmpty;

      if (parent && parentIsOL) {
        var start = parent.getAttribute("start");
        var index = Array.prototype.indexOf.call(parent.children, node);
        prefix =
          (start ? Number(start) + index : index + 1) +
          (isNewList ? ")  " : ".  ");
      }

      if (followCode) {
        if (!isLoose) prefix = " " + prefix + "   "; // example 235

        if (inLast && isLoose) {
          // example 293
          prefix = "  " + prefix;
        }
      }

      if (nestULCount > 1) {
        prefix = repeat(" ", (nestULCount - 1) * 2) + prefix;
      }

      if (nestULCount && nestOLCount) {
        var indent = findOrderListIndentNumber(node);
        prefix = repeat(" ", nestULCount * 4 + indent) + prefix;
      } // Info：嵌套列表且父列表为空

      if (nestListAndParentIsEmpty) {
        prefix = prefix.trimStart();
      }

      return prefix;
    };

    _createClass(ListNode, [
      {
        key: "parent",
        get: function get() {
          return this.node.parentNode;
        },
      },
      {
        key: "parentIsOL",
        get: function get() {
          return this.parent && this.parent.nodeName === "OL";
        },
      },
      {
        key: "nestULCount",
        get: function get() {
          return findParentNumber(this.node, "UL");
        },
      },
      {
        key: "nestOLCount",
        get: function get() {
          return findParentNumber(this.node, "OL");
        },
      },
      {
        key: "nestCount",
        get: function get() {
          return this.nestULCount + this.nestOLCount;
        },
      },
      {
        key: "isLoose",
        get: function get() {
          var node = this.node;
          return node.firstChild && node.firstChild.nodeName === "P"; // Todo:isBlock
        },
      },
      {
        key: "isNewList",
        get: function get() {
          var parent = this.parent;
          return (
            parent &&
            parent.previousSibling &&
            parent.previousSibling.nodeName === parent.nodeName
          );
        },
      },
      {
        key: "followCode",
        get: function get() {
          var parent = this.parent;
          return (
            parent &&
            parent.nextSibling &&
            parent.nextSibling.nodeName === "PRE"
          );
        },
      },
      {
        key: "inLast",
        get: function get() {
          var parent = this.parent;
          return parent && parent.lastChild === this.node;
        },
      },
      {
        key: "nestListAndParentIsEmpty",
        get: function get() {
          var nestOLCount = this.nestOLCount,
            nestULCount = this.nestULCount,
            node = this.node;
          return (
            nestOLCount + nestULCount > 1 &&
            node.parentNode &&
            node.parentNode.parentNode &&
            node.parentNode.parentNode.innerHTML === node.parentNode.outerHTML
          );
        },
      },
    ]);

    return ListNode;
  })();

function listReplacement(content, node, options) {
  var listNode = new ListNode(node);
  var isLoose = listNode.isLoose,
    newList = listNode.isNewList;
  var bulletListMarker = newList ? "+" : options.bulletListMarker;
  var prefix = listNode.caclPrefix(bulletListMarker + " ");
  content = content
    .replace(/^\n+/, "") // remove leading newlines
    .replace(/\n+$/, "\n") // replace trailing newlines with just a single one
    .replace(/\n(\S)/gm, listNode.lineIndent(options)); // indent

  return (
    prefix +
    content +
    (node.nextSibling && !/\n$/.test(content) ? "\n" : "") +
    (isLoose ? "\n" : "")
  );
}

function keepReplacement(content, node) {
  var html = node.outerHTML;

  if (!content) {
    var attrs = "";

    for (var i = 0; i < node.attributes.length; i++) {
      var attr = node.attributes[i];
      attrs += attr.name + '="' + attr.nodeValue + '"';
    }

    html = "<" + node.localName.toLowerCase() + " " + attrs + " />";
  }

  return node.isBlock ? "\n\n" + html + "\n" : html;
}

// blank
function blankReplacement(content, node, options) {
  if (isKeep(options, node)) {
    return keepReplacement(content, node);
  } else if (isFence(options, node)) {
    return fenceReplacement(content, node, options);
  } else if (isCode(node)) {
    var delimiter = options.codeDelimiter ? options.codeDelimiter : "`";
    return (
      delimiter +
      (options.codeBlockStyle === "fenced" ? " " : "") +
      (content || " ") +
      delimiter +
      "\n"
    );
  } else if (node.nodeName.toLowerCase() === "blockquote") {
    return ">";
  } else if (node.nodeName.toLowerCase() === "li") {
    return listReplacement(content, node, options);
  } else if (node.nodeName.toLowerCase() === "ul") {
    return content + "\n\n";
  }

  return node.isBlock ? content + "\n\n" : "";
}

var index = {
  __proto__: null,
  escape: escape,
  isFence: isFence,
  isCode: isCode,
  blankReplacement: blankReplacement,
  listReplacement: listReplacement,
  fenceReplacement: fenceReplacement,
  keepReplacement: keepReplacement,
  repeat: repeat,
  findParentNumber: findParentNumber,
  findOrderListIndentNumber: findOrderListIndentNumber,
  IndentCodeIsListfirstChild: IndentCodeIsListfirstChild,
};

var applyListRule = function applyListRule(service) {
  service.addRule("list", {
    filter: ["ul", "ol"],
    replacement: function replacement(content, node) {
      var parent = node.parentNode;

      if (
        parent &&
        parent.nodeName === "LI" &&
        parent.lastElementChild === node
      ) {
        return "\n" + content;
      } else {
        return "\n\n" + content + "\n\n";
      }
    },
  });
  service.addRule("listItem", {
    filter: "li",
    replacement: listReplacement,
  });
};

var applyHrRule = function applyHrRule(service) {
  service.addRule("hr", {
    filter: "hr",
    replacement: function replacement(_, __, options) {
      return "\n" + options.hr + "\n";
    },
  });
};

var escapes = [[/\s-/g, " \\-"]];

function escape$1(string) {
  return escapes.reduce(function (accumulator, escape) {
    return accumulator.replace(escape[0], escape[1]);
  }, string);
}

var applyParagraphRule = function applyParagraphRule(service) {
  service.addRule("paragraph", {
    filter: "p",
    replacement: function replacement(content, node) {
      var hasCommentChild = Array.from(node.childNodes).some(function (item) {
        return item.nodeType === 8;
      });
      return "\n\n" + (hasCommentChild ? content : escape$1(content)) + "\n\n";
    },
  });
};

var escapes$1 = [[/\s#/g, " \\#"]];
var applyHeadingRule = function applyHeadingRule(service) {
  service.addRule("heading", {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function replacement(content, node, options) {
      var hLevel = Number(node.nodeName.charAt(1));

      if (options.headingStyle === "setext" && hLevel < 3) {
        var underline = repeat(hLevel === 1 ? "=" : "-", content.length);
        return "\n\n" + content + "\n" + underline + "\n\n";
      } else {
        return (
          "\n\n" +
          repeat("#", hLevel) +
          " " +
          escape(escapes$1, content) +
          "\n\n"
        );
      }
    },
  });
};

var applyFenceRule = function applyFenceRule(service) {
  service.addRule("fencedCodeBlock", {
    filter: function filter(node, options) {
      return isFence(options, node);
    },
    replacement: fenceReplacement,
  });
};

var applyCodeRule = function applyCodeRule(service) {
  service.addRule("code", {
    filter: function filter(node) {
      var hasSiblings = node.previousSibling || node.nextSibling;
      var isCodeBlock =
        node.parentNode && node.parentNode.nodeName === "PRE" && !hasSiblings;
      return node.nodeName === "CODE" && !isCodeBlock;
    },
    replacement: function replacement(content, _, options) {
      if (!content.trim()) return "";
      var delimiter = options.codeDelimiter || "`";
      var leadingSpace = "";
      var trailingSpace = "";
      var matches = content.match(/`+/gm);

      if (matches) {
        if (/^`/.test(content)) leadingSpace = " ";
        if (/`$/.test(content)) trailingSpace = " ";

        while (matches.indexOf(delimiter) !== -1) {
          delimiter = delimiter + "`";
        }
      }

      return delimiter + leadingSpace + content + trailingSpace + delimiter;
    },
  });
};

var escapes$2 = [
  [/\*/g, "\\*"],
  [/"/g, '\\"'],
];
var applyReferenceLinkRule = function applyReferenceLinkRule(service) {
  service.addRule("referenceLink", {
    filter: function filter(node, options) {
      return !!(
        options.linkStyle === "referenced" &&
        node.nodeName === "A" &&
        node.getAttribute("href")
      );
    },
    replacement: function replacement(content, node, options) {
      var href = escape(
        escapes$2,
        decodeURIComponent(node.getAttribute("href"))
      );

      if (href.includes(" ")) {
        href = "<" + href + ">";
      }

      var title = node.title ? ' "' + escape(escapes$2, node.title) + '"' : "";
      var replacement;
      var reference;

      switch (options.linkReferenceStyle) {
        case "collapsed":
          replacement = "[" + content + "][]";
          reference = "[" + content + "]: " + href + title;
          break;

        case "shortcut":
          replacement = "[" + content + "]";
          reference = "[" + content + "]: " + href + title;
          break;

        default:
          var id =
            this.references && this.references.length
              ? "ref" + (this.references.length + 1)
              : "ref";
          replacement = "[" + content + "][" + id + "]";
          reference = "[" + id + "]: " + href + title;
      }

      this.references && this.references.push(reference);
      return replacement;
    },
    references: [],
    unshift: function unshift() {
      var references = "";

      if (this.references && this.references.length) {
        references = "\n\n" + this.references.join("\n") + "\n\n";
        this.references = []; // Reset references
      }

      return references;
    },
  });
};

var escapes$3 = [
  [
    /(.*)\|(.*)/g,
    function (match, p1, p2) {
      if (match.match(/\`.*\|.*\`/)) {
        return p1 + "|" + p2;
      }

      return p1 + "\\|" + p2;
    },
  ],
];
var every = Array.prototype.every;
var indexOf = Array.prototype.indexOf;

function cell(content, node, options) {
  var index = node.parentNode
    ? indexOf.call(node.parentNode.childNodes, node)
    : -1;
  var prefix = " ";

  if (options && options.convertNoHeaderTable) {
    content = content.replace(/\n+/g, "<br>");
  }

  if (index === 0) prefix = "| ";
  return prefix + escape(escapes$3, content) + " |";
}

function isFirstTbody(element) {
  var previousSibling = element.previousSibling;
  return (
    element.nodeName === "TBODY" &&
    (!previousSibling ||
      (previousSibling.nodeName === "THEAD" &&
        /^\s*$/i.test(previousSibling.textContent || "")))
  );
}

function isHeadingRow(tr) {
  var parentNode = tr.parentNode;
  return parentNode
    ? parentNode.nodeName === "THEAD" ||
    (parentNode.firstChild === tr &&
      (parentNode.nodeName === "TABLE" || isFirstTbody(parentNode)) &&
      every.call(tr.childNodes, function (n) {
        return n.nodeName === "TH";
      }))
    : false;
}

var applyTableRule = function applyTableRule(service) {
  service.keep(function (node) {
    return node.nodeName === "TABLE" && !isHeadingRow(node.rows[0]);
  });
  service.addRule("table", {
    filter: function filter(node) {
      return node.nodeName === "TABLE" && isHeadingRow(node.rows[0]);
    },
    replacement: function replacement(content) {
      // Ensure there are no blank lines
      content = content.replace("\n\n", "\n");
      return "\n\n" + content + "\n\n";
    },
  });
  service.addRule("tableSection", {
    filter: ["thead", "tbody", "tfoot"],
    replacement: function replacement(content) {
      return content;
    },
  });
  service.addRule("tableRow", {
    filter: "tr",
    replacement: function replacement(content, node) {
      var borderCells = "";
      var alignMap = {
        left: ":--",
        right: "--:",
        center: ":-:",
      };

      if (isHeadingRow(node)) {
        for (var i = 0; i < node.childNodes.length; i++) {
          var border = "---";
          var curNode = node.childNodes[i];
          var align = (
            curNode.getAttribute("align") ||
            curNode.style.textAlign ||
            ""
          ).toLowerCase();
          if (align) border = alignMap[align] || border;
          borderCells += cell(border, curNode);
        }
      }

      return "\n" + content + (borderCells ? "\n" + borderCells : "");
    },
  });
  service.addRule("tableCell", {
    filter: ["th", "td"],
    replacement: function replacement(content, node, options) {
      return cell(content, node, options);
    },
  });
  service.addRule("noHeaderTable", {
    filter: function filter(node, options) {
      var hasHead = Array.from(node.childNodes).some(function (n) {
        return n.nodeName === "THEAD";
      });

      if (
        node.nodeName === "TABLE" &&
        !hasHead &&
        options.convertNoHeaderTable
      ) {
        try {
          var tr = node.querySelector("tr");

          if (tr) {
            var length = tr.cells.length;
            var header = node.createTHead();
            var row = header.insertRow(0); // console.dir(node);

            for (var i = 0; i < length; i++) {
              var _cell = row.insertCell(i);

              _cell.innerHTML = " ";
            }
          }
        } catch (e) {
          console.log(e);
          return false;
        }

        return true;
      }

      return false;
    },
    replacement: function replacement(content) {
      return content;
    },
  });
};

function caclListIndent(node, options) {
  var nestULCount = findParentNumber(node, "UL");
  var nestOLCount = findParentNumber(node, "OL");

  if (nestOLCount) {
    // Info:如果这个缩进代码父元素是有序列表，并它是第一个元素
    var parentNode = node.parentNode;
    var isFirstChild =
      parentNode &&
      parentNode.firstChild &&
      parentNode.nodeName === "LI" &&
      parentNode.firstChild === node;
    var IndentCodeIsfirstChild = IndentCodeIsListfirstChild(
      parentNode,
      options
    );
    return (
      nestULCount * 2 +
      nestOLCount * 4 +
      4 +
      findOrderListIndentNumber(node) +
      (isFirstChild ? -4 : 0) +
      (IndentCodeIsfirstChild ? -1 : 0)
    );
  }

  return nestULCount * 2 + 4;
}

var applyIndentedCodeBlockRule = function applyIndentedCodeBlockRule(service) {
  service.addRule("indentedCodeBlock", {
    filter: function filter(node, options) {
      return !!(
        options.codeBlockStyle === "indented" &&
        node.nodeName === "PRE" &&
        node.firstChild &&
        node.firstChild.nodeName === "CODE"
      );
    },
    replacement: function replacement(_, node, options) {
      var indent = repeat(" ", caclListIndent(node, options));
      return node.firstChild && node.firstChild.textContent
        ? "\n\n```\n" +
        indent +
        node.firstChild.textContent.replace(/\n/g, "\n" + indent) +
        "\n\n```\n"
        : "\n\n    \n\n";
    },
  });
};

var applyBlockquoteRule = function applyBlockquoteRule(service) {
  service.addRule("hr", {
    filter: "blockquote",
    replacement: function replacement(content, node) {
      var parent = node.parentNode;
      var parentIsList = parent && parent.nodeName === "LI";
      var blank = parentIsList ? "\n" : "\n\n";
      content = content.replace(/^\n+|\n+$/g, "").replace(/^/gm, "> ");
      return blank + content + blank;
    },
  });
};

var applyEmRule = function applyEmRule(service) {
  service.addRule("em", {
    filter: ["em", "i"],
    replacement: function replacement(content, node, options) {
      if (!content.trim()) return "";
      var emDelimiter = options.emDelimiter;

      if (
        node.parentNode &&
        node.parentNode.nodeName === "EM" &&
        node.parentNode.firstChild === node.parentNode.lastChild
      ) {
        emDelimiter = emDelimiter === "_" ? "*" : "_";
      }

      return emDelimiter + content + emDelimiter;
    },
  });
};

var applyDelRule = function applyDelRule(service) {
  service.addRule("del", {
    filter: ["del", "s"],
    replacement: function replacement(content) {
      return "~~" + content + "~~";
    },
  });
};

var specialChars = [" ", "(", ")", "\\", '"'];
var escapes$4 = [[/"/g, "&quot;"]];
var applyLinkRule = function applyLinkRule(service) {
  service.addRule("link", {
    filter: function filter(node, options) {
      return !!(options.linkStyle === "inlined" && node.nodeName === "A");
    },
    replacement: function replacement(content, node) {
      var href = node.getAttribute("href");
      var nodecode = node.getAttribute("nodecode");

      if (nodecode) return "[" + content + "](" + href + node.title + ")";;

      if (!href && !content) {
        return "";
      } // Info:autolink
      var normalizeHref;

      try {
        normalizeHref = href
          ? decodeURIComponent(href).replace("mailto:", "")
          : "";
      } catch (error) {
        normalizeHref = href;
      }

      if (node.firstChild && normalizeHref === node.firstChild.nodeValue) {
        return "<" + node.firstChild.nodeValue + ">";
      }

      if (
        href &&
        normalizeHref.split("").some(function (_char) {
          return specialChars.includes(_char);
        })
      ) {
        try {
          href = "<" + decodeURIComponent(href) + ">";
        } catch (error) {
          href = "<" + href + ">";
        }
      }

      var title = escape(escapes$4, node.title);
      title = title ? ' "' + title + '"' : "";
      return "[" + content + "](" + href + title + ")";
    },
  });
};

var applyImageRule = function applyImageRule(service) {
  service.addRule("hr", {
    filter: "img",
    replacement: function replacement(_content, node, options) {
      var alt = node.getAttribute("alt") || "";
      var src = node.getAttribute("src") || "";
      service.mdImages.push(src)
      var title = node.title || "";
      var titlePart = title ? ' "' + title + '"' : "";
      try {
        var domainPattern = /^(https?:\/\/[^/]+)(.*)$/;
        const imgNoOrigin = src.split("?")[0].match(domainPattern);
        const dest = imgNoOrigin[1].replace(/\./g, "").replace(/\:/g, "").replace(/\//g, "") + imgNoOrigin[2].replace(/\//g, "")
        const destSrc = `${options.assetsPublicPath}/${dest}`
        return src ? "![" + alt + "]" + "(" + destSrc + titlePart + ")" : "";
      } catch (error) {
        return src ? "![" + alt + "]" + "(" + src + titlePart + ")" : "";
      }
    },
  });
};

var applyBrRule = function applyBrRule(service) {
  service.addRule("hr", {
    filter: "br",
    replacement: function replacement(_content, _node, options) {
      return options.br + "\n";
    },
  });
};

var applyStrongRule = function applyStrongRule(service) {
  service.addRule("hr", {
    filter: ["strong", "b"],
    replacement: function replacement(content, _node, options) {
      if (!content.trim()) return "";
      return options.strongDelimiter + content + options.strongDelimiter;
    },
  });
};

var applyTaskRule = function applyTaskRule(service) {
  service.addRule("task", {
    filter: function filter(node) {
      return (
        node.type === "checkbox" &&
        node.parentNode != null &&
        node.parentNode.nodeName === "LI"
      );
    },
    replacement: function replacement(_content, node) {
      return (node.checked ? "[x]" : "[ ]") + " ";
    },
  });
};

var applyPlugins = function (service) {
  service.use([
    applyListRule,
    applyHrRule,
    applyParagraphRule,
    applyHeadingRule,
    applyFenceRule,
    applyCodeRule,
    applyReferenceLinkRule,
    applyTableRule,
    applyIndentedCodeBlockRule,
    applyBlockquoteRule,
    applyEmRule,
    applyDelRule,
    applyLinkRule,
    applyBrRule,
    applyStrongRule,
    applyImageRule,
    applyTaskRule,
  ]);
  service.keep(function (node) {
    if (isKeep(service.options, node)) {
      if (node.parentNode) {
        var index = Array.from(node.parentNode.childNodes).findIndex(function (
          n
        ) {
          return n === node;
        });
        var next = node.parentNode.childNodes[index + 1];
        next && (next.unNeedEscape = true);
      }

      return true;
    }

    return false;
  });
};

/**
 * collapseWhitespace(options) removes extraneous whitespace from an the given element.
 *
 * @param {Object} options
 */
function collapseWhitespace(options) {
  var element = options.element;
  var isBlock = options.isBlock;
  var isVoid = options.isVoid;

  var isPre =
    options.isPre ||
    function (node) {
      return node.nodeName === "PRE";
    };

  if (!element.firstChild || isPre(element)) return;
  var prevText = null;
  var prevVoid = false;
  var prev = null;
  var node = next(prev, element, isPre);

  while (node !== element) {
    if (node.nodeType === 3 || node.nodeType === 4) {
      // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
      var text = node.data ? node.data.replace(/[ \r\n\t]+/g, " ") : "";

      if (
        (!prevText || !prevText.data || / $/.test(prevText.data)) &&
        !prevVoid &&
        text[0] === " "
      ) {
        text = text.substr(1);
      } // `text` might be empty at this point.

      if (!text) {
        node = remove(node);
        continue;
      }

      node.data = text;
      prevText = node;
    } else if (node.nodeType === 1) {
      // Node.ELEMENT_NODE
      if (isBlock(node) || node.nodeName === "BR") {
        if (prevText && prevText.data) {
          prevText.data = prevText.data.replace(/ $/, "");
        }

        prevText = null;
        prevVoid = false;
      } else if (isVoid(node)) {
        // Avoid trimming space around non-block, non-BR void elements.
        prevText = null;
        prevVoid = true;
      }
    } else if (node.nodeType === 8) {
      if (node.nextElementSibling && node.parentNode) {
        var index = Array.from(node.parentNode.childNodes).findIndex(function (
          n
        ) {
          return n === node;
        });
        node.parentNode.childNodes[index + 1].unNeedEscape = true;
      }
    } else {
      node = remove(node);
      continue;
    }

    var nextNode = next(prev, node, isPre);
    prev = node;
    node = nextNode;
  }

  if (prevText && prevText.data) {
    prevText.data = prevText.data.replace(/ $/, "");

    if (!prevText.data) {
      remove(prevText);
    }
  }
}
/**
 * remove(node) removes the given node from the DOM and returns the
 * next node in the sequence.
 *
 * @param {Node} node
 * @return {Node} node
 */

function remove(node) {
  var next = node.nextSibling || node.parentNode;
  node.parentNode && node.parentNode.removeChild(node);
  return next;
}
/**
 * next(prev, current, isPre) returns the next node in the sequence, given the
 * current and previous nodes.
 *
 * @param {Node} prev
 * @param {Node} current
 * @param {Function} isPre
 * @return {Node}
 */

function next(prev, current, isPre) {
  if ((prev && prev.parentNode === current) || isPre(current)) {
    return current.nextSibling || current.parentNode;
  }

  return current.firstChild || current.nextSibling || current.parentNode;
}

var blockElements = [
  "address",
  "article",
  "aside",
  "audio",
  "blockquote",
  "body",
  "canvas",
  "center",
  "dd",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "html",
  "isindex",
  "li",
  "main",
  "menu",
  "nav",
  "noframes",
  "noscript",
  "ol",
  "output",
  "p",
  "pre",
  "section",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
];
function isBlock(node) {
  return blockElements.indexOf(node.nodeName.toLowerCase()) !== -1;
}

var voidElements = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];
function isVoid(node) {
  return voidElements.indexOf(node.nodeName.toLowerCase()) !== -1;
}

/*
 * Set up window for Node.js
 */
var root = typeof window !== "undefined" ? window : {};
/*
 * Parsing HTML strings
 */

function canParseHTMLNatively() {
  var Parser = root.DOMParser;
  var canParse = false; // Adapted from https://gist.github.com/1129031
  // Firefox/Opera/IE throw errors on unsupported types

  try {
    // WebKit returns null on unsupported types
    if (new Parser().parseFromString("", "text/html")) {
      canParse = true;
    }
  } catch (e) { }

  return canParse;
}

var Parser =
  /*#__PURE__*/
  (function () {
    function Parser() { }

    var _proto = Parser.prototype;

    _proto.parseFromString = function parseFromString(string) {
      var JSDOM = require("jsdom").JSDOM;

      return new JSDOM(string).window.document;
    };

    return Parser;
  })();

var HTMLParser = /*#__PURE__*/ canParseHTMLNatively() ? root.DOMParser : Parser;

var _htmlParser;

function htmlParser() {
  _htmlParser = _htmlParser || new HTMLParser();
  return _htmlParser;
}

function createRootNode(input) {
  var root;

  if (typeof input === "string") {
    var doc = htmlParser().parseFromString(
      // DOM parsers arrange elements in the <head> and <body>.
      // Wrapping in a custom element ensures elements are reliably arranged in
      // a single element.
      '<x-sitdown id="root-node">' + input + "</x-sitdown>",
      "text/html"
    );
    root = doc.getElementById("root-node");
  } else {
    root = input.cloneNode(true);
  }

  collapseWhitespace({
    element: root,
    isBlock: isBlock,
    isVoid: isVoid,
  });
  return root;
}

var RootNode = function RootNode(input) {
  // @ts-ignore
  return createRootNode(input);
};

function filterValue(rule, node, options) {
  var filter = rule.filter;

  if (typeof filter === "string") {
    return filter === node.nodeName.toLowerCase();
  } else if (Array.isArray(filter)) {
    return filter.indexOf(node.nodeName.toLowerCase()) > -1;
  } else if (typeof filter === "function") {
    return filter.call(rule, node, options);
  } else {
    throw new TypeError("`filter` needs to be a string, array, or function");
  }
}

function findRule(rules, node, options) {
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    if (filterValue(rule, node, options)) return rule;
  }

  return void 0;
}

/**
 * Manages a collection of rules used to convert HTML to Markdown
 */

var Rules =
  /*#__PURE__*/
  (function () {
    function Rules(options) {
      if (typeof options.blankReplacement !== "function") {
        throw Error("blankReplacement option must be function");
      }

      if (typeof options.keepReplacement !== "function") {
        throw Error("keepReplacement option must be function");
      }

      if (typeof options.defaultReplacement !== "function") {
        throw Error("defaultReplacement option must be function");
      }

      this.options = options;
      this._keep = [];
      this._remove = [];
      this.blankRule = {
        replacement: options.blankReplacement,
      };
      this.keepReplacement = options.keepReplacement;
      this.defaultRule = {
        replacement: options.defaultReplacement,
      };
      this.array = [];

      for (var key in options.rules) {
        this.array.push(options.rules[key]);
      }
    }

    var _proto = Rules.prototype;

    _proto.add = function add(_key, rule) {
      this.array.unshift(rule);
    };

    _proto.keep = function keep(filter) {
      this._keep.unshift({
        filter: filter,
        replacement: this.keepReplacement,
      });
    };

    _proto.remove = function remove(filter) {
      this._remove.unshift({
        filter: filter,
        replacement: function replacement() {
          return "";
        },
      });
    };

    _proto.forNode = function forNode(node) {
      if (node.isBlank) return this.blankRule;
      var rule;
      if ((rule = findRule(this.array, node, this.options))) return rule;
      if ((rule = findRule(this._keep, node, this.options))) return rule;
      if ((rule = findRule(this._remove, node, this.options))) return rule;
      return this.defaultRule;
    };

    _proto.forEach = function forEach(fn) {
      for (var i = 0; i < this.array.length; i++) {
        fn(this.array[i], i);
      }
    };

    return Rules;
  })();

var voidSelector =
  /*#__PURE__*/
  voidElements.join();

function hasVoid(node) {
  return node.querySelector && node.querySelector(voidSelector);
}

function isBlank(node) {
  return (
    [
      "A",
      "TABLE",
      "THEAD",
      "TBODY",
      "TR",
      "TH",
      "TD",
      "IFRAME",
      "SCRIPT",
      "AUDIO",
      "VIDEO",
    ].indexOf(node.nodeName) === -1 &&
    /^\s*$/i.test(node.textContent || "") &&
    !isVoid(node) &&
    !hasVoid(node)
  );
}

function flankingWhitespace(node) {
  var leading = "";
  var trailing = "";

  if (!node.isBlock) {
    var hasLeading = /^[ \r\n\t]/.test(node.textContent || "");
    var hasTrailing = /[ \r\n\t]$/.test(node.textContent || "");

    if (hasLeading && !isFlankedByWhitespace("left", node)) {
      leading = " ";
    }

    if (hasTrailing && !isFlankedByWhitespace("right", node)) {
      trailing = " ";
    }
  }

  return {
    leading: leading,
    trailing: trailing,
  };
}

function isFlankedByWhitespace(side, node) {
  var sibling;
  var regExp;
  var isFlanked;

  if (side === "left") {
    sibling = node.previousSibling;
    regExp = / $/;
  } else {
    sibling = node.nextSibling;
    regExp = /^ /;
  }

  if (sibling) {
    if (sibling.nodeType === 3) {
      isFlanked = regExp.test(sibling.nodeValue || "");
    } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
      isFlanked = regExp.test(sibling.textContent || "");
    }
  }

  return isFlanked;
}

var Node = function Node(node) {
  var newNode = node;
  newNode.isBlock = isBlock(node);
  newNode.isCode =
    node.nodeName.toLowerCase() === "code" || node.parentNode.isCode;
  newNode.isBlank = isBlank(node);
  newNode.flankingWhitespace = flankingWhitespace(node);
  return Object.assign(node, newNode);
};

var leadingNewLinesRegExp = /^\n*/;
var trailingNewLinesRegExp = /\n*$/;

function separatingNewlines(output, replacement) {
  var outputNewLines = output.match(trailingNewLinesRegExp);
  var replacementNewLines = replacement.match(leadingNewLinesRegExp);
  var newlines = [
    outputNewLines ? outputNewLines[0] : "",
    replacementNewLines ? replacementNewLines[0] : "",
  ].sort();
  var maxNewlines = newlines[newlines.length - 1];
  return maxNewlines.length < 2 ? maxNewlines : "\n\n";
}
/**
 * Determines the new lines between the current output and the replacement
 * @private
 * @param {String} output The current conversion output
 * @param {String} replacement The string to append to the output
 * @returns The whitespace to separate the current output and the replacement
 * @type String
 */

function join(string1, string2) {
  var separator = separatingNewlines(string1, string2); // Remove trailing/leading newlines and replace with separator

  string1 = string1.replace(trailingNewLinesRegExp, "");
  string2 = string2.replace(leadingNewLinesRegExp, "");
  return string1 + separator + string2;
}

var rules = {};
var reduce = Array.prototype.reduce;
var escapes$5 = [
  [/\\/g, "\\\\"],
  [/\*/g, "\\*"],
  [/^-/g, "\\-"],
  [/^\+ /g, "\\+ "],
  [/^(=+)/g, "\\$1"],
  [/^(#{1,6}) /g, "\\$1 "],
  [/`/g, "\\`"],
  [/^~~~/g, "\\~~~"],
  [/\[/g, "\\["],
  [/\]/g, "\\]"],
  [/^>/g, "\\>"],
  [/_/g, "\\_"],
  [/^(\d+)\. /g, "$1\\. "], // escapes
  [/^(\d+)\. /g, "$1\\. "],
  [/!/g, "\\!"], // [/"/g, '\\"'],
  // [/'/g, `\\'`],
  // [/#/g, '\\#'],
  [/\$/g, "\\$"],
  [/%/g, "\\%"],
  [/&/g, "\\&"],
  [/\(/g, "\\("],
  [/\)/g, "\\)"], // [/\+/g, '\\+'],
  // [/\-/g, '\\-'],
  // [/\,/g, '\\,'],
  // [/\./g, '\\.'],
  // [/\:/g, '\\:'],
  // [/\;/g, '\\;'],
  [/\</g, "\\<"], // [/\>/g, '\\>'],
  // [/\=/g, '\\='],
  [/\?/g, "\\?"],
  [/\{/g, "\\{"], // [/\|/g, '\\|'],
  [/\}/g, "\\}"],
  [/\~/g, "\\~"],
  [/\^/g, "\\^"],
  [/\@/g, "\\@"],
];

var Service =
  /*#__PURE__*/
  (function () {
    function Service(options) {
      var defaults = {
        rules: rules,
        headingStyle: "setext",
        hr: "* * *",
        bulletListMarker: "*",
        codeBlockStyle: "indented",
        fence: "```",
        emDelimiter: "_",
        strongDelimiter: "**",
        linkStyle: "inlined",
        linkReferenceStyle: "full",
        br: "  ",
        blankReplacement: function blankReplacement(_content, node) {
          return node.isBlock ? "\n\n" : "";
        },
        keepReplacement: function keepReplacement(_content, node) {
          return node.isBlock
            ? "\n\n" + node.outerHTML + "\n\n"
            : node.outerHTML;
        },
        defaultReplacement: function defaultReplacement(content, node) {
          return node.isBlock ? "\n\n" + content + "\n\n" : content;
        },
      };
      this.options = Object.assign({}, defaults, options);
      this.rules = new Rules(this.options);
    }
    /**
     * The entry point for converting a string or DOM node to Markdown
     * @public
     * @param {String|HTMLElement} input The string or DOM node to convert
     * @returns A Markdown representation of the input
     * @type String
     */

    var _proto = Service.prototype;

    _proto.turndown = function turndown(input) {
      if (!canConvert(input)) {
        throw new TypeError(
          input + " is not a string, or an element/document/fragment node."
        );
      }

      if (input === "") return "";
      var node = createRootNode(input);

      if (node) {
        var output = this.process(node);
        return this.postProcess(output);
      } else {
        return input;
      }
    };
    /**
     * Reduces a DOM node down to its Markdown string equivalent
     * @private
     * @param {HTMLElement} parentNode The node to convert
     * @returns A Markdown representation of the node
     * @type String
     */

    _proto.process = function process(parentNode) {
      var _this = this;

      var rst = reduce.call(
        parentNode.childNodes,
        function (output, node) {
          node = new Node(node);
          var replacement = "";

          if (node.nodeType === 3) {
            replacement =
              node.isCode || node.unNeedEscape
                ? node.nodeValue
                : _this.escape(node.nodeValue);
          } else if (node.nodeType === 1) {
            replacement = _this.replacementForNode(node);
          } else if (node.nodeType === 8) {
            replacement = "<!--" + node.nodeValue + "-->";
          }

          return join(String(output), replacement);
        },
        ""
      );
      return String(rst);
    };
    /**
     * Appends strings as each rule requires and trims the output
     * @private
     * @param {String} output The conversion output
     * @returns A trimmed version of the ouput
     * @type String
     */

    _proto.postProcess = function postProcess(output) {
      var _this2 = this;

      this.rules.forEach(function (rule) {
        if (typeof rule.append === "function") {
          output = join(output, rule.append(_this2.options));
        }

        if (typeof rule.unshift === "function") {
          output = join(rule.unshift(_this2.options), output);
        }
      });
      return output.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
    };
    /**
     * Add one or more plugins
     * @public
     * @param {Function|Array} plugin The plugin or array of plugins to add
     * @returns The instance for chaining
     * @type Object
     */

    _proto.use = function use(plugin) {
      if (Array.isArray(plugin)) {
        for (var i = 0; i < plugin.length; i++) {
          this.use(plugin[i]);
        }
      } else if (typeof plugin === "function") {
        plugin(this);
      } else {
        throw new TypeError(
          "plugin must be a Function or an Array of Functions"
        );
      }

      return this;
    };
    /**
     * Adds a rule
     * @public
     * @param {String} key The unique key of the rule
     * @param {Object} rule The rule
     * @returns The instance for chaining
     * @type Object
     */

    _proto.addRule = function addRule(key, rule) {
      this.rules.add(key, rule);
      return this;
    };
    /**
     * Keep a node (as HTML) that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The instance for chaining
     * @type Object
     */

    _proto.keep = function keep(filter) {
      this.rules.keep(filter);
      return this;
    };
    /**
     * Remove a node that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The instance for chaining
     * @type Object
     */

    _proto.remove = function remove(filter) {
      this.rules.remove(filter);
      return this;
    };
    /**
     * Escapes Markdown syntax
     * @public
     * @param {String} string The string to escape
     * @returns A string with Markdown syntax escaped
     * @type String
     */

    _proto.escape = function escape(string) {
      return escapes$5.reduce(function (accumulator, escape) {
        return accumulator.replace(escape[0], escape[1]);
      }, string);
    };
    /**
     * Converts an element node to its Markdown equivalent
     * @private
     * @param {HTMLElement} node The node to convert
     * @returns A Markdown representation of the node
     * @type String
     */

    _proto.replacementForNode = function replacementForNode(node) {
      var rule = this.rules.forNode(node);
      var content = this.process(node);
      var whitespace = node.flankingWhitespace || {
        leading: "",
        trailing: "",
      };
      if (whitespace.leading || whitespace.trailing) content = content.trim();
      return (
        whitespace.leading +
        (rule.replacement
          ? rule.replacement(content, node, this.options)
          : "") +
        whitespace.trailing
      );
    };

    return Service;
  })();
/**
 * Determines whether an input can be converted
 * @private
 * @param {String|HTMLElement} input Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */

function canConvert(input) {
  return (
    input != null &&
    (typeof input === "string" ||
      (input.nodeType &&
        (input.nodeType === 1 ||
          input.nodeType === 9 ||
          input.nodeType === 11)))
  );
}

var Sitdown =
  /*#__PURE__*/
  (function () {
    function Sitdown(options) {
      this.defaultOptions = {
        headingStyle: "atx",
        blankReplacement: blankReplacement,
        keepReplacement: keepReplacement,
      };
      this.service = new Service(
        _extends({}, this.defaultOptions, {}, options)
      );
      this.service.mdImages = []
      applyPlugins(this.service);
    }

    var _proto = Sitdown.prototype;

    _proto.HTMLToMD = function HTMLToMD(html, env) {
      if (env) {
        this.service.options.env = env;
      }

      return this.service.turndown(html);
    };

    _proto.use = function use(plugin) {
      this.service.use(plugin);
      return this;
    };

    return Sitdown;
  })();

exports.RootNode = RootNode;
exports.Sitdown = Sitdown;
exports.Util = index;
//# sourceMappingURL=src.cjs.development.js.map
