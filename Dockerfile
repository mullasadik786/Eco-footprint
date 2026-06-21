FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:18-alpine
WORKDIR /app
RUN npm install -g replace
COPY --from=builder /app/dist ./dist
COPY server.ts ./
RUN npm install typescript @types/node ts-node -g
RUN npm install express @types/express
EXPOSE 8080
ENV PORT=8080
CMD ["ts-node", "server.ts"]
