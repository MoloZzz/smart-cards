import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import config from '../../../config';

const db = config().db;
export default new DataSource({
  type: 'postgres',
  host: db.host,
  port: Number(db.port),
  username: db.username,
  password: db.password,
  database: db.database,
  synchronize: false,
  logging: true,
  migrations: [process.cwd() + '/apps/service-core/src/common/migrations/*.ts'],
  entities: [process.cwd() + '/apps/service-core/src/common/entities/*.ts'],
  migrationsTableName: '_migrations',
  namingStrategy: new SnakeNamingStrategy(),
});
