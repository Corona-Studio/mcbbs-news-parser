"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpHelper_1 = require("./class/helper/httpHelper");
const uaHelper_1 = require("./class/helper/uaHelper");
const consola = require("consola");
const bbsNewsModel_1 = require("./model/bbsNewsModel");
const fileHelper_1 = require("./class/helper/fileHelper");
const common_1 = require("@tsed/common");
const serverModel_1 = require("./model/serverModel");
async function checkLoop(count) {
    return new Promise(async (resolve, reject) => {
        consola.info("Starting fetching news....");
        count = count === null ? 1 : count;
        let tempArr = new Array();
        for (let i = 1; i <= count; i++) {
            const header = {
                "User-Agent": uaHelper_1.default.GetRandomUa()
            };
            const content = await httpHelper_1.default.getRequest(`https://www.mcbbs.net/forum-news-${i}.html`, header, false).catch((err) => reject(err));
            const parser = new DOMParser();
            const dom = parser.parseFromString(content, "text/html");
            const newsListTable = dom.getElementById("threadlisttableid");
            for (let i = 0; i < newsListTable.childNodes.length; i++) {
                let arr = newsListTable.childNodes[i].textContent.split("\n");
                for (;;) {
                    const index = arr.indexOf("");
                    if (index === -1)
                        break;
                    arr.splice(index, 1);
                }
                if (arr.length === 0)
                    continue;
                let flag = false;
                for (const content of arr) {
                    if (content === "隐藏置顶帖") {
                        flag = true;
                        break;
                    }
                }
                if (flag)
                    continue;
                const previewIndex = arr.indexOf("预览");
                if (previewIndex === -1)
                    continue;
                if (arr.length <= previewIndex + 1)
                    continue;
                const typeIndex = arr[previewIndex + 1].indexOf("]");
                if (typeIndex === -1)
                    continue;
                let removeArr = new Array();
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === "New" || arr[i].startsWith(" ..."))
                        removeArr.push(i);
                }
                for (let i = removeArr.length - 1; i >= 0; i--) {
                    arr.splice(removeArr[i], 1);
                }
                const type = arr[previewIndex + 1].substring(1, typeIndex);
                const title = arr[previewIndex + 1].substring(typeIndex + 1).trimStart().trimEnd();
                if (arr.length <= previewIndex + 3)
                    continue;
                const news = new bbsNewsModel_1.default(type, title, arr[previewIndex + 3], arr[previewIndex + 2]);
                tempArr.push(news);
            }
        }
        await fileHelper_1.default.writeFile("../../cache/news.json", JSON.stringify(tempArr), "w+");
        consola.success("Bbs news fetch succeeded");
    });
}
async function entry() {
    return new Promise(async (resolve, reject) => {
        consola.start("Starting Mcbbs Fetch Server....");
        consola.info("Reading config....");
        if (!await fileHelper_1.default.isFileExists("../../config.json").catch(err => reject(err))) {
            consola.error("Can not read file [config.json], please put this file to the path that same as [index.js] file!");
            process.exit(-1);
        }
        let config = JSON.parse(await fileHelper_1.default.readFile("../../config.json"));
        consola.success("Fetching config succeeded");
        consola.info(`Starting api server on port: ${config.port}`);
        try {
            const server = await common_1.ServerLoader.bootstrap(serverModel_1.ServerModel, { port: config.port });
            await server.listen();
            consola.success("Server initialized");
        }
        catch (e) {
            consola.error(e);
            process.exit(-1);
        }
        setInterval(checkLoop, config.checkInterval, config.pageCount);
    });
}
entry().catch((err) => {
    consola.error("An unexpected error occurred during fetching news");
    consola.error(err);
});
//# sourceMappingURL=index.js.map
