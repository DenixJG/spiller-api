FROM node:16-alpine

# Actualizar el sistema
RUN apk update

# Crear una carpeta de trabajo
WORKDIR /app

# Copiar los fichero .json a la carpeta de trabajo
COPY package*.json ./
COPY tsconfig.json ./

# Copiar la carpeta src a la carpeta de trabajo
COPY src /app/src

# Comprobar lista de ficheros
RUN ls -a

# Instalar dependencias
RUN npm install
RUN npm run build

# Copiar carpetas que no se compilan
COPY src/views /app/dist/views
COPY src/public /app/dist/public

# Indicar el puerto de escucha
EXPOSE 80

# Ejectuar el comando
CMD ["node", "./dist/index.js"]
