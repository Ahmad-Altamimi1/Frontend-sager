# Sager Dashboard

Drone tracing system frontend built with React Router, Mapbox GL, Tailwind, shadcn-style components, Framer Motion, and Zustand.

## Features

- Live WebSocket ingestion of drones
- Mapbox GL with drone markers, yaw orientation, and path trails
- Sidebar drone list with status badges and fly-to interaction
- Hover popups with altitude and flight time
- Bottom-right counter for red (blocked) drones
- Responsive, dark UI styled with Tailwind and shadcn-like primitives

## Getting Started

### 1) Install

```bash
npm install
```

### 2) Environment

Create `.env` with:

```bash
VITE_MAP_BOX_ACCESS_TOKEN=your_mapbox_access_token_here
VITE_WS_URL=ws://localhost:8080
```

### 3) Develop

```bash
npm run dev
```

### 4) Build & Serve

```bash
npm run build
npm start
```

## Tech

- React Router v7
- Mapbox GL JS
- Tailwind CSS v4
- shadcn-style utilities (Button, Badge, Tabs, Tooltip, Scroll)
- Framer Motion
- Zustand
