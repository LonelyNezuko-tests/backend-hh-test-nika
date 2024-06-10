import { ConfigModule } from "@nestjs/config"

ConfigModule.forRoot({
    envFilePath: '.env'
})

export default {
    type: 'mysql',
    host: process.env.db_mysql_host,
    port: parseInt(process.env.db_mysql_port),
    username: process.env.db_mysql_username,
    password: process.env.db_mysql_password,
    database: process.env.db_mysql_database,
    synchronize: false,
    bigNumberStrings: true,
    logging: false,
    entities: ['**/*.entity{ .ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}']
}