import {Controller, Get, PathParams} from "@tsed/common";
import FileHelper from "../../../class/helper/fileHelper";
import {BadRequest} from "ts-httpexceptions";
import BbsNewsModel from "../../../model/bbsNewsModel";

@Controller("/api/news")
export class NewsApi {
    /**
     * Get News Default (20 news)
     * @return news object
     */
    @Get("/")
    async getNewsDefault(): Promise<any> {
        if(await FileHelper.isFileExists("../../cache/news.json")){
            const content = await FileHelper.readFile("../../cache/news.json");
            const contentModel = JSON.parse(content) as BbsNewsModel[];

            if(contentModel.length >= 20){
                return JSON.stringify(contentModel.slice(0, 20));
            }
            else{
                return JSON.stringify(contentModel);
            }
        }
        else{
            return new BadRequest("News did not found");
        }
    }

    /**
     * Get numbers of news by count
     * @param count
     */
    @Get("/:count")
    async getCountNews(@PathParams("count") count: number): Promise<any> {
        if(await FileHelper.isFileExists("../../cache/news.json")){
            const content = await FileHelper.readFile("../../cache/news.json");
            const contentModel = JSON.parse(content) as BbsNewsModel[];

            if(count <= 0){
                return [];
            }

            if(contentModel.length >= count){
                return JSON.stringify(contentModel.slice(0, count));
            }
            else{
                return JSON.stringify(contentModel);
            }
        }
        else{
            return new BadRequest("News did not found");
        }
    }
}
