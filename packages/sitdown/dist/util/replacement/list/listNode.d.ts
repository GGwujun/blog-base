import { Node, Options } from '../../../types';
export declare class ListNode {
    node: Node;
    constructor(node: Node);
    private get parent();
    get parentIsOL(): boolean | null;
    get nestULCount(): number;
    get nestOLCount(): number;
    get nestCount(): number;
    get isLoose(): boolean | null;
    get isNewList(): boolean | null;
    get followCode(): boolean | null;
    get inLast(): boolean | null;
    get nestListAndParentIsEmpty(): boolean | null;
    lineIndent(options: Options): string;
    caclPrefix(input: string): string;
}
