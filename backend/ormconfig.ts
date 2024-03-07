import { SnakeNamingStrategy } from '@app/core/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

// if (!module.hot /* for webpack HMR */) {
//     process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// }

dotenv.config({
  path: `../.env`
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

export = {
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL_CERT
    ? {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CERT
      }
    : false,
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['src/migrations/*{.ts,.js}'],
  seeds: ['src/seeds/**/*.seed{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations'
  }
};
