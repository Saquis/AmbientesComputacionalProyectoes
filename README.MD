# Proyecto: Ambientes Computacionales con Docker

Este repositorio contiene una aplicación web backend y frontend para el proyecto "Pet Matcher", desarrollada con **Node.js**, **Express**, **MongoDB** y gestionada dentro de contenedores **Docker**.

Actualmente incluye:
- API REST para gestión de mascotas y usuarios con autenticación.
- Configuración para conexión a MongoDB local desde Docker.
- Uso de `multer` para subir imágenes.
- Contenedor Docker para la API backend.
- Recomendaciones para configuración de MongoDB en Windows para acceso externo.

---

## Estado actual del proyecto

- Proyecto inicializado con Node.js y MongoDB  
- Dockerfile para backend construido correctamente  
- Imagen Docker creada y contenedor ejecutado con éxito  
- Conexión a MongoDB local desde el contenedor usando `host.docker.internal`  
- Rutas API para CRUD mascotas, registro/login usuarios y manejo de "likes"  
- Upload de imágenes con multer configurado  
- Middleware de CORS y body-parser funcionando  
- Frontend aún en desarrollo (podría ser separado o integrado)  

---

## Estructura del proyecto

.
├── Dockerfile              # Instrucciones para la imagen
├── server.js               # API con Express
├── package.json            # Dependencias (mongoose, express, etc.)
├── uploads/                # Carpeta para archivos (si aplica)
└── public/                 # Frontend (si incluye)
└── README.MD               # Documentación y guía de uso


---

## Requisitos previos

- Tener MongoDB instalado localmente  
- Configurar MongoDB para aceptar conexiones externas editando `mongod.cfg`:

```yaml
net:
  bindIp: 0.0.0.0  # Permite conexiones externas

Crear regla de firewall que permita el puerto 27017 TCP entrante.

(Opcional) Tener Docker Desktop instalado para construir y correr contenedores.


---

## Cómo construir y correr el backend en Docker

Construir la imagen Docker del backend:

 - docker build -t api-mascotas .

 Ejecutar el contenedor exponiendo el puerto 3000:

- docker run -p 3000:3000 api-mascotas

- Verificar que el backend corre en:

- http://localhost:3000

---

Cómo colaborar:

- Trabajar siempre en la rama develop

- Hacer pull antes de subir cambios (para evitar conflictos)

- Usar mensajes de commit descriptivos y claros

- Organizar código y archivos, crear carpetas (/uploads, /routes, /models) según sea necesario

- No subir carpetas de imágenes (uploads/) al repositorio, agregar en .gitignore

- Documentar cualquier cambio importante en este README o en documentos asociados



- Nota importante sobre el backend y React
En el código backend inicialmente estaba la línea:

const { use } = require('react'); :

¿Por qué se eliminó o comentó esta línea?

React es una librería para construir interfaces de usuario en el frontend, no se utiliza en el backend.

Intentar cargar React en el backend generaba errores (MODULE_NOT_FOUND) cuando se ejecutaba el servidor, especialmente dentro del contenedor Docker.

Para evitar estos errores y simplificar la configuración, se decidió eliminar o comentar esta línea.

Esto permite que el servidor Node.js funcione correctamente sin dependencias innecesarias de frontend.

Cualquier duda o aporte, por favor crear issues o comunicarse en el canal del proyecto.


