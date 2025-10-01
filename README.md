# API de RentAll

Esta es la API backend para la aplicación RentAll, construida con NestJS, GraphQL y PostgreSQL.

---

## ✨ Características

* **Framework**: [NestJS](https://nestjs.com/)
* **API**: GraphQL (enfoque Code-First con `@nestjs/graphql`)
* **Base de Datos**: PostgreSQL
* **ORM**: TypeORM con sistema de migraciones para el versionado del esquema.
* **Seguridad**: Hasheo de contraseñas con `bcrypt`.
* **Configuración**: Manejo de variables de entorno con `@nestjs/config` (`.env`).

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

* [Node.js](https://nodejs.org/) (versión LTS recomendada)
* NPM o Yarn
* [PostgreSQL](https://www.postgresql.org/)
* Un editor de código como [Visual Studio Code](https://code.visualstudio.com/)

---

## 🚀 Instalación y Montaje

Sigue estos pasos para tener una copia del proyecto funcionando localmente.

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Phanesan/rent-all-backend
cd rent-all-backend
```

### 2. Instalar Dependencias
Instala todas las dependencias del proyecto definidas en el `package.json`.
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto. Puedes copiar el archivo de ejemplo `.env.example` para empezar.

```bash
cp .env.example .env
```
Ahora, abre el archivo `.env` y rellena los valores correspondientes para tu base de datos local.

**.env.example**
```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario_postgres
DB_PASSWORD=tu_contraseña_postgres
DB_DATABASE=nombre_de_tu_db
```

### 4. Configurar la Base de Datos
Asegúrate de que tu servidor de PostgreSQL esté corriendo. Luego, crea una base de datos con el mismo nombre que especificaste en la variable `DB_DATABASE` de tu archivo `.env`.

### 5. Ejecutar las Migraciones
Este es el paso más importante para configurar la estructura de la base de datos. Este comando leerá todos los archivos de migración y creará las tablas necesarias (`users`, etc.).

```bash
npm run migration:run
```
¡Tu base de datos ya está lista y sincronizada con las entidades del proyecto!

---

## ▶️ Ejecución de la Aplicación

### Modo de Desarrollo
Para iniciar el servidor en modo de desarrollo con recarga automática (hot-reloading):
```bash
npm run start:dev
```
La aplicación estará disponible en `http://localhost:3000`.

### Modo de Producción
Para construir y ejecutar la aplicación en modo de producción:
```bash
# 1. Construir el proyecto (compila TS a JS en la carpeta /dist)
npm run build

# 2. Iniciar el servidor de producción
npm run start:prod
```

---

## 🕹️ Uso del Playground de GraphQL

Una vez que la aplicación esté corriendo, puedes acceder al GraphQL Playground en tu navegador para interactuar con la API:

[http://localhost:3000/graphql](http://localhost:3000/graphql)

**Ejemplo de Mutación para Registrar un Usuario:**
```graphql
mutation Register($data: CreateUserInput!) {
  registerUser(createUserInput: $data) {
    id
    name
    email
  }
}
```
**Variables para la mutación:**
```json
{
  "data": {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
}
```

---

## 📜 Scripts Disponibles

* `npm run start:dev`: Inicia la aplicación en modo desarrollo.
* `npm run build`: Compila el proyecto para producción.
* `npm run migration:generate --name=NombreDeLaMigracion`: Genera un nuevo archivo de migración basado en los cambios de las entidades. **(Recuerda ejecutar `npm run build` antes)**.
* `npm run migration:run`: Aplica todas las migraciones pendientes.
* `npm run migration:revert`: Revierte la última migración aplicada.