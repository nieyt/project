import Base from './base';
class BasePC extends Base {
    // 清除html
    clearSymbol(text = '') {
        return text.replace(/(module.exports = "|\\r|\\n|\\t|\\v|\\f|"$)/g,'');
    }
};
export default BasePC;