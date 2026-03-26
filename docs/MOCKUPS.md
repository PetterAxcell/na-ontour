# Mockups y Descripción de Pantallas - NA-ONTOUR

## Tabla de Contenidos
1. [Home / Feed Social](#1-home--feed-social)
2. [Viajes](#2-viajes)
3. [Experiencias](#3-experiencias)
4. [Clubes](#4-clubes)
5. [Perfil](#5-perfil)
6. [Flujo de Auth](#6-flujo-de-auth)

---

## 1. Home / Feed Social

### Descripción
Feed principal donde se ven las publicaciones de usuarios seguidos y publicaciones automáticas de viajes y experiencias creadas.

### Elementos de Pantalla

```
┌─────────────────────────────────┐
│  🌍⚽ NA-ONTOUR                 │
│  ¡Hola, [Nombre]! 👋            │
├─────────────────────────────────┤
│  ┌───┐  ┌─────────────────────┐ │
│  │ 👤│  │ ¿Qué estás viviendo│ │
│  └───┘  │     hoy?           │ │
│         └─────────────────────┘ │
├─────────────────────────────────┤
│  ┌───┐  Nombre User    · 2h    │
│  │ 👤│  ─────────────────────  │
│  └───┘  ¡Qué partido increíble!│
│         ⚽                      │
│         ❤️ 24   💬 5   ↗️       │
├─────────────────────────────────┤
│  ┌───┐  Otro User     · 4h    │
│  │ 👤│  Preparando viaje...    │
│  └───┘  ✈️                     │
│         ❤️ 18   💬 3   ↗️       │
└─────────────────────────────────┘
│  🏠 Home │ ✈️ Viajes │ 📷 Exp │ 👥 │ 👤 │
└─────────────────────────────────┘
```

### Estados
- **Loading:** Skeleton con placeholders animados
- **Empty:** Mensaje "Tu feed está vacío" con sugerencia de seguir usuarios
- **Error:** Mensaje de error con botón de reintentar

### Interacciones
- Tap en post → Expandir detalles
- Tap en ❤️ → Like/unlike (cambia a rojo y actualiza contador)
- Tap en 💬 → Abrir comentarios
- Tap en foto de usuario → Ver perfil
- Pull-to-refresh → Recargar feed

---

## 2. Viajes

### 2.1 Lista de Viajes

```
┌─────────────────────────────────┐
│  Mis Viajes            [+ Nuevo]│
├─────────────────────────────────┤
│ [Todos] [Planificando] [Curso] │
│ [Completados]                  │
├─────────────────────────────────┤
│ ┌───────────────────────────┐  │
│ │         ⚽ / 🏟️            │  │
│ │      [Status Badge]        │  │
│ ├───────────────────────────┤  │
│ │  Madrid, Spain            │  │
│ │  📅 15 Mar 2024            │  │
│ │  📷 3 fotos               │  │
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │         ✈️                 │  │
│ │      [Status Badge]        │  │
│ ├───────────────────────────┤  │
│ │  Barcelona, Spain         │  │
│ │  📅 22 Mar 2024            │  │
│ └───────────────────────────┘  │
└─────────────────────────────────┘
```

### 2.2 Crear Viaje

```
┌─────────────────────────────────┐
│  ← Nuevo Viaje                 │
├─────────────────────────────────┤
│  Destino                       │
│  ┌───────────────────────────┐  │
│  │ Madrid                    │  │
│  └───────────────────────────┘  │
│                                 │
│  Fecha del partido              │
│  ┌───────────────────────────┐  │
│  │ 📅 Seleccionar fecha      │  │
│  └───────────────────────────┘  │
│                                 │
│  Estado                        │
│  [Planificando ▼]              │
│                                 │
│  Descripción                   │
│  ┌───────────────────────────┐  │
│  │ Derby madrileño en el     │  │
│  │ Bernabéu                  │  │
│  └───────────────────────────┘  │
│                                 │
│  Fotos                         │
│  ┌───────────────────────────┐  │
│  │      📷 Subir fotos       │  │
│  └───────────────────────────┘  │
│  [preview1] [preview2] [+]      │
│                                 │
│  [Cancelar]    [Crear viaje]    │
└─────────────────────────────────┘
```

### Estados del Viaje
- **Planning (📋):** Amarillo - Viaje en fase de planificación
- **Ongoing (⚽):** Rojo - Viaje activo o en curso
- **Completed (✅):** Verde - Viaje已完成

---

## 3. Experiencias

### 3.1 Galería de Experiencias

```
┌─────────────────────────────────┐
│  Experiencias            [+ Nueva]│
├─────────────────────────────────┤
│ [Grid] [Lista]                  │
│ [Todas] [⚽Partido] [✈️Viaje]     │
│ [🎉Evento] [💭Personal]           │
├─────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐       │
│ │         │  │         │       │
│ │   ⚽    │  │   ✈️    │       │
│ │         │  │         │       │
│ ├─────────┤  ├─────────┤       │
│ │ Derby   │  │ Bilbao  │       │
│ │ 10 Mar  │  │ 5 Feb   │       │
│ └─────────┘  └─────────┘       │
│ ┌─────────┐  ┌─────────┐       │
│ │         │  │         │       │
│ │   🎉    │  │   💭    │       │
│ │         │  │         │       │
│ ├─────────┤  ├─────────┤       │
│ │ Cumple  │  │ Reflexión│      │
│ │ 1 Ene   │  │ 20 Dic  │       │
│ └─────────┘  └─────────┘       │
└─────────────────────────────────┘
```

### 3.2 Crear Experiencia

```
┌─────────────────────────────────┐
│  ← Nueva Experiencia            │
├─────────────────────────────────┤
│  Título                        │
│  ┌───────────────────────────┐  │
│  │ Derby Madrileño           │  │
│  └───────────────────────────┘  │
│                                 │
│  Fecha                          │
│  ┌───────────────────────────┐  │
│  │ 📅 10 Mar 2024            │  │
│  └───────────────────────────┘  │
│                                 │
│  Tipo de experiencia           │
│  ┌───────┐┌───────┐┌───────┐┌──┐│
│  │  ⚽   ││  ✈️   ││  🎉   ││💭││
│  │Partido││ Viaje ││Evento ││Pe││
│  └───────┘└───────┘└───────┘└──┘│
│                                 │
│  Descripción                   │
│  ┌───────────────────────────┐  │
│  │ Partido increíble en el    │  │
│  │ Bernabéu. 3-1 a favor.    │  │
│  └───────────────────────────┘  │
│                                 │
│  Fotos                         │
│  ┌───────────────────────────┐  │
│  │      📷 Subir fotos        │  │
│  └───────────────────────────┘  │
│  [thumb1] [thumb2] [+]          │
│                                 │
│  [Cancelar]    [Guardar]        │
└─────────────────────────────────┘
```

---

## 4. Clubes

### 4.1 Buscar Clubes

```
┌─────────────────────────────────┐
│  Clubes                         │
├─────────────────────────────────┤
│  🔍 Buscar clubes...            │
├─────────────────────────────────┤
│ ┌───────────────────────────┐  │
│ │  ⚽  Real Madrid CF        │  │
│ │      🏟️ Santiago Bernabéu │  │
│ │      España 🇪🇸           │  │
│ │      👥 1,250 fans         │  │
│ │                     [✓ Siguiendo]│
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │  ⚽  FC Barcelona          │  │
│ │      🏟️ Camp Nou           │  │
│ │      España 🇪🇸           │  │
│ │      👥 1,180 fans         │  │
│ │                     [Seguir]│
│ └───────────────────────────┘  │
│ ┌───────────────────────────┐  │
│ │  ⚽  Atlético Madrid      │  │
│ │      🏟️ Metropolitano     │  │
│ │      España 🇪🇸           │  │
│ │      👥 890 fans          │  │
│ │                     [✓ Siguiendo]│
│ └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Estados del Botón Seguir
- **No siguiendo:** Borde verde, texto "Seguir"
- **Siguiendo:** Fondo verde, texto "✓ Siguiendo"
- **Loading:** Spinner

---

## 5. Perfil

```
┌─────────────────────────────────┐
│  Mi Perfil              [Editar]│
├─────────────────────────────────┤
│         ┌─────────┐            │
│         │    A    │  📷         │
│         └─────────┘            │
│        [Nombre User]            │
│    Aficionado del fútbol ⚽      │
│                                │
│    ✉️ usuario@email.com        │
├─────────────────────────────────┤
│ ┌─────────┐┌─────────┐┌─────────┐│
│ │    5   ││   12    ││    3    ││
│ │ Viajes ││Experien ││Clubes   ││
│ └─────────┘└─────────┘└─────────┘│
├─────────────────────────────────┤
│  ✏️ Editar perfil              │
│  🔒 Privacidad                 │
│  ⚙️ Configuración              │
│  🚪 Cerrar sesión              │
└─────────────────────────────────┘
```

### Editar Perfil (Modal)

```
┌─────────────────────────────────┐
│  Editar Perfil                 │
├─────────────────────────────────┤
│         ┌─────────┐            │
│         │    A    │  📷         │
│         └─────────┘            │
│                                │
│  Nombre                        │
│  ┌───────────────────────────┐  │
│  │ Nombre User               │  │
│  └───────────────────────────┘  │
│                                │
│  Bio                           │
│  ┌───────────────────────────┐  │
│  │ Aficionado del fútbol...  │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                │
│  [Cancelar]    [Guardar]       │
└─────────────────────────────────┘
```

---

## 6. Flujo de Auth

### Login

```
┌─────────────────────────────────┐
│                                 │
│           🌍⚽                 │
│         NA-ONTOUR              │
│   Vive el fútbol, más allá     │
│       del partido               │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ✉️ tu@email.com           │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ 🔒 ••••••••              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │    Iniciar sesión         │  │
│  └───────────────────────────┘  │
│                                 │
│  ¿No tienes cuenta?             │
│        Regístrate               │
└─────────────────────────────────┘
```

### Toggle Login/Register
- Botón para alternar entre modos
- Campos adicionales en registro (nombre)
- Mensajes de error inline

---

## Notas de Diseño

### Touch Targets
- Mínimo 44x44px para todos los botones
- Espaciado mínimo de 8px entre elementos táctiles

### Estados de Carga
- Skeletons para listas
- Spinner para acciones
- Progress bar para uploads

### Navegación
- Tab bar inferior en mobile
- Navbar sticky en web
- Back button en pantallas detalle

### Responsive
- Mobile first
- Breakpoints: 640px, 768px, 1024px, 1280px
