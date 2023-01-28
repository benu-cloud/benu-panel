# Fetching the latest node image on alpine linux, to build and compile the frontend
FROM node:alpine as build-stage

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY package*.json /app/
RUN npm install

# Copying all the files in project
COPY ./ /app/

#Build appliction
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:stable
COPY --from=build-stage /app/build/ /usr/share/nginx/html

# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf