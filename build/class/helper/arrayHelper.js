"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayHelper extends Array {
    remove(val) {
        let index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    }
}
exports.default = ArrayHelper;
//# sourceMappingURL=arrayHelper.js.map