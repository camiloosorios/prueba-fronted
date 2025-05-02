# Ecommerce Angular 19 - FakeStore API

**Demo:** [https://prueba-fronted-five.vercel.app](https://prueba-fronted-five.vercel.app/)

Este proyecto es un ecommerce estilo tienda online que consume la API pública de [FakeStoreAPI](https://fakestoreapi.com/) para mostrar productos, permitiendo ver detalles de cada producto en su página individual e incluyendo funcionalidades de favoritos y carrito de compras. Está desarrollado con Angular 19 utilizando las últimas características del framework.

## Tecnologías Utilizadas

- **Angular 19** con sus características más recientes:

  - 🚦 Signals para gestión reactiva de estado
  - 🌀 Nuevo control flow (`@if`, `@for`)
  - ⏳ Defer views para carga diferida
  - 💉 Nueva API de inyección de dependencias
  - 🏗️ Standalone components
  - ⚡ Modo zoneless (sin Zone.js)

- **TailwindCSS** para estilos y diseño responsive
- **Angular HTTP Client** para consumo de API
- **Jasmine y Karma** para pruebas unitarias

## Características Principales

### Funcionalidades del Ecommerce

- 📦 Catálogo de productos obtenidos de FakeStoreAPI
- 🔍 Páginas de detalle para cada producto
- ❤️ Sistema de favoritos
- 🛒 Carrito de compras
- � Diseño completamente responsive

## 💡 Decisiones Técnicas Destacables

- **Angular Signals:** Implementación completa del estado reactivo para carrito y favoritos, eliminando la necesidad de `RxJS` para estos casos.

- **Nuevo Control Flow:** Migración completa del tradicional `*ngIf`/`*ngFor` al nuevo syntax `@if` y `@for` para mejor legibilidad y performance.

- **Defer Views:** Uso estratégico de `@defer` para cargar componentes no críticos de manera diferida, mejorando el LCP.

- **Inyección de Dependencias:** Adopción de la nueva API `inject()` en todos los servicios y componentes, eliminando constructores innecesarios.

- **Standalone Components:** Definición de componentes independientes `(standalone: true)`, eliminando la necesidad de `NgModule` y mejorando la mantenibilidad del código.

- **Modo Zoneless:** Configuración sin `Zone.js` para mejor rendimiento, usando `Signals` y `ChangeDetectionStrategy.OnPush`.

- **TailwindCSS:** Configuración personalizada de Tailwind con colores y breakpoints específicos para el diseño responsivo del ecommerce.

## ⚙️ Configuración del Proyecto

### Requisitos Previos

- **Node.js v18+** (requerido para Angular 19)
  ```bash
  # Verificar versión de Node
  node -v
  ```
- **Angular CLI v19+**
  ```bash
  npm install -g @angular/cli@latest
  ```

### Instalación

- Clonar el repositorio:
  ```bash
  git clone https://github.com/camiloosorios/prueba-frontend.git
  cd prueba-frontend
  ```
- Instalar dependencias:
  ```bash
  npm install
  ```

### Ejecución del Proyecto

- Servidor de desarrollo::

  ```bash
  ng serve
  ```

  Abrir http://localhost:4200 en tu navegador

- Build para producción:
  ```bash
  ng build
  ```

### 🧪 Pruebas y Cobertura

- Ejecutar las pruebas unitarias:

  ```
  ng test
  ```

- Ejecutar pruebas con cobertura:

  ```
  ng test --no-watch --code-coverage
  ```

### 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── pages/
│   │   ├── home-page/          # Página principal con listado de productos
│   │   ├── cart-page/          # Página del carrito de compras
│   │   ├── favorites-page/     # Página de productos favoritos
│   │   └── product-details-page/ # Página de detalle de producto
│   ├── services/
│   │   ├── cart.service.ts     # Gestión del carrito
│   │   ├── favorite.service.ts # Gestión de favoritos
│   │   └── product.service.ts  # Servicio para FakeStoreAPI
│   ├── components/
│   │   ├── product-card/       # Componente de tarjeta de producto
│   │   └── text-card/          # Componente de texto reutilizable
│   ├── shared/
│   │   ├── header/             # Componente header
│   │   └── footer/             # Componente footer
│   ├── interfaces/
│   │   └── product.interface.ts # Tipos e interfaces de productos
│   └── app.routes.ts           # Configuración de rutas
├── public/
│   └── images/                 # Imágenes estáticas del proyecto
└── environments/               # Configuraciones por entorno
```

### 📌 Notas Adicionales

La estructura sigue las mejores prácticas de Angular con:

- Páginas como contenedores principales.
- Componentes reutilizables.
- Servicios con responsabilidades únicas.
- Tipado fuerte con interfaces.

## Conclusión

Este proyecto demuestra la capacidad de Angular 19 para construir aplicaciones eficientes y modernas utilizando las últimas características del framework, como los `standalone component`s, `defer views`, y el nuevo control flow con `@if` y `@else`. Además, implementa buenas prácticas de desarrollo frontend, como el manejo de errores y las pruebas unitarias.
