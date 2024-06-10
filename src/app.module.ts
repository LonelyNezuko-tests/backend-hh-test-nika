import { Module } from '@nestjs/common';
import { RequestsModule } from './requests/requests.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './__service/mailer.service';

import databaseOptions from 'database/options'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        TypeOrmModule.forRoot(databaseOptions as TypeOrmModuleOptions),
        RequestsModule
    ],
    controllers: [],
    providers: [
        MailerService
    ],
})
export class AppModule {}
