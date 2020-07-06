FROM node:10-slim
WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "start"]