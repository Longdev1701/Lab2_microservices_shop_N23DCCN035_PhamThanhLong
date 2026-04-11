FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PRODUCT_SERVICE_PORT=3001
ENV ORDER_SERVICE_PORT=3002
ENV AUTH_SERVICE_PORT=3003
ENV PRODUCT_SERVICE_URL=http://127.0.0.1:3001
ENV ORDER_SERVICE_URL=http://127.0.0.1:3002
ENV AUTH_SERVICE_URL=http://127.0.0.1:3003

COPY product-service/package*.json ./product-service/
RUN cd product-service && npm ci

COPY auth-service/package*.json ./auth-service/
RUN cd auth-service && npm ci

COPY order-service/package*.json ./order-service/
RUN cd order-service && npm ci

COPY api-gateway/package*.json ./api-gateway/
RUN cd api-gateway && npm ci

COPY product-service ./product-service
COPY auth-service ./auth-service
COPY order-service ./order-service
COPY api-gateway ./api-gateway
COPY scripts ./scripts

RUN cd product-service && npx prisma generate
RUN cd auth-service && npx prisma generate

EXPOSE 3000

CMD ["node", "scripts/start-all-services.js"]
