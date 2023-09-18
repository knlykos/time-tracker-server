import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Client, types } from 'cassandra-driver'; // Update this import to point to your AppModule
import { faker } from '@faker-js/faker';
import { TokenTypeEnum } from '../src/auth/types/token-type.enum/token-type.enum';

fdescribe('UserController (e2e)', () => {
  let app: INestApplication;
  let dbClient: Client;
  const globalEmail = faker.internet.email().toLowerCase();
  const globalPassword = faker.internet.password();
  const globalActivationToken = '';
  const tokenTypeEnum = TokenTypeEnum;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // dbClient = moduleFixture.get<Client>('PLANT43_DB_CASSANDRA'); // Retrieve your injected Cassandra client

    await app.init();
  });

  it.only('Should Sign up a new User and validate and validate metadata', async () => {
    return new Promise(async (resolve, reject) => {
      const payload = {
        email: globalEmail,
        username: faker.internet.userName(),
        password: globalPassword,
        phoneNumber: faker.phone.number(),
      };
      try {
        const response = await request(app.getHttpServer())
          .post('/auth/signup') // Your API endpoint
          .send(payload)
          .expect(201); // The expected HTTP status code

        // const user = await dbClient.execute(
        //   'SELECT * FROM users_by_email where email = ?',
        //   [globalEmail],
        // );
        // const token = await dbClient.execute(
        //   'SELECT * FROM tokens WHERE user_id = ? AND type = ? ALLOW FILTERING',
        //   [user.rows[0].user_id, tokenTypeEnum.ACTIVATION],
        // );
        // globalActivationToken = token.rows[0].token;
        // resolve({});
      } catch (e) {
        console.log(e);
        reject(e); // Cambia resolve por reject aquí
      }
    });
  });

  it('Should activate the new account using a valid token for activation', async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await request(app.getHttpServer())
          .get('/auth/activation/' + globalActivationToken)
          .expect(200);

        console.log(response);
      } catch (e) {
        console.log(e);
        reject(e); // Cambia resolve por reject aquí
      }

      resolve({});
    });
  });

  it('Should login a user and return a valid token', async () => {
    return new Promise(async (resolve, reject) => {
      const payload = {
        email: globalEmail,
        password: globalPassword,
      };
      try {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(payload)
          .expect(200);
        expect(response.body).toHaveProperty('token');
      } catch (e) {
        console.log(e);
        reject(e); // Cambia resolve por reject aquí
      }
      resolve({});
    });
  });
  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    jest.setTimeout(10000);
    await app.close();
  });
});
