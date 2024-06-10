import { Body, Controller, Get, Param, Post, Put, Query, Req, Res } from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { RequestsCreateDTO, RequestsUpdateDTO } from "./requests.dto";
import { Request, Response } from "express";
import { RequestEntityStatus } from "./requests.entity";

@Controller("requests")
export class RequestsController {
    constructor(
        private readonly requestsService: RequestsService
    ) {}
    
    // get
    // @UseGuards(AuthGuard, IsModeratorGuard) // предпологаемая проверка авторизации пользователя и проверка на то, что он является ответственным лицом
    @Get()
    getList(
        @Res() res: Response,
        @Req() req: Request,

        @Query('take') take?: number,
        @Query('list') list?: number,

        @Query('status') status?: RequestEntityStatus,

        @Query('order') order?: 'createAt' | 'status',
        @Query('orderType') orderType?: 'asc' | 'desc'
    ) {
        return this.requestsService.getList(res, req, take, list, status, order, orderType)
    }


    // post
    @Post()
    create(
        @Res() res: Response,
        @Req() req: Request,

        @Body() data: RequestsCreateDTO
    ) {
        return this.requestsService.create(res, req, data)
    }


    // put
    @Put('/:id')
    changeStatus(
        @Res() res: Response,
        @Req() req: Request,

        @Param('id') id: number,
        @Body() data: RequestsUpdateDTO
    ) {
        return this.requestsService.changeStatus(res, req, id, data)
    }


    // delete
}