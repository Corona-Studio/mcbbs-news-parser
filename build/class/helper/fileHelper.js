"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class FileHelper {
    static writeFile(filePath, content, flag) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, { flag: flag || "w" }, (err) => {
                if (err)
                    reject(err);
                resolve();
            });
        });
    }
    static readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(__dirname, filePath), function (err, content) {
                if (err)
                    return reject(err);
                resolve(content.toString());
            });
        });
    }
    ;
    static isFileExists(filePath) {
        return new Promise((resolve, reject) => {
            fs.access(path.resolve(__dirname, filePath), (err) => {
                if (err)
                    reject(err);
                resolve(true);
            });
        });
    }
    ;
}
exports.default = FileHelper;
//# sourceMappingURL=fileHelper.js.map