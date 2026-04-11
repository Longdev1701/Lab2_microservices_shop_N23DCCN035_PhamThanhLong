FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY product-service/package*.json ./
RUN npm ci

COPY product-service/prisma ./prisma
COPY product-service/prisma.config.ts ./prisma.config.ts
COPY product-service/src ./src

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
