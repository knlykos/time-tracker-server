import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PlantATreeDbModule } from '@plant43db/plant-a-tree-db';
import { auth } from "cassandra-driver";
import PlainTextAuthProvider = auth.PlainTextAuthProvider;

export const commonModuleImportConf = [
  ConfigModule.forRoot({
    envFilePath: '.development.env',
  }),
  PlantATreeDbModule.forRoot({
    contactPoints: [process.env.CASSANDRA_HOST],
    localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
    keyspace: process.env.CASSANDRA_KEYSPACE,
    authProvider: new PlainTextAuthProvider('cassandra', 'cassandra'),
    pooling: {
      coreConnectionsPerHost: {
        '0': 8, // remote hosts
        '1': 2, // local hosts
        '2': 1, // used hosts
      },
      maxRequestsPerConnection: 128,
      heartBeatInterval: 60000,
    },
  }),
  MailerModule.forRoot({
    transport: {
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    },
    defaults: {
      from: '"nest-modules" <modules@nestjs.com>',
    },
    template: {
      dir: './public/email-templates',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
];
