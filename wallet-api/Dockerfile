FROM node:20.7.0-alpine3.17 AS build

RUN addgroup -S walletuser && \
    adduser -S -h /app -G walletuser walletuser
RUN apk --no-cache update \
    && apk --no-cache add sudo

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY tsconfig.json tsconfig.build.json nest-cli.json .eslintrc.js ./
COPY src src/
COPY test test/

RUN npm run build

CMD exec npm run start:dev

EXPOSE 4000

FROM build as release
RUN npm i --production

CMD exec node dist/main

USER walletuser

EXPOSE 4000