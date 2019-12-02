"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RandomHelper {
    static randomSample(arr) {
        if (arr.length === 0)
            return null;
        return arr[this.randomInteger(0, arr.length - 1)];
    }
    static randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
exports.default = RandomHelper;
//# sourceMappingURL=randomHelper.js.map