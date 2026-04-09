# Use Node
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npx prisma generate

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Run app
CMD ["npm", "start"]