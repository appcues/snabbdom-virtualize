import virtualizeNode from './nodes';
import virtualizeString from './strings';

export default function (el) {
    if (typeof el === 'string') {
        return virtualizeString(el);
    }
    else {
        return virtualizeNode(el);
    }
}

export { virtualizeNode, virtualizeString };
