# Wallet application

This is a Nest.js wallet application for processing large amounts of requests.

## Application setup

### Prerequisites

You should have installed Docker and docker-compose.

See the [Docker website](http://www.docker.io/gettingstarted/#h_installation) for installation instructions.

### Build and run

Build and run the app without watchers in production mode:
```sh
. env/prod && docker compose up --build -d
```

Build and run the app with watchers:
```sh
. env/dev && docker compose up --build -d
```

### Testing

Run unit tests
```sh
. env/prod && docker compose exec api npm run test
```

Run e2e tests
```sh
. env/prod && docker compose exec api npm run test:e2e
```

## API

Once everything has started up, you should be able to access the API documentation via http://localhost:4000/api#/ on your host machine.

You can import Postman collection from `postman` directory.

## Microservices overview

### wallet-api

Wallet api is a Nest.js microservice with API that performs simple CRUD operations for customers and stores customers data in MongoDB customers collection.
It is responsible for creating jobs for Bull queue that handles customers transactions.

### wallet-processor

Wallet processor is a Nest.js consumer microservice that listens to the Bull queue with transaction tasks.
It processes jobs one by one and saves updated customers balance into the same customers collection via MongoDB.