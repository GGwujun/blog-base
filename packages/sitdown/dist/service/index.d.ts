import Rules from './Rules';
import { Options, Node as NodeType, Rule, FilterFunction } from '../types';
declare class Service {
    options: Options;
    rules: Rules;
    constructor(options: Options);
    /**
     * The entry point for converting a string or DOM node to Markdown
     * @public
     * @param {String|HTMLElement} input The string or DOM node to convert
     * @returns A Markdown representation of the input
     * @type String
     */
    turndown(input: string): string;
    /**
     * Reduces a DOM node down to its Markdown string equivalent
     * @private
     * @param {HTMLElement} parentNode The node to convert
     * @returns A Markdown representation of the node
     * @type String
     */
    process(parentNode: NodeType): string;
    /**
     * Appends strings as each rule requires and trims the output
     * @private
     * @param {String} output The conversion output
     * @returns A trimmed version of the ouput
     * @type String
     */
    postProcess(output: string): string;
    /**
     * Add one or more plugins
     * @public
     * @param {Function|Array} plugin The plugin or array of plugins to add
     * @returns The instance for chaining
     * @type Object
     */
    use(plugin: any): this;
    /**
     * Adds a rule
     * @public
     * @param {String} key The unique key of the rule
     * @param {Object} rule The rule
     * @returns The instance for chaining
     * @type Object
     */
    addRule(key: string, rule: Rule): this;
    /**
     * Keep a node (as HTML) that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The instance for chaining
     * @type Object
     */
    keep(filter: FilterFunction): this;
    /**
     * Remove a node that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The instance for chaining
     * @type Object
     */
    remove(filter: FilterFunction): this;
    /**
     * Escapes Markdown syntax
     * @public
     * @param {String} string The string to escape
     * @returns A string with Markdown syntax escaped
     * @type String
     */
    escape(string: string): string;
    /**
     * Converts an element node to its Markdown equivalent
     * @private
     * @param {HTMLElement} node The node to convert
     * @returns A Markdown representation of the node
     * @type String
     */
    replacementForNode(node: NodeType): string;
}
export default Service;
export { createRootNode } from './RootNode';
