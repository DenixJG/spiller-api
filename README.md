<h1 align="center">Spiller Music</h1>
<hr>

- [1 - Introducción](#1---introducción)
- [2 - Desarrollo](#2---desarrollo)
- [3 - Variables de entorno](#3---variables-de-entorno)
- [4 - Autores](#4---autores)

## 1 - Introducción
Spiller se centra principalmente en guardar canciones de artistas que desean subir sus trabajos para el
publico, es decir que todo lo que un artista suba lo hacer sin derechos de autor y por ende de uso libre
por cualquier persona que use la aplicación.

## 2 - Desarrollo
Es importante disponer de [`Node.js`](https://nodejs.org/) instalado y también de su gestor de paquetes `npm`, este suele instalarse de forma automatica la instalar Node.js.

**Software Necesario**
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Sistema de Base de datos)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (Opcional)

**Clonar el repositorio**
```
git clone https://github.com/DenixJG/spiller-api.git
```

**Instalar las dependencias**

Para instalar las dependencias del proyecto se debe ejecutar en la raíz del proyecto el siguiente comando:
```
npm install
```

**Iniciar la APP Web**

***ANTES DE INICIAR***: *Tener iniciado el servicio de `mongod` antes de iniciar la APP*

Hay dos comandos que se pueden usar para iniciar el servidor web y empezar a ver como funciona la aplicación.

- Ejecutar sin compilar, ejecuta directamente los ficheros `.ts`.
    ```
    npm run dev
    ```

- Compilar los ficheros `.ts` a `.js`. De esta forma se compila todos los ficheros de TypeScript pero carpetas importantes como pueda ser `public` o `views` no se compilan por lo que hay que moverlas manualmente al directorio de salida, siendo `dist` dicho directorio.
    ```
    npm run start
    ```

## 3 - Variables de entorno
Se pueden usar las siguientes variables de entorno:

 - `NODE_ENV` Define el tipo de entorno de la APP, por defecto `development`.
 - `PORT` Puerto a usar por la aplicación, por defecto `4000`.
 - `MONGODB_URI` URI de conexión para MongoDB.
 - `EXPRESS_SESSION_SECRET` Clave para la sesión de `express`.
 - `JWT_SECRET` Clave para `jsonwebtoken`.
 - `ADMIN_EMAIL` Correo para el usuario administrador.
 - `ADMIN_PASSWORD` Contraseña para el usuario administrador.
 - `ADMIN_USERNAME` Nombre de usuario para el administrador.

Se puede configurar un fichero `.env` para definir las variables.

```txt
# APP
PORT=4000
NODE_ENV=development

#MongoDB
MONGODB_URI=mongodb://localhost:27017/{dbname}

# Secrets
EXPRESS_SESSION_SECRET=secret
JWT_SECRET=secret

# Admin user
ADMIN_EMAIL=admin@localhost.com
ADMIN_PASSWORD=admin
ADMIN_USERNAME=admin
```

## 4 - Autores
- [Pedro Jorquera Hoyas](https://github.com/pedrojorquera)
- [Rafael Ionut Popescu](https://github.com/DenixJG)