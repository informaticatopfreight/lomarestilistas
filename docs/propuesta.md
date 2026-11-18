# LOMAR Estilistas — Propuesta de rediseño web

Documento de trabajo. Versión 1 (noviembre 2026).

## 1. Punto de partida

La web actual (lomarestilistas.es) ya funciona sobre WordPress, con:

| Pieza | Situación actual |
|---|---|
| Tema | BeTheme + tema hijo (constructor visual pesado) |
| Slider | Slider Revolution |
| Reservas | **Bookly Pro** (con licencia), 2 profesionales (Javier y Belén) y ~68 servicios configurados con duración |
| Formularios | Contact Form 7 |
| Otros | Site Kit de Google, bloqueador de cookies (Real Cookie Banner) |

Los datos del prototipo (servicios, duraciones, quién hace cada servicio, horario, textos, fotos) se han sacado de la web y del Bookly actuales, no son inventados.

## 2. Dirección visual

- **Concepto:** editorial y oscuro, con fotografía grande y movimiento continuo. Toma de las referencias la tipografía protagonista y el minimalismo (The Lane, 14islands), el vídeo o los pases de imagen en portada (Salon Mystique) y los listados con imagen flotante y transiciones (Obys).
- **Paleta:** negro cálido `#0d0c0b`, hueso `#f1ece4` y cobre `#c0784a` como acento. El cobre es el "color de tinte" y conecta con la madera de la fachada.
- **Tipografía:** *Jost*, geométrica y fina, coherente con el logotipo LOMAR. *Fraunces* en cursiva para las palabras con énfasis.
- **Movimiento:** cargador con el nombre, portada con pase de fotos y palabra rotativa (corte, color, peinado, barba), texto que se ilumina al hacer scroll, cinta de servicios que acelera con el scroll, imagen que sigue al cursor en la carta, sección de color con desplazamiento horizontal, galería en columnas con parallax, cursor personalizado y botones magnéticos.
- **Accesibilidad:** si el usuario tiene activada la reducción de movimiento, las animaciones se desactivan. Funciona con teclado y es responsive.

Prototipo navegable en `prototipo/index.html`.

## 3. Estructura de la página

1. Portada: reserva directa, estado abierto/cerrado en tiempo real y teléfono.
2. Quiénes somos y Abril et Nature (color vegano sin PPD).
3. Carta de servicios: 6 familias desplegables con todos los servicios y sus duraciones. Cada servicio abre la reserva ya seleccionado.
4. Laboratorio de color: tinte, mechas, matiz, decoloración, alisado y diagnóstico capilar.
5. Equipo: Javier y Belén, con un botón "Reservar con…".
6. El salón: galería.
7. Reseñas de Google (pendiente de conectar).
8. Llamada a reservar, con WhatsApp como alternativa.
9. Contacto: horario con el día de hoy marcado, mapa y cómo llegar.

## 4. Sistema de reservas: recomendación

### Comparativa

| | **Bookly Pro** (ya lo tenéis) | LatePoint | Amelia | Salon Booking System |
|---|---|---|---|---|
| Coste | Ya pagado | Licencia nueva | Licencia anual nueva | Licencia anual nueva |
| Migración | Ninguna: servicios, clientes y citas ya están | Rehacer servicios; migrar citas futuras | Igual | Igual |
| Panel de gestión (agenda, horarios por profesional, vacaciones, citas telefónicas) | Sí | Sí | Sí | Sí |
| App móvil para el personal | **Sí** (Staff Cabinet, iOS/Android) | No nativa | Limitada | Sí |
| WhatsApp / SMS | Sí (Bookly Cloud) | Sí (add-on) | SMS; WhatsApp por confirmar | SMS |
| Servicios compuestos (tinte + corte + peinado) | **Sí, ya configurados** | Parcial | Parcial | Sí |
| Diseño del formulario para el cliente | Correcto, se puede reestilizar | **El más pulido** | Bueno | Orientado a salón |

### Conclusión

**Recomiendo mantener Bookly Pro como motor de reservas** y cambiar solo la capa visual. LatePoint tiene el formulario más bonito de serie, pero cambiar supone pagar otra licencia, rehacer ~68 servicios y migrar citas. Además, se pierde la app móvil del personal, que para un salón de dos personas es lo más útil del día a día: Javier gestiona la agenda desde el móvil entre cliente y cliente. Lo que Bookly hace peor, el aspecto del formulario, es justo lo que se puede arreglar con diseño.

