export default class Node {
    unNeedEscape?: boolean;
    data?: string;
    isBlank?: boolean;
    isBlock?: boolean;
    isCode?: boolean;
    flankingWhitespace?: {
        leading: string;
        trailing: string;
    };
    constructor(node: HTMLElement);
}
