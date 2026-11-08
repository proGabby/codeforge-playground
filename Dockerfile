# Multi-stage Dockerfile: Golang + Node.js for CodeForge
FROM golang:1.22-alpine AS go-env
FROM node:20-alpine

# Copy Go binary and standard library from official Go image
COPY --from=go-env /usr/local/go /usr/local/go
ENV PATH="/usr/local/go/bin:${PATH}"

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files & build production frontend
COPY . .
RUN npm run build

EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

CMD ["npm", "start"]

