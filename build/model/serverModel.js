"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const notFoundMiddleWare_1 = require("../server/notFoundMiddleWare");
const version_1 = require("../server/api/version");
const news_1 = require("../server/api/news/news");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const rootDir = __dirname;
let ServerModel = class ServerModel extends common_1.ServerLoader {
    /**
     * This method let you configure the express middleware required by your application to works.
     * @returns {Server}
     */
    $beforeRoutesInit() {
        this
            .use(common_1.GlobalAcceptMimesMiddleware)
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
            extended: true
        }))
            .use(notFoundMiddleWare_1.NotFoundMiddleware)
            .use(version_1.VersionApi)
            .use(news_1.NewsApi);
    }
};
ServerModel = __decorate([
    common_1.ServerSettings({
        rootDir,
        acceptMimes: ["application/json"]
    })
], ServerModel);
exports.ServerModel = ServerModel;
//# sourceMappingURL=serverModel.js.map