Lo que el salón ya tiene con Bookly Pro (y se mantiene):

- Alta de profesionales y asignación de servicios.
- Horarios distintos por profesional, descansos, vacaciones y festivos.
- Agenda diaria, semanal y mensual en el panel de WordPress y en la app.
- Citas telefónicas, modificación y cancelación desde el panel.
- Avisos de nuevas citas al salón y confirmación y recordatorio al cliente (email; SMS o WhatsApp con Bookly Cloud).
- Duración por servicio con bloqueo del hueco completo.
- Enlace para que el cliente cancele o cambie su cita.

### Fiabilidad: dos clientes, un mismo hueco

El calendario visual no es lo que impide la doble reserva. Lo que la impide es que el servidor vuelva a comprobar la disponibilidad en el momento de guardar. Bookly hace esa comprobación al confirmar la cita y rechaza el hueco si otro cliente lo ha cogido entretanto. El prototipo muestra además un **bloqueo temporal de 5 minutos** mientras el cliente rellena sus datos.

Antes de publicar, en el entorno de pruebas haremos estas comprobaciones:

1. **Prueba de concurrencia:** dos reservas simultáneas al mismo hueco y profesional, lanzadas por script. Debe entrar una sola.
2. Cancelación: el hueco vuelve a quedar libre al momento.
3. Cambio de horario o ausencia de un profesional con citas ya puestas: debe avisar.
4. Opción "sin preferencia de profesional" con los dos profesionales ocupados.
5. Servicio compuesto (por ejemplo "Tinte + Mechas + Matiz + Corte y Peinado", 3 h) cerca de la hora de cierre.

## 5. Plan técnico (WordPress en hosting compartido)

Válido para Dinahosting, IONOS (1&1) o Webempresa. No necesita servidor dedicado ni nada especial.

- **Tema propio ligero** (`lomar`), sin BeTheme ni Slider Revolution. Las animaciones del prototipo están hechas en JavaScript propio, sin librerías, así que la web pesa una fracción de la actual y es más rápida y más segura.
- Contenidos editables desde el panel: textos, fotos, equipo, horario y la carta de servicios.
- **Bookly Pro** con una hoja de estilos a medida para que su formulario siga el diseño del prototipo: colores, tipografía, pasos y botones.
- Requisitos del hosting: PHP 8.2 o superior, MySQL/MariaDB con InnoDB, HTTPS y acceso SMTP. Lo cumplen los tres.
- **Cron real** del panel del hosting, en lugar de WP-Cron, para que los recordatorios salgan a su hora aunque nadie visite la web.
- **SMTP** (cuenta `hola@lomarestilistas.es`) para que las confirmaciones no acaben en spam.
- Caché de página activa, **excluyendo la página de reservas** para que la disponibilidad sea siempre real.
- Copias de seguridad diarias (base de datos y archivos), con prueba de restauración.
- RGPD: aviso legal, privacidad y cookies ya existen; se revisan y se añade el consentimiento en el formulario de reserva.

## 6. Pendiente del cliente

- [ ] Logotipo en vector (SVG/AI/PDF).
- [ ] Presentación breve de Belén y su especialidad.
- [ ] **Precios** (o al menos "desde X €"). Publicar precios mejora mucho la conversión; ahora todo pone "A consultar".
- [ ] Vídeo corto del salón (10–20 s, horizontal) para la portada, si queremos sustituir el pase de fotos.
- [ ] Acceso a la ficha de Google Business, para mostrar las reseñas.
- [ ] ¿Activar avisos por WhatsApp? Requiere Bookly Cloud y un número de WhatsApp Business.
- [ ] Datos de acceso al hosting y al WordPress actual (para preparar el entorno de pruebas).

## 7. Siguientes pasos

1. Revisar el prototipo y ajustar el diseño.
2. Convertir el prototipo en el tema WordPress `lomar` y la hoja de estilos de Bookly.
3. Montar el entorno de pruebas con una copia de la web actual y pasar las pruebas del punto 4.
4. Publicar, sustituyendo BeTheme y Slider Revolution, sin tocar los datos de Bookly.
