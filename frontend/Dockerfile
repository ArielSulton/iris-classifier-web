FROM node:18-alpine

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]