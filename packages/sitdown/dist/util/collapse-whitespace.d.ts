import isBlock from './isBlock';
import isVoid from './isVoid';
import { Node } from '../types';
interface Options {
    element: Node;
    isBlock: typeof isBlock;
    isVoid: typeof isVoid;
    isPre?: (node: Node) => boolean;
}
/**
 * collapseWhitespace(options) removes extraneous whitespace from an the given element.
 *
 * @param {Object} options
 */
declare function collapseWhitespace(options: Options): void;
export default collapseWhitespace;
