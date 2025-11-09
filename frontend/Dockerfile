FROM node


ENV VITE_BACKEND_DOMAIN=http://localhost:3000 \
    VITE_RAZORPAY_KEY_ID=${VITE_RAZORPAY_KEY_ID}

RUN mkdir -p /frontend
COPY . /frontend
WORKDIR /frontend
RUN npm install

CMD [ "npm", "run", "dev" ]
