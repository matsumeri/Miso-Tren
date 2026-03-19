# Miso-Tren

PWA (Progressive Web App) para planificar viajes en Metro de Santiago.

## Que incluye

- Planificador de ruta mas rapida entre estaciones.
- Ruta alternativa con menos combinaciones.
- Seleccion de lineas habilitadas para personalizar la busqueda.
- Recomendacion de horario segun franja de congeston.
- Vista del plano completo del Metro de Santiago.
- Instalacion en movil como app (manifest + service worker).

## Ejecutar en local

Como es una PWA, conviene servirla con HTTP local (no abrir solo archivo).

Ejemplo con Python:

```bash
python3 -m http.server 4173
```

Luego abre:

```bash
http://localhost:4173
```

## Publicar para instalar en movil

Para instalar como app en un movil real necesitas URL HTTPS (localhost en PC no aplica al telefono).

Este repo incluye workflow para GitHub Pages:

1. Sube estos cambios a `main`.
2. En GitHub, activa Pages en el repositorio (Build and deployment: GitHub Actions).
3. Espera el workflow `Deploy static site to Pages`.
4. Abre la URL `https://<usuario>.github.io/<repo>/` en tu movil.
5. En Chrome/Edge movil: menu -> Instalar app / Anadir a pantalla de inicio.

## Estructura

- `index.html`: interfaz principal.
- `styles.css`: estilos responsive.
- `app.js`: logica de rutas y UI.
- `manifest.webmanifest`: configuracion instalable.
- `service-worker.js`: cache offline basico.