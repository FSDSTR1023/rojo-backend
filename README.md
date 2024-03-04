# Health App (Grupo Rojo Backend)

Health App es una aplicación web que permite a los usuarios registrarse y acceder a información, publicar e interactuar con recetas saludables. Dentro de la misma estos usuarios tendran la posibilidad de buscar recetas filtrando por categorias, dificultad, tiempo de preparacion o nombre de la misma. Ademas tambien los usuarios podran seleccionar como favoritas, puntar y opinar sobre las recetas.

A su vez tambien los usuarios tendran a su disponibilidad una funcion que les permitira seguir a sus chefs favoritos y entre ellos mismos. Otra de las herramientas que permitiran a los clientes interactuar entre si, es un chat comunitario en el que podran ver quienes estan conectados y enviarse mensajes en tiempo real.

## First steps

1. Clonar el repositorio: git clone
2. Ejecutar npm install para instalar las dependencias del proyecto.
3. Configurar las variables de entorno en un archivo .env (Explicadas más abajo)
4. Ejecuta npm run dev para iniciar el servidor en modo desarrollo con nodemon.
5. Para ejecutar el modo de testeo ejecutar el comando npm test.

## Funcionalidades principales

- Autenticación y autorización a través de JWT.
- Registro y edicion de usuarios.
- Creacion, edicion y eliminacion de recetas.
- Busqueda de recetas y posibilidad de asignar como favoritas.
- Puntuacion, opinion y rating de recetas.
- Seguimiento entre usuarios y chat en tiempo real.

## Variables de entorno

- DB_USER, DB_PASSWORD, DB_SERVER, DB_NAME para la conexión a MongoDB.
- JWT_SECRET para la generación de tokens de acceso.
- BREVO_NAME, BREVO_EMAIL y BREVO_APISECRET para el envio de mails automatico.
- NODE_ENV para el modo desarrollo.

## Tecnologias utilizadas

- NodeJS + Express para el backend.
- MongoDB + Mongoose para la BBDD.
- JSON Web Tokens (JWT) para la autenticación.
- Bcrypt.js para el hash de contraseñas.
- Nodemon para la ejecución del servidor en modo de desarrollo.
- Cookie-parser para el manejo de cookies en Express.
- Cors para habilitar el intercambio de recursos entre diferentes dominios.
- Dotenv para la carga de variables de entorno desde un archivo.
- Socket.io para la mensajería en tiempo real.
- Brevo para el envio de mails automatico.
- Cloudinary para el almacenamiento y gestión de archivos multimedia en la nube.
- ESLint para el linting del código.
- Prettier para el formateo consistente del código.
- React.js para el frontend.
- React Router para la navegación dentro de la aplicación.
- Axios para realizar solicitudes HTTP a la API del backend.
- Jest, MongoDB Memory Server y Supertest para el testeo unitario.
- Vite.js para el build y despliegue
- ANTDesign, Headless UI y React Select para la creacion de componentes visuales.
- React Hook Form para la creacion de formularios.

## Relaciones entre Entidades

Usuarios

- Como usuario puedo crear, editar o eliminar mis propias recetas.
- Como usuario puedo comentar, puntuar y marcar como favoritas recetas de otros usuarios.
- Como usuario puedo seguir a otros usuarios para ver sus recetas.

Recetas

- Las recetas tienen un autor, que es un usuario registrado.
- Las recetas pueden tener comentarios, puntuaciones y un rating que promedia todas las puntuaciones.
- Las recetas pueden estar marcadas como favoritas.
- Las recetas pueden ser modificadas por el autor de la misma.

## Vision y mision del proyecto.

En nuestro proyecto, visualizamos una comunidad en línea vibrante y comprometida con la salud y el bienestar. Queremos crear un espacio donde las personas puedan conectarse a través de la comida saludable, compartiendo no solo recetas, sino también experiencias y consejos para llevar un estilo de vida más saludable y feliz.

Nuestra misión es empoderar a los usuarios para que tomen el control de su salud a través de la alimentación. Queremos proporcionarles las herramientas y la inspiración necesarias para que puedan tomar decisiones informadas y disfrutar del proceso de cocinar y comer de manera saludable. Nos esforzamos por fomentar una comunidad inclusiva donde todos puedan sentirse bienvenidos y apoyados en su viaje hacia una vida más saludable.

Nota: El proyecto se encuentra en una fase de desarrollo, por lo que las funciones y el desarrollo de la interfaz del usuario son basicas y seguiran mejorando con el tiempo.
