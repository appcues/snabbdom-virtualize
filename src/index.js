import virtualizeNode from './nodes';
import virtualizeString from './strings';

export default function (el, options) {
    if (typeof el === 'string') {
        return virtualizeString(el, options);
    }
    else {
        return virtualizeNode(el, options);
    }
}

export { virtualizeNode, virtualizeString };
