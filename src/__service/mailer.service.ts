import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import CONFIG_MAILER from 'common/config/mailer.config'

@Injectable()
export class MailerService {
    private readonly transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
    constructor() {
        if(CONFIG_MAILER.connect.host === 'changeme'
            || CONFIG_MAILER.connect.auth.pass === 'changeme'
            || CONFIG_MAILER.connect.auth.user === 'changeme'
            || CONFIG_MAILER.connect.port === 'changeme') console.error('\x1b[31m%s\x1b[0m', `[Service.Mailer] Failed to create transport. View common/config/mailer.config`)
        else {
            this.transport = nodemailer.createTransport(CONFIG_MAILER.connect as undefined as SMTPTransport.Options)
            console.log(`[Service.Mailer] Create transport`)
        }
    }

    async send(to: string, subject: string, text?: string, html?: string, from?: string): Promise<SMTPTransport.SentMessageInfo> {
        if(!to) throw Error("[Service.Mailer.Send] The 'to' parameter is not specified")
        if(!subject) throw Error("[Service.Mailer.Send] The 'subject' parameter is not specified")
        if(!text && !html) throw Error('[Service.Mailer.Send] It must be either text or html')

        if(!this.transport || !this.transport.sendMail) throw Error(`[Service.Mailer.Send] Transport not found`)

        if(!from) {
            from = CONFIG_MAILER.connect.auth.user
            if(CONFIG_MAILER.connect._host && CONFIG_MAILER.connect._host.from) from = CONFIG_MAILER.connect._host.from
        }

        return await this.transport.sendMail({
            from,
            to,
            subject,
            text,
            html
        })
    }
}