import { Options, ReplacementFunction, Rule, Node, FilterFunction } from '../../types';
export default class Rules {
    private _keep;
    private _remove;
    options: Options;
    array: Rule[];
    blankRule: {
        replacement: ReplacementFunction;
    };
    defaultRule: {
        replacement: ReplacementFunction;
    };
    keepReplacement: ReplacementFunction;
    constructor(options: Options);
    add(_key: string, rule: Rule): void;
    keep(filter: FilterFunction): void;
    remove(filter: FilterFunction): void;
    forNode(node: Node): Rule | {
        replacement: ReplacementFunction;
    };
    forEach(fn: (item: any, i: number) => void): void;
}
