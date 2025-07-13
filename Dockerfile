# Versión de Node utilizada
FROM node:22.15.0

# Directorio para la imagen de Docker
WORKDIR /usr/src/app

# Se copia el package.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de la aplicación al directorio de trabajo
COPY . .

# Expone el puerto en el que la aplicación escuchará
EXPOSE 3000

# Comando que se ejecutará al iniciar el contenedor
CMD ["node", "server.js"]
