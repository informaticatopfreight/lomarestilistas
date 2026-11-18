# LOMAR Estilistas — web

Rediseño de [lomarestilistas.es](https://lomarestilistas.es), peluquería, colorista y barbería en Pinto (Madrid).

- `prototipo/`: prototipo navegable del nuevo diseño (HTML, CSS y JS sin dependencias). Ábrelo con un servidor local:
  ```bash
  cd prototipo && python3 -m http.server 8000
  ```
  y visita http://localhost:8000
- `docs/propuesta.md`: propuesta de diseño, recomendación del sistema de reservas y plan técnico.

En el prototipo, la reserva es una simulación: la disponibilidad se genera de forma aleatoria. En producción la gestiona Bookly Pro.
