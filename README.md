[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1500&vCenter=true&width=435&lines=Task+Management+System)](https://git.io/typing-svg)
---
This project is built using modern web technologies, including React, TypeScript, and TailwindCSS, with Vite as the build tool.

---

## Table of Contents

- [](#)
- [Table of Contents](#table-of-contents)
- [Tack Stack](#tack-stack)
  - [Built With](#built-with)
  - [Usages](#usages)
- [Folder Structure](#folder-structure)
- [Scripts](#scripts)
- [Backend Documentation](#backend-documentation)
  - [API Request Format](#api-request-format)
  - [API Response Format](#api-response-format)
  - [API Request and Response Samples](#api-request-and-response-samples)
- [Features](#features)
- [GUI overview](#gui-overview)
  - [Login](#login)
  - [Sign up](#sign-up)
  - [Dashboard](#dashboard)
  - [Theme Toggle](#theme-toggle)
    - [Dark Mode](#dark-mode)
    - [Light Mode](#light-mode)
  - [Kanban Board](#kanban-board)
  - [Workspace Management](#workspace-management)
  - [Project Management](#project-management)
  - [Issue Management](#issue-management)
  - [Task Management](#task-management)
  - [Add Form](#add-form)
  - [Edit Form](#edit-form)

---

## Tack Stack

### Built With

<p align="left"> 
  <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> 
  </a> 
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> 
  </a> 
  <a href="https://vuejs.org/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original-wordmark.svg" alt="vuejs" width="40" height="40"/> 
  </a> 
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> 
    <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> 
  </a> 
</p>

![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-000000?style=for-the-badge&logoColor=white) 
![Zod](https://img.shields.io/badge/Zod-3F7FFF?style=for-the-badge&logoColor=white) 
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logoColor=white) 
![TanStack](https://img.shields.io/badge/TanStack-FF4154?style=for-the-badge&logoColor=white)

### Usages

- **React 19** (`react`, `react-dom`): For building user interfaces.
- **@dnd-kit/core**: For drag-and-drop functionality.
- **@tanstack/react-query**: For managing server state.
- **TailwindCSS**: For utility-first CSS styling.
- **Shadcn UI**: Accessible UI components.
- **Axios**: For making HTTP requests.

---

## Folder Structure

```text
main-app/
├── public/
├── src/
│   ├── assets/         # Static assets (images, fonts, etc.)
│   ├── api/            # API calls and services
│   ├── app/            # Main app entry, routing, layout
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature-based modules (e.g., tasks)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and libraries
│   ├── schemas/        # Validation schemas or types
│   ├── App.tsx         # Main app component
│   ├── App.css         # Global styles for the app
│   ├── index.css       # Global styles
│   ├── main.tsx        # App entry point
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── README.md           # Project documentation
├── index.html          # HTML template for the app
├── package.json        # Project dependencies and scripts
├── tsconfig.app.json   # TypeScript configuration for the app
├── tsconfig.json       # Root TypeScript configuration
├── tsconfig.node.json  # TypeScript configuration for Node.js
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.ts      # Vite configuration
```

---

## Scripts

| Command          | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `npm run dev`    | Starts the development server on port 3000.                                |
| `npm run build`  | Builds the project for production.                                         |
| `npm run start`  | Previews the production build.                                             |
| `npm run clean`  | Removes the `dist` folder and `node_modules`.                             |
| `npm run lint`   | Runs ESLint to check for code quality issues.                              |
| `npm run lint:fix` | Runs ESLint and fixes fixable issues automatically.                      |
| `npm run format` | Formats code using Prettier.                                               |
| `npm run test`   | Runs tests using Vitest.                                                   |
| `npm run test:watch` | Runs tests in watch mode.                                              |
| `npm run type:check` | Performs TypeScript type checking.                                     |

---

## Backend Documentation

### API Request Format

Here endpoint is a `workspaces`, `projects`, `issues`, `tasks`, `users` etc.

| **Operation** | **HTTP Method** | **Endpoint**                                                                   |
| ------------- | --------------- | ------------------------------------------------------------------------------ |
| Search        | `GET`           | `/endpoint?searchTerm=text &page=1&pageSize=10 &sortColumn=name&sortOrder=asc` |
| Get by ID     | `GET`           | `/endpoint/:id`                                                                |
| Create        | `POST`          | `/endpoint`                                                                    |
| Update        | `PUT`           | `/endpoint/:id`                                                                |
| Delete        | `DELETE`        | `/endpoint/:id`                                                                |


### API Response Format

**Successful Response Example:**

```json
{
  "isSuccess": true,
  "data": { },
  "message": "successful message",
  "errors": null
}
```

**Error Response Example:**

```json
{
    "isSuccess": false,
    "data": null,
    "message": "Unsuccessful message",
    "errors": [
        {
            "field": "name",
            "message": "Name is required"
        }
    ]
}
```
### API Request and Response Samples

**Retrieve resources**

```sh
curl -X 'GET' \
  'https://example.com/api/v1/endpoint?SearchTerm=Sample' \
  -H 'accept: application/json'
```

```json
{
  "isSuccess": true,
  "data": {
    "items": [
      {
        "name": "sample",
        "description": "sample",
        "userDataAccessLevel": 0,
        "id": "c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
        "links": [
          {
            "method": "GET",
            "href": "endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
            "operation": "Get"
          },
          {
            "method": "POST",
            "href": "endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
            "operation": "Create"
          },
          {
            "method": "PUT",
            "href": "endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
            "operation": "Update"
          },
          {
            "method": "DELETE",
            "href": "endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
            "operation": "Delete"
          }
        ]
      }
    ],
    "page": 1,
    "pageSize": 1,
    "totalCount": 1,
    "totalPages": 1,
    "links": [],
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "message": "Data retrieved successfully",
  "errors": null
```

**Get resource by a ID**

```sh
curl -X 'GET' \
  'https://example.com/api/v1/endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c' \
  -H 'accept: application/json'
```

```json
{
  "isSuccess": true,
  "data": {
    "name": "Sample",
    "description": "Sample",
    "userDataAccessLevel": 0,
    "id": "c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
    "links": [
      {
        "method": "GET",
        "href": "https://example.com/api/v1/endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
        "operation": "Get"
      },
      {
        "method": "POST",
        "href": "https://example.com/api/v1/endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
        "operation": "Create"
      },
      {
        "method": "PUT",
        "href": "https://example.com/api/v1/endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
        "operation": "Update"
      },
      {
        "method": "DELETE",
        "href": "https://example.com/api/v1/endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c",
        "operation": "Delete"
      }
    ]
  },
  "message": "Data retrieved successfully",
  "errors": null
}
```

**Create a resource**


```sh
curl -X 'POST' \
  'https://example.com/api/v1/endpoint' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json-patch+json' \
  -d '{
  "userDataAccessLevel": 0,
  "name": "Sample",
  "description": "Sample"
}'
```

```json
{
  "isSuccess": true,
  "data": "2f895cc9-8f58-4e4a-a5b7-97594b933a32",
  "message": "Data added successfully",
  "errors": null
}
```

**Update a resource**

```sh
curl -X 'PUT' \
  'https://example.com/api/v1/endpoint/c69d4fa7-2770-4f94-b7db-33e5f28bbe2c' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json-patch+json' \
  -d '{
  "name": "Sample",
  "description": "Sample"
  "userDataAccessLevel": 0,
}'
```

```json
{
  "isSuccess": true,
  "data": {
    "name": "Sample",
    "description": "Sample",
    "userDataAccessLevel": 0
  },
  "message": "Data updated successfully",
  "errors": null
}
```

**Delete a resource**

```sh
curl -X 'DELETE' \
  'https://example.com/api/v1/endpoint/2f895cc9-8f58-4e4a-a5b7-97594b933a32' \
  -H 'accept: application/json'
```

```json
{
  "isSuccess": true,
  "data": true,
  "message": "Data deleted successfully",
  "errors": null
}
```

---

## Features

## GUI overview

### Login

![Login](/readme-doc/screenshots/login-dark.png)

### Sign up

![Sign up](/readme-doc/screenshots/signup-dark.png)

### Dashboard

![Login](/readme-doc/screenshots/dashboard-dark.png)

### Theme Toggle 

![Theme Toggle](/readme-doc/screenshots/theme-toggle-dark.png)

#### Dark Mode

![Dark Mode](/readme-doc/screenshots/dashboard-dark-mode.png)

#### Light Mode

![Light Mode](/readme-doc/screenshots/dashboard-light-mode.png)

### Kanban Board

![Kanban Board](/readme-doc/screenshots/kanban-board-dark.png)

### Workspace Management

![Workspace Management](/readme-doc/screenshots/workspaces-dark.png)

### Project Management

![Project Management](/readme-doc/screenshots/projects-dark.png)

### Issue Management

![Issue Management](/readme-doc/screenshots/issues-dark.png)

### Task Management

![Task Management](/readme-doc/screenshots/tasks-dark.png)

### Add Form

![Add Form](/readme-doc/screenshots/create-form-dark.png)

### Edit Form

![Edit Form](/readme-doc/screenshots/update-form-dark.png)



