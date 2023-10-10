# Используем официальный образ Node.js в качестве базового образа
FROM node:14-alpine as build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта внутрь контейнера
COPY . .

# Собираем React-приложение для продакшн
RUN npm run build

# Конечный образ, который будет развернут в production-среде
FROM nginx:alpine

# Копируем файлы собранного React-приложения из предыдущего образа
COPY --from=build /app/build /usr/share/nginx/html

# Опционально: можно скопировать конфигурационный файл NGINX, если требуется настройка
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 3001 для доступа к приложению
EXPOSE 3001

# Запускаем NGINX в фоновом режиме при запуске контейнера
CMD ["nginx", "-g", "daemon off;"]