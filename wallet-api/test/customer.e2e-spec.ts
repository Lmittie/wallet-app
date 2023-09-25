import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { TransactionDto } from '../src/presentation/dto/transaction.dto';
import { TransactionRepository } from '../src/infrastructure/repositories/transaction.repository';

describe('Customers e2e tests', () => {
  let app: INestApplication;

  const mockTransactionRepository = {
    saveChunks: (transactionChunks: TransactionDto[][]): void => {},
  };

  const CUSTOMER_URL = '/customer';
  const TRANSACTION_URL = '/transaction';

  const NON_EXISTENT_ID = '65117b81803aefc68b1c9e81';

  const customer1 = {
    _id: '106f1f77bcf86cd799439011',
    first_name: 'Alex',
    last_name: 'Smith',
    balance: 5000,
  };

  const customer2 = {
    _id: '65117b81803aefc68b1c9e82',
    first_name: 'John',
    last_name: 'Brown',
    balance: 1000,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(TransactionRepository)
    .useValue(mockTransactionRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Creating new customers POST /customer', () => {
    it('should create a new customer', () => {
      return request(app.getHttpServer())
        .post(CUSTOMER_URL)
        .set('X-API-KEY', process.env.API_KEY)
        .send(customer1)
        .then(response => {
          expect(response.status)
            .toEqual(201);

          expect(response.body)
            .toEqual(customer1);
        });
    });

    it('should return 400 when balance is negative value', () => {
      return request(app.getHttpServer())
        .post(CUSTOMER_URL)
        .set('X-API-KEY', process.env.API_KEY)
        .send({
          ...customer1,
          balance: -5000,
        })
        .expect(400);
    });

    it('should return 400 when last name is not provided', () => {
      return request(app.getHttpServer())
        .post(CUSTOMER_URL)
        .set('X-API-KEY', process.env.API_KEY)
        .send({
          _id: '6510bc776d74a1eb3899d9c4',
          first_name: 'I dont have a last name',
          balance: 5000,
        })
        .expect(400);
    });

    it('should return 400 when first name is not provided', () => {
      return request(app.getHttpServer())
        .post(CUSTOMER_URL)
        .set('X-API-KEY', process.env.API_KEY)
        .send({
          _id: '6510bc776d74a1eb3899d9c4',
          firstName: 'I dont have a first name',
          balance: 5000,
        })
        .expect(400);
    });

    it('should create another customer', () => {
      return request(app.getHttpServer())
        .post(CUSTOMER_URL)
        .set('X-API-KEY', process.env.API_KEY)
        .send(customer2)
        .then(response => {
          expect(response.status)
            .toEqual(201);

          expect(response.body)
            .toEqual(customer2);
        });
    });
  });

  describe('Get customer GET /customer/:id', () => {
    it('should return full information about customer 1', () => {
      return request(app.getHttpServer())
        .get(CUSTOMER_URL + '/' + customer1._id)
        .set('X-API-KEY', process.env.API_KEY)
        .then(response => {
          expect(response.status)
            .toEqual(200);

          expect(response.body)
            .toEqual(customer1);
        });
    });

    it('should return customer 1 name only', () => {
      return request(app.getHttpServer())
        .get(CUSTOMER_URL + '/' + customer1._id)
        .then(response => {
          expect(response.status)
            .toEqual(206);

          const { balance, ...partialCustomer } = customer1;
          expect(response.body)
            .toEqual(partialCustomer);
        });
    });

    it('should return 400 when provided id is not ObjectId', () => {
      return request(app.getHttpServer())
        .get(CUSTOMER_URL + '/wrong_id')
        .expect(400);
    });

    it('should return 404 when customer does not exist', () => {
      return request(app.getHttpServer())
        .get(CUSTOMER_URL + '/' + NON_EXISTENT_ID)
        .expect(404);
    });
  });

  describe('Update customer PATCH /customer/:id', () => {
    const updatedCustomer = {
      first_name: 'John',
      last_name: 'Poor',
      balance: 50,
    };

    it('should update customer', () => {
      return request(app.getHttpServer())
        .patch(CUSTOMER_URL + '/' + customer2._id)
        .send(updatedCustomer)
        .then(response => {
          expect(response.status)
            .toEqual(200);
          expect(response.body)
            .toEqual({
              _id: customer2._id,
              ...updatedCustomer,
            });
        });
    });

    it('should return 404 when customer does not exist', () => {
      return request(app.getHttpServer())
        .patch(CUSTOMER_URL + '/' + NON_EXISTENT_ID)
        .send(updatedCustomer)
        .expect(404);
    });
  });

  describe('Execute transactions POST /transaction', () => {
    const transactions = [
      { value: 130, latency: 600, customerId: customer1._id },
      { value: 200, latency: 850, customerId: customer1._id },
      { value: 70, latency: 250, customerId: customer1._id },
      { value: 120, latency: 1000, customerId: customer2._id },
      { value: 20, latency: 50, customerId: customer2._id },
      { value: 40, latency: 100, customerId: NON_EXISTENT_ID },
    ];

    it('should process transactions', () => {
      return request(app.getHttpServer())
        .post(TRANSACTION_URL)
        .set('X-API-KEY', process.env.API_KEY)
        .send(transactions)
        .expect(204);
    });

    it('should return 401 when api key is not provided', () => {
      return request(app.getHttpServer())
      .post(TRANSACTION_URL)
      .send(transactions)
      .expect(401);
    });

    it('should return 400 when body is not provided', () => {
      return request(app.getHttpServer())
        .post(TRANSACTION_URL)
        .set('X-API-KEY', process.env.API_KEY)
        .send()
        .expect(400);
    });

    it('should return 400 when latency value more than 1000', () => {
      return request(app.getHttpServer())
        .post(TRANSACTION_URL)
        .set('X-API-KEY', process.env.API_KEY)
        .send([{ value: 50, latency: 1001, customerId: customer1._id }])
        .expect(400);
    });

    it('should return 400 when value less than 0', () => {
      return request(app.getHttpServer())
        .post(TRANSACTION_URL)
        .set('X-API-KEY', process.env.API_KEY)
        .send([{ value: -50, latency: 1000, customerId: customer1._id }])
        .expect(400);
    });
  });

  describe('Delete customer DELETE /customer/:id', () => {
    it('should delete customer 1', () => {
      return request(app.getHttpServer())
        .delete(CUSTOMER_URL + '/' + customer1._id)
        .expect(204);
    });

    it('should delete customer 2', () => {
      return request(app.getHttpServer())
        .delete(CUSTOMER_URL + '/' + customer2._id)
        .expect(204);
    });

    it('should return 404 when customer does not exist', () => {
      return request(app.getHttpServer())
        .delete(CUSTOMER_URL + '/' + NON_EXISTENT_ID)
        .expect(404);
    });
  });

  afterAll(async () => {
    await app.close();
  })
});
