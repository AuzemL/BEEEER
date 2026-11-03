from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'produits.html', 'service.html', 'commandes.html', 'FAQ.html', 'Avis.html', 'compte.html']

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.refs, self.errors = set(), [], []
        self.h1 = 0
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1': self.h1 += 1
        if 'id' in attrs:
            if attrs['id'] in self.ids: self.errors.append('duplicate id: ' + attrs['id'])
            self.ids.add(attrs['id'])
        if tag == 'img' and not attrs.get('alt'): self.errors.append('image missing alt')
        if tag in ('a', 'link', 'script', 'img'):
            ref = attrs.get('href') if tag in ('a', 'link') else attrs.get('src')
            if ref: self.refs.append(ref)

def main():
    documents = {name: Page((ROOT / name).read_text(encoding='utf-8')) for name in PAGES}
    errors = []
    for name, page in documents.items():
        errors.extend(f'{name}: {error}' for error in page.errors)
        if page.h1 != 1: errors.append(f'{name}: expected one h1, got {page.h1}')
        for ref in page.refs:
            url = urlsplit(ref)
            if url.scheme or url.netloc: continue
            target = unquote(url.path) or name
            path = ROOT / target
            if not path.is_file(): errors.append(f'{name}: missing {target}')
            if url.fragment and target in documents and unquote(url.fragment) not in documents[target].ids:
                errors.append(f'{name}: missing anchor {ref}')
    if errors: raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(documents)} pages; local HTML references, anchors, image alt text and h1 counts checked.')

if __name__ == '__main__': main()
