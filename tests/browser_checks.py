import os
from pathlib import Path
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:8000/').rstrip('/') + '/'
OUT = Path('output/browser-qa')
OUT.mkdir(parents=True, exist_ok=True)
PAGES = ['index.html', 'produits.html', 'service.html', 'commandes.html', 'FAQ.html', 'Avis.html', 'compte.html']

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    context.add_init_script("sessionStorage.setItem('age_verified','true')")
    context.route('https://static.elfsight.com/**', lambda route: route.abort())
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    for width in [390, 768, 1440]:
        page.set_viewport_size({'width': width, 'height': 1000})
        for name in PAGES:
            response = page.goto(urljoin(BASE, name), wait_until='networkidle')
            assert response and response.ok, name
            assert page.locator('h1').count() == 1, name
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'overflow: {name} at {width}'
            assert page.locator('img').evaluate_all('(images) => images.every(img => img.complete && img.naturalWidth > 0)'), f'broken image: {name}'
            page.screenshot(path=str(OUT / f'{width}-{name}.png'), full_page=True)
    page.set_viewport_size({'width':1440, 'height':1000})
    for route in ['', 'index.html']:
        page.goto(urljoin(BASE, route))
        page.locator('header a[href="produits.html"]').hover()
        page.wait_for_function("document.querySelector('.hover-word')?.textContent === 'BIÈRES'")
        assert page.locator('.menu-highlight.visible').count() == 1
    page.goto(urljoin(BASE, 'produits.html'))
    page.locator('.product').first.locator('a').click()
    assert page.locator('#request').input_value() == 'Citri’K'
    page.locator('#prepare').click()
    assert 'Citri’K' in page.locator('#message').input_value()
    assert page.locator('#draft').is_visible()
    page.goto(urljoin(BASE, 'service.html'))
    page.locator('#tireuses a.button').click()
    assert page.locator('#request').input_value() == 'Une location de tireuse'
    page.goto(urljoin(BASE, 'FAQ.html'))
    page.locator('summary').first.click()
    assert page.locator('details').first.get_attribute('open') is not None
    page.set_viewport_size({'width':390, 'height':844})
    page.goto(BASE)
    page.locator('header button.menu').click()
    assert page.locator('#navigation').is_visible()
    page.keyboard.press('Escape')
    assert page.locator('#navigation').is_hidden()
    page.emulate_media(reduced_motion='reduce')
    page.set_viewport_size({'width':1440, 'height':1000})
    page.goto(BASE)
    page.locator('header a[href="produits.html"]').hover()
    assert not page.locator('.hover-word').is_visible()
    fresh = browser.new_context()
    gate_page = fresh.new_page()
    gate_page.goto(BASE)
    assert gate_page.locator('dialog[open]').is_visible()
    gate_page.locator('dialog button').click()
    gate_page.goto(urljoin(BASE, 'index.html'))
    assert gate_page.locator('dialog[open]').count() == 0
    fresh.close()
    assert not errors, errors
    browser.close()
    print('PASS: Chromium smoke tests; inspect screenshots separately for visual quality.')
