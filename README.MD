# Proyecto: Ambientes Computacionales con Docker

Este repositorio contiene una aplicación web que será desarrollada por nosotros(Debe cambiar estoantes de la presentacion final). Actualmente el proyecto incluye la configuración base para ejecutar una aplicación estática (HTML/CSS/JS) dentro de un contenedor Docker usando **NGINX**.

---

##  Estado actual del proyecto

-  Proyecto inicializado  
-  Archivo `Dockerfile` funcional  
-  Imagen Docker construida correctamente  
- Contenedor ejecutado con éxito  
-  HTML/CSS/JS aún en desarrollo por los colaboradores

---

##  Estructura del proyecto

proyecto_ambientes_computacionales/
├── Dockerfile
├── index.html # (Prueba básica por ahora)
├── README.md
├── .gitignore


---

##  Cómo ejecutar el contenedor

### 1. Construir la imagen

```bash
docker build -t proyecto-ambientes-computacionales .
2. Ejecutar el contenedor
bash
Copiar
Editar
docker run -d -p 8080:80 --name contenedor_ambientes proyecto-ambientes-computacionales
3. Ver la aplicación
Abre el navegador en:
👉 http://localhost:8080

👥 Guía para Colaboradores
Trabajar en la rama Develop

Realizar pull antes de subir cambios (push)

Usar mensajes de commit claros

Crear carpetas según sea necesario (/css, /js, etc.)

Mantener el código y los nombres de archivos organizados



-- Archivo de protección