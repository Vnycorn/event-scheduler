FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install -g pnpm
RUN pnpm install 

RUN npm run build

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
EXPOSE 3000
CMD ["npm", "start"]
