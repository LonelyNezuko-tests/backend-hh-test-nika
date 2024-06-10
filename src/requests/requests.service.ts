import { InjectRepository } from "@nestjs/typeorm";
import { RequestEntity, RequestEntityStatus } from "./requests.entity";
import { FindManyOptions, Repository } from "typeorm";
import { Injectable, OnModuleInit, Res } from "@nestjs/common";
import { Request, Response } from "express";
import ResponseSend from "common/ResponseSend";
import { RequestsCreateDTO, RequestsUpdateDTO } from "./requests.dto";
import { ModuleRef } from "@nestjs/core";
import { MailerService } from "src/__service/mailer.service";

@Injectable()
export class RequestsService {
    private readonly mailerService: MailerService
    constructor(
        @InjectRepository(RequestEntity)
        private readonly requestRepository: Repository<RequestEntity>,

        private readonly moduleRef: ModuleRef
    ) {
        this.mailerService = this.moduleRef.get(MailerService, { strict: false })
    }

    
    async getList(
        res: Response,
        req: Request,

        take?: number,
        list?: number,

        status?: RequestEntityStatus,

        order?: 'createAt' | 'status',
        orderType?: 'asc' | 'desc'
    ) {
        if(take) {
            take = parseInt(take as any)
            if(isNaN(take) || take < 5) {
                return ResponseSend.error(res, 400, "Incorrect data [take]")
            }
        }
        else take = 20

        if(list) {
            list = parseInt(list as any)
            if(isNaN(list) || list < 1) {
                return ResponseSend.error(res, 400, "Incorrect data [list]")
            }
        }
        else list = 1

        if(status && (status !== 'active' && status !== 'denied' && status !== 'resolved')) {
            return ResponseSend.error(res, 400, "Incorrect data [status]. Possible values: active, denied, resolved")
        }

        if(order && (order !== 'createAt' && order !== 'status')) {
            return ResponseSend.error(res, 400, "Incorrect data [order]. Possible values: createAt, status")
        }
        if(orderType && (orderType !== 'asc' && orderType !== 'desc')) {
            return ResponseSend.error(res, 400, "Incorrect data [orderType]. Possible values: asc, desc")
        }

        if(order && !orderType) orderType = 'asc'

        const findOptions: FindManyOptions<RequestEntity> = {
            take,
            skip: (list - 1) * take
        }

        if(status) {
            findOptions.where = {}
            findOptions.where.status = status
        }
        if(order) {
            findOptions.order = {}

            if(order === 'createAt') findOptions.order.createAt = orderType
            else if(order === 'status') findOptions.order.status = orderType
        }

        const requests = await this.requestRepository.find(findOptions)
        if(!requests.length) {
            return ResponseSend.error(res, 404, "Requests not found")
        }

        ResponseSend.success(res, requests)
    }

    async create(
        res: Response,
        req: Request,

        data: RequestsCreateDTO
    ) {
        const insert = await this.requestRepository.insert({
            name: data.name,
            email: data.email,
            message: data.message,
            updateAt: null
        })
        if(!insert) {
            return ResponseSend.error(res, 500, "Failed to create requests")
        }

        ResponseSend.success(res, "Request created")
    }

    async changeStatus(
        res: Response,
        req: Request,

        id: number,
        data: RequestsUpdateDTO
    ) {
        id = parseInt(id as any)
        if(isNaN(id) || id < 1) {
            return ResponseSend.error(res, 400, "Incorrect param [id]")
        }

        const request = await this.requestRepository.findOne({
            where: {
                id
            }
        })
        if(!request) {
            return ResponseSend.error(res, 404, "Request not found")
        }

        await this.requestRepository.update({ id: request.id }, {
            comment: data.comment,
            status: data.status,
            updateAt: new Date()
        })

        try {
            await this.mailerService.send(request.email, 'Request change status', `Your request has changed its status.\n\n\
                Status: ${data.status[0].toUpperCase() + data.status.slice(1, data.status.length)}\n\
                Comment: ${data.comment}`)

            ResponseSend.success(res, "Request updated")
        }
        catch(e) {
            ResponseSend.success(res, "Request updated without mail sendThe request was changed without sending mail")
            console.error('\x1b[31m%s\x1b[0m', e)
        }
    }
}