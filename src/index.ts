import HttpHelper from "./class/helper/httpHelper";
import UaHelper from "./class/helper/uaHelper";
import * as Consola from "consola";
import {JSDOM} from "jsdom";
import BbsNewsModel from "./model/bbsNewsModel";
import FileHelper from "./class/helper/fileHelper";
import ConfigModel from "./model/configModel";
import {Server} from "./server";
import {PlatformExpress} from "@tsed/platform-express";

async function checkLoop(count?: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        Consola.info("Starting fetching news....");
        count = count === null ? 1 : count;

        let result: BbsNewsModel[] = [];
        for (let i = 1; i <= count; i++) {
            const header = {
                "User-Agent": UaHelper.GetRandomUa()
            };
            const content = await HttpHelper.getRequest(`https://www.mcbbs.net/forum-news-${i}.html`, header, false).catch((err) => reject(err));
            const dom = new JSDOM(content as string, {contentType: "text/html"}).window.document;
            const newsListTable = dom.getElementById("threadlisttableid");

            let preArr: ChildNode[] = [];
            for (let i = 0; i < newsListTable.childNodes.length; i++) {
                const temp = newsListTable.childNodes[i].textContent.replace(/^\n*|\n*$/g, '');
                if (temp && !temp.startsWith("隐藏置顶帖")) {
                    if (temp.indexOf("预览") === -1)
                        continue;
                    if (temp.indexOf("]") === -1)
                        continue;
                    preArr.push(newsListTable.childNodes[i]);
                }
            }

            for (let i = 0; i < preArr.length; i++) {
                let tempArr: ChildNode[] = [];
                for (let j = 0; j < preArr[i].childNodes.length; j++) {
                    const tempText = preArr[i].childNodes[j].textContent.replace(/^\n*|\n*$/g, '');
                    if (!tempText)
                        continue;
                    tempArr.push(preArr[i].childNodes[j]);
                }

                if (tempArr.length === 0)
                    continue;

                for (let j = 0; j < tempArr.length; j++) {
                    if (tempArr[j].childNodes.length < 5)
                        continue;

                    const threadId = tempArr[j].parentElement.getAttribute("id");
                    const pageLinkEnd = threadId.substring(threadId.indexOf("thread")).replace("_", "-");
                    const link = `https://www.mcbbs.net/${pageLinkEnd}-1-1.html`;

                    let arr = tempArr[j].textContent.split("\n");
                    arr = arr.filter(Boolean).filter(a => (a !== "New" && !a.startsWith(" ...")));

                    if (arr.length === 0)
                        continue;

                    const previewIndex = arr.indexOf("预览");
                    if (previewIndex === -1)
                        continue;
                    if (arr.length <= previewIndex + 4)
                        continue;

                    const typeIndex = arr[previewIndex + 1].indexOf("]");
                    if (typeIndex === -1)
                        continue;
                    const type = arr[previewIndex + 1].substring(1, typeIndex);
                    const title = arr[previewIndex + 1].substring(typeIndex + 1).trim();
                    const author = arr[previewIndex + 2].trim();
                    const time = arr[previewIndex + 3].trim();

                    const news = new BbsNewsModel(type, title, time, author, link);
                    result.push(news);
                }
            }
        }

        await FileHelper.writeFile(`${__dirname}/cache/news.json`, JSON.stringify(result), "w+");
        Consola.success("Bbs news fetch succeeded");
    });
}

async function entry(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        Consola.start("Starting Mcbbs Fetch Server....");
        Consola.info("Reading config....");

        if (!await FileHelper.isFileExists("../../config.json").catch(err => reject(err))) {
            Consola.error("Can not read file [config.json], please put this file to the path that same as [index.js] file!");
            process.exit(-1);
        }

        let config: ConfigModel = JSON.parse(await FileHelper.readFile("../../config.json"));
        Consola.success("Fetching config succeeded");

        Consola.info(`Starting api server on port: ${config.port}`);
        try {
            const server = await PlatformExpress.bootstrap(Server, {port: config.port});
            await server.listen();
            Consola.success("Server initialized");
        } catch (e) {
            Consola.error(e);
            process.exit(-1);
        }

        checkLoop(20);
        setInterval(checkLoop, config.checkInterval, config.pageCount);
    });
}

entry().catch((err) => {
    Consola.error("An unexpected error occurred during fetching news");
    Consola.error(err);
});
