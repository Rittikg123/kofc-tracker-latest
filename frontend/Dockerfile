# frontend/Dockerfile
FROM node:18

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Use a simple static server for React
RUN npm install -g serve
CMD ["serve", "-s", "dist"]
EXPOSE 3000