import virtualizeNode from './nodes';
import virtualizeString from './strings';
import { Options } from './interfaces'

export default function (el: string | Node, options: Options) {
    if (typeof el === 'string') {
        return virtualizeString(el, options);
    }
    else {
        return virtualizeNode(el, options);
    }
}

export { virtualizeNode, virtualizeString };
