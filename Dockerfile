FROM node:18 AS build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build


# ===== NGINX STATIC CONTAINER =====

FROM nginx:alpine

# Копируем билд в стандартную директорию nginx
COPY --from=build /app/build /usr/share/nginx/html

# Удалим дефолтный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем свой конфиг
COPY nginx/frontend.conf /etc/nginx/conf.d
