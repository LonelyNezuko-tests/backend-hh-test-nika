import { ConfigModule } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import databaseOptions from './options'

delete databaseOptions.synchronize

const dataSource = new DataSource(databaseOptions as DataSourceOptions)
dataSource.initialize()

export default dataSource