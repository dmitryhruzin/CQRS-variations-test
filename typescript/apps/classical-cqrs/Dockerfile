FROM node:20.13.1

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4 --activate

COPY ../../../ .

RUN yarn install --immutable

RUN yarn add -D @nestjs/cli

RUN target=classical-cqrs yarn build

WORKDIR /app/typescript/apps/m-cqrs

EXPOSE 8000

CMD ["yarn", "start"]