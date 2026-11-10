"""Targeted header/footer geometry regression check without hidden-overflow false positives."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
out = Path(os.environ.get('EPRT_AUDIT_DIR','/root/.hermes/cache/scratch/eprt-geometry'))
out.mkdir(parents=True, exist_ok=True)
base = os.environ.get('EPRT_BASE_URL','http://127.0.0.1:4173')
reports=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    page=b.new_page()
    page.goto(base)
    page.get_by_role('button',name='Mulai Simulasi 140 Soal').click()
    for width in [320,360,375,390,412,640,768,1024,1280,1440,1920]:
        page.set_viewport_size({'width':width,'height':900})
        page.wait_for_timeout(150)
        page.evaluate('window.scrollTo(0,0)')
        geometry = page.locator('header').evaluate('''h=>{
          const r=h.getBoundingClientRect();
          const children=Array.from(h.children).filter(e=>e.getBoundingClientRect().width).map(e=>({text:e.innerText,x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right}));
          return {children,overlap:children.some((c,i)=>i>0&&c.x<children[i-1].right-1), outside:children.some(c=>c.x<0||c.right>innerWidth+1)};
        }''')
        page.screenshot(path=str(out/f'exam_{width}_top.png'))
        page.locator('footer').scroll_into_view_if_needed()
        nav=page.locator('footer button').evaluate_all('''bs=>bs.map(b=>{const r=b.getBoundingClientRect();return {text:b.innerText,x:r.x,right:r.right}})''')
        footer_bad=any(x['x']<0 or x['right']>width+1 for x in nav)
        page.screenshot(path=str(out/f'exam_{width}_footer.png'))
        reports.append({'width':width,'header':geometry,'footer_outside':footer_bad,'footer':nav})
    b.close()
(out/'geometry.json').write_text(json.dumps(reports,indent=2))
print(json.dumps(reports,indent=2))
assert all(not r['header']['overlap'] and not r['header']['outside'] and not r['footer_outside'] for r in reports), 'Header/footer collision detected'
