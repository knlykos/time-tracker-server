import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Client, types } from 'cassandra-driver'; // Update this import to point to your AppModule
import { faker } from '@faker-js/faker';

fdescribe('UserController (e2e)', () => {
  let app: INestApplication;
  let dbClient: Client;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dbClient = moduleFixture.get<Client>('PLANT43_DB_CASSANDRA'); // Retrieve your injected Cassandra client

    await app.init();
  });

  it.skip('Should Sign up a new User and validate and validate metadata', async () => {
    const payload = {
      email: faker.internet.email() + '-dev',
      username: faker.internet.userName(),
      password: faker.internet.password(),
      phoneNumber: faker.phone.number(),
    };
    const response = await request(app.getHttpServer())
      .post('/auth/signup') // Your API endpoint
      .send(payload)
      .expect(201); // The expected HTTP status code

    // const queryResultByEmail = await dbClient.execute(
    //   'SELECT * FROM users_by_email WHERE email = ?',
    //   [payload.email],
    //   { prepare: true },
    // );
    // const uuid = queryResultByEmail.rows[0].get('user_id');
    // expect(queryResultByEmail.rows).toHaveLength(1);
    // expect(uuid).toBeDefined();
    // const queryResultByUuid = await dbClient.execute(
    //   'SELECT * FROM users WHERE user_id = ?',
    //   [uuid],
    //   { prepare: true },
    // );
    // expect(queryResultByUuid.rows).toHaveLength(1);

    return new Promise((resolve) => {
      resolve({});
    });
  }, 20000);

  it.only('Should activate the new account using a valid token for activation', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjdkN2Y3YWQtNmI3OC00NjA0LTlkNTQtZDIwODhhM2FiZmIwIiwiZW1haWwiOiJSYW91bDQwQGhvdG1haWwuY29tIiwiaWF0IjoxNjkzODYyOTQ3LCJleHAiOjE2OTY0NTQ5NDcsImlzcyI6Ik5LT0RFWCJ9.xahdCDOoME70rJplKaEo7OWUaWpTh_Lu5KBEceLqr9w';
    const response = await request(app.getHttpServer())
      .get('/auth/activation/' + token)
      .expect(200);

    console.log(response);
    return new Promise((resolve) => {
      resolve({});
    });
  });

  afterAll(async () => {
    jest.setTimeout(10000);
    await app.close();
  });
});
