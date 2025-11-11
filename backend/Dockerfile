FROM node:20-alpine

# Create working directory
WORKDIR /backend

# Copy package files and install dependencies first
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Install type definitions for build
RUN npm i -D @types/cors @types/jsonwebtoken @types/bcrypt @types/cookie-parser

# Build the project
RUN npm run build

EXPOSE 3000

# Run the app
CMD ["npm", "run", "start"]
