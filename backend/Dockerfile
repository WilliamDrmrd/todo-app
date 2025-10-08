FROM node:18-alpine

WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Start the application in development mode
CMD ["npm", "run", "start:dev"]
