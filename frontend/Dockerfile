# FROM node:lts
# # Set working directory
# WORKDIR /app

# # install node modules
# COPY ./package*.json .
# RUN npm install

# # Copy all files from current directory to working dir in image
# COPY . .

# ENV PORT 80

# ENTRYPOINT [ "npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80" ]
# Source: https://khromov.se/dockerizing-your-sveltekit-applications-a-practical-guide/
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 80
ENV NODE_ENV=production
CMD [ "node", "build" ]