"""Copia la cabecera, el menú móvil y el panel de reserva de prototipo/index.html
a las páginas legales, para que todas compartan la misma navegación.
Uso: python3 tools/sync-legal.py"""
import re, pathlib

root = pathlib.Path(__file__).resolve().parent.parent / 'prototipo'
idx = (root / 'index.html').read_text(encoding='utf-8')

def grab(pattern):
    m = re.search(pattern, idx, re.S)
    assert m, pattern
    return m.group(0)

badge = grab(r'<!-- Aviso de prototipo -->.*?</div>')
header = grab(r'<header class="nav">.*?</header>')
menu = grab(r'<div class="menu".*?</nav>\s*<div class="menu__foot">.*?</div>\s*</div>\s*</div>')
book = grab(r'<!-- ============ RESERVA ============ -->.*?</aside>\s*</div>')

# En las páginas legales los enlaces internos apuntan a la portada.
local = lambda s: re.sub(r'href="#([\w-]+)"', lambda m: 'href="index.html"' if m.group(1) == 'inicio' else f'href="index.html#{m.group(1)}"', s)
header, menu = local(header), local(menu)

START, END = '<!-- CABECERA COMÚN (generada por tools/sync-legal.py) -->', '<!-- /CABECERA COMÚN -->'
BSTART, BEND = '<!-- RESERVA COMÚN (generada por tools/sync-legal.py) -->', '<!-- /RESERVA COMÚN -->'
SCRIPTS = '<script src="assets/js/data.js"></script>\n<script src="assets/js/legal.js"></script>\n<script src="assets/js/booking.js"></script>\n'

for name in ('aviso-legal.html', 'privacidad.html', 'cookies.html'):
    p = root / name
    html = p.read_text(encoding='utf-8')
    block = f'{START}\n{badge}\n\n{header}\n\n{menu}\n{END}'
    if START in html:
        html = re.sub(re.escape(START) + '.*?' + re.escape(END), lambda _: block, html, flags=re.S)
    else:
        html = re.sub(r'<header class="legal-head">.*?</header>', lambda _: block, html, flags=re.S)
    bblock = f'{BSTART}\n{book}\n{BEND}\n'
    if BSTART in html:
        html = re.sub(re.escape(BSTART) + '.*?' + re.escape(BEND) + r'\n', lambda _: bblock, html, flags=re.S)
    else:
        html = html.replace('</body>', bblock + SCRIPTS + '</body>')
    html = html.replace('<body>', '<body class="page-legal">')
    p.write_text(html, encoding='utf-8')
    print('ok', name)
