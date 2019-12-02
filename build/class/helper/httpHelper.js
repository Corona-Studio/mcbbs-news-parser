"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const superagent = require("superagent");
class HttpHelper {
    static postRequest(url, data, header, toJson, returnResponse) {
        return new Promise((resolve, reject) => {
            superagent.post(url).timeout(1000 * 10).set(header || {}).send(data || {}).end((err, res) => {
                if (err)
                    return reject(err);
                if (returnResponse === true)
                    resolve(res);
                toJson === false ? resolve(res.text) : resolve(JSON.parse(res.text));
            });
        });
    }
    ;
    static getRequest(url, header, toJson, returnResponse) {
        return new Promise((resolve, reject) => {
            superagent.get(url).timeout(1000 * 10).set(header || {}).end((err, res) => {
                if (err)
                    return reject(err);
                if (returnResponse === true)
                    resolve(res);
                toJson === false ? resolve(res.text) : resolve(JSON.parse(res.text));
            });
        });
    }
    ;
}
exports.default = HttpHelper;
//# sourceMappingURL=httpHelper.js.map