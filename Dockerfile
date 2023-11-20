# Utiliza una imagen base con Node.js
FROM node:14

# Establece el directorio de trabajo en la aplicación
WORKDIR /usr/src/app

# Copia los archivos de configuración e instalación de dependencias de la aplicación
COPY package*.json ./
RUN npm install

# Instala Chromium
RUN apt-get update && apt-get install -y chromium

# Copia el resto de la aplicación al directorio de trabajo
COPY . .

# Expone el puerto en el que la aplicación escuchará (ajústalo según las necesidades de tu aplicación)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
