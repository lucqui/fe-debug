FROM node:22 as builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine

# Copy Nginx configuration files
COPY conf /etc/nginx

# Copy React build artifacts
COPY --from=builder /app/build /usr/share/nginx/html

# Run the script before starting Nginx
CMD ["/bin/sh", "-c", " nginx -g 'daemon off;'"]