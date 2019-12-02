import {ContentType, Controller, Get, Req} from "@tsed/common";
import * as Express from "express";

@Controller("/controllers/version")
export class VersionApi {
    /**
     * Get Api Version
     *
     * @param request
     * @returns {{name: string, name: string, description: string, requestId: string}}
     */
    @ContentType("json")
    @Get()
    getVersion(@Req() request: Express.Request) {
        return {
            name: "Mcbbs news fetch server",
            version: process.env.version,
            description: process.env.description,
            requestId: request.id
        }
    }
}
