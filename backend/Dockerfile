FROM node:20-alpine

# Create working directory
WORKDIR /backend

# Copy package files and install dependencies first
COPY package*.json ./
RUN npm install

# Copy the rest of the backend files
COPY . .

# Define arguments for sensitive environment variables
# (these will be provided during build or runtime, not hardcoded)
ARG YOUTUBE_API_KEY
ARG GEMINI_API_KEY
ARG RESEND_API
ARG MONGO_URI
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASS
ARG JWT_SECRET
ARG FRONTEND_DOMAIN
ARG RAZORPAY_KEY_ID
ARG RAZORPAY_KEY_SECRET
ARG NITYASHA_API_KEY
ARG PERPLEXITY_API_KEY

# Set environment variables
ENV YOUTUBE_API_KEY=${YOUTUBE_API_KEY} \
    GEMINI_API_KEY=${GEMINI_API_KEY} \
    RESEND_API=${RESEND_API} \
    MONGO_URI=${MONGO_URI} \
    REDIS_HOST=${REDIS_HOST} \
    REDIS_PORT=${REDIS_PORT} \
    REDIS_PASS=${REDIS_PASS} \
    JWT_SECRET=${JWT_SECRET} \
    FRONTEND_DOMAIN=${FRONTEND_DOMAIN} \
    RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID} \
    RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET} \
    NITYASHA_API_KEY=${NITYASHA_API_KEY} \
    PERPLEXITY_API_KEY=${PERPLEXITY_API_KEY}


EXPOSE 3000

CMD ["npm", "run", "start"]
