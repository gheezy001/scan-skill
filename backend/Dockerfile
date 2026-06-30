FROM node:22-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm install --include=dev
RUN npm run build
RUN npx prisma generate

EXPOSE 8000

CMD ["npm", "run", "start:railway"]