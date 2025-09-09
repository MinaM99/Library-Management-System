# Frontend Dockerfile for Next.js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app .
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
EXPOSE 3001
CMD ["npm", "start"]
