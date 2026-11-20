# LOMAR Estilistas — web

Rediseño de [lomarestilistas.es](https://lomarestilistas.es), peluquería, colorista y barbería en Pinto (Madrid).

<p align="center">
  <a href="https://informaticatopfreight.github.io/lomarestilistas/prototipo/">
    <img src="https://img.shields.io/badge/%E2%96%B6%20Ver%20la%20web-prototipo-c0784a?style=for-the-badge" alt="Ver la web (prototipo)" height="44">
  </a>
</p>

- `prototipo/`: prototipo navegable del nuevo diseño (HTML, CSS y JS sin dependencias). Ábrelo con un servidor local:
  ```bash
  cd prototipo && python3 -m http.server 8000
  ```
  y visita http://localhost:8000
- `tema/lomar/`: tema de WordPress (se instala con *Apariencia → Temas → Subir tema*). Instrucciones en `tema/INSTALAR-TEMA.txt`.
- `docs/propuesta.md`: propuesta de diseño, recomendación del sistema de reservas y plan técnico.

En el prototipo, la reserva es una simulación: la disponibilidad se genera de forma aleatoria. En producción la gestiona Bookly Pro.
