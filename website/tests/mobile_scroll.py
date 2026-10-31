"""Regression checks for all catalogue pages and native mobile scrolling.

Run `npm run build`, then `python3 tests/mobile_scroll.py`.
Requires Python Playwright and Chromium (system or Playwright-managed).
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import shutil
import threading
import unittest
from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parents[1] / 'dist'
EXPECTED_TITLES = [
    'جلد',
    'داستان بهار ارتباط گستر',
    'آمار کلیدی در یک نگاه',
    'دغدغه‌هایی که برطرف می‌کنیم',
    'چهار اصل که ما را متمایز می‌کند:',
    'مسیری که در تامین تجهیزات بهارتل با شما همراه می شود',
    'پروژه‌های موفق',
    'ماتریس سبد محصولات و خدمات',
    'تماس',
]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

class MobileScrollTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        assert (SITE / 'index.html').is_file(), 'Run npm run build first'
        cls.server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(SITE)))
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.pw = sync_playwright().start()
        executable = shutil.which('chromium') or shutil.which('chromium-browser')
        cls.browser = cls.pw.chromium.launch(executable_path=executable, args=['--no-sandbox'])
        cls.url = f'http://127.0.0.1:{cls.server.server_port}/'

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def open_page(self, width=390, height=844, mobile=True, freeze_animation=True):
        page = self.browser.new_page(viewport={'width': width, 'height': height}, is_mobile=mobile, has_touch=mobile, reduced_motion='reduce')
        self.addCleanup(page.close)
        # Deterministic offline check: external fonts are optional.
        page.route('https://fonts.googleapis.com/**', lambda route: route.fulfill(status=200, content_type='text/css', body=''))
        page.goto(self.url, wait_until='networkidle')
        if freeze_animation:
            page.add_style_tag(content='*,*::before,*::after{animation:none!important;transition:none!important}')
        return page

    def swipe(self, target, start, end):
        target.evaluate('''(el, points) => {
            for (const [type, point] of [['touchstart', points[0]], ['touchend', points[1]]]) {
                const touch = new Touch({identifier:1, target:el, clientX:point[0], clientY:point[1]});
                el.dispatchEvent(new TouchEvent(type, {bubbles:true, touches:type==='touchstart'?[touch]:[], changedTouches:[touch]}));
            }
        }''', [start, end])

    def test_all_9_pages_at_six_mobile_sizes(self):
        for width, height in [(320, 568), (390, 844), (768, 1024), (568, 320), (844, 390), (932, 430)]:
            page = self.open_page(width, height)
            self.assertEqual(page.locator('.catalog-progress-track input').get_attribute('max'), '8')
            for index, expected_title in enumerate(EXPECTED_TITLES):
                with self.subTest(width=width, height=height, page=index + 1):
                    page.wait_for_timeout(30)
                    metrics = page.locator('.catalog-leaf').evaluate('''el => ({
                        client:el.clientHeight, total:el.scrollHeight,
                        overflow:getComputedStyle(el).overflowY,
                        bodyOverflow:document.documentElement.scrollWidth>innerWidth,
                        text:el.querySelector('.paper').innerText.trim()
                    })''')
                    self.assertGreater(len(metrics['text']), 20)
                    self.assertFalse(metrics['bodyOverflow'])
                    self.assertIn(metrics['overflow'], ['auto', 'scroll'])
                    self.assertEqual(page.locator('.catalog-page-context>b').inner_text(), expected_title)
                    self.assertEqual(page.locator('.story-profile-paper, .foundation-paper, .trust-reasons-paper, .partner-network-paper').count(), 0)
                    self.assertEqual(page.locator('.ict-symbol, .ict-code').count(), 0)
                    footer = page.locator('.catalog-bottom').bounding_box()
                    self.assertGreaterEqual(footer['y'], 0)
                    self.assertLessEqual(footer['y'] + footer['height'], height + 1)
                    # Native wheel input must scroll the current page, never turn it.
                    title = page.locator('.catalog-page-context>b').inner_text()
                    rect = page.locator('.catalog-leaf').bounding_box()
                    page.mouse.move(rect['x'] + rect['width'] / 2, rect['y'] + rect['height'] / 2)
                    page.mouse.wheel(0, 4000)
                    page.wait_for_timeout(100)
                    self.assertEqual(page.locator('.catalog-page-context>b').inner_text(), title)
                    if metrics['total'] > metrics['client'] + 1:
                        self.assertGreater(page.locator('.catalog-leaf').evaluate('el=>el.scrollTop'), 0)
                    # Every page bottom is reachable and new pages open at the top.
                    page.locator('.catalog-leaf').evaluate('el=>el.scrollTop=el.scrollHeight')
                    bottom = page.locator('.catalog-leaf').evaluate('el=>el.scrollHeight-el.clientHeight-el.scrollTop')
                    self.assertLessEqual(abs(bottom), 1)
                    page.keyboard.press('ArrowLeft')
                    if index < len(EXPECTED_TITLES) - 1:
                        self.assertEqual(page.locator('.catalog-leaf').evaluate('el=>el.scrollTop'), 0)

    def test_table_of_contents_and_contact_numbering(self):
        page = self.open_page(1440, 1000, mobile=False)
        page.locator('.toc-button').click()
        self.assertEqual(page.locator('.toc-list button b').all_text_contents(), EXPECTED_TITLES)
        self.assertEqual(page.locator('.toc-list button>span').all_text_contents(), ['۰۱', '۰۲', '۰۳', '۰۴', '۰۵', '۰۶', '۰۷', '۰۸', '۰۹'])
        page.locator('.toc-list button').last.click()
        self.assertEqual(page.locator('.catalog-page-context>b').inner_text(), 'تماس')
        self.assertEqual(page.locator('.folio').inner_text(), '۰۹')

    def test_portfolio_brand_and_supplier_orbits(self):
        groups = {
            'compute': ['dell', 'hpe', 'lenovo', 'supermicro'],
            'storage': ['dell', 'hpe', 'netapp', 'huawei'],
            'network': ['cisco', 'juniper', 'arista', 'huawei', 'fortinet'],
            'ai': ['dell', 'supermicro', 'hpe', 'lenovo', 'nvidia'],
        }
        suppliers = ['AlJammaz Technologies', 'ASBIS Middle East', 'Bulwark Technologies',
            'Credence Security', 'CyberKnight', 'FVC', 'Gulf Software Distribution',
            'Hiperdist', 'Ingram Micro', 'Logicom', 'Metra Group', 'Mitsumi', 'Newcom',
            'Redington Value', 'SCOPE ME', 'VAD Technologies', 'Westcon Comstor']
        for width, height in [(1440, 1000), (1024, 768), (390, 844), (320, 568), (844, 390)]:
            with self.subTest(width=width, height=height):
                page = self.open_page(width, height, mobile=width < 1025)
                for _ in range(7): page.keyboard.press('ArrowLeft')
                self.assertEqual(page.locator('.portfolio-detail-panel').count(), 0)
                self.assertEqual(page.locator('.portfolio-category-choice').count(), 4)
                self.assertEqual(page.locator('.portfolio-brand-mark').count(), 11)
                self.assertEqual(page.locator('.portfolio-supplier').evaluate_all('els=>els.map(e=>e.getAttribute("aria-label"))'), suppliers)
                circle = page.locator('.portfolio-wheel').bounding_box()
                self.assertAlmostEqual(circle['width'], circle['height'], places=1)
                foreground = page.locator('.portfolio-foreground').bounding_box()
                self.assertAlmostEqual(circle['x'] + circle['width']/2, foreground['x'] + foreground['width']/2, delta=1)
                for category, brands in groups.items():
                    button = page.locator(f'.portfolio-category-choice[aria-label="{ {"compute":"زیرساخت‌های پردازشی", "storage":"ذخیره‌سازی و پشتیبان‌گیری", "network":"تجهیزات شبکه", "ai":"زیر ساخت تجهیزات هوش مصنوعی"}[category] }"]')
                    button.click()
                    self.assertEqual(button.get_attribute('aria-pressed'), 'true')
                    self.assertCountEqual(page.locator('.portfolio-brand-mark.is-associated').evaluate_all('els=>els.map(e=>e.dataset.brand)'), brands)
                errors = page.locator('.portfolio-brand-mark').evaluate_all('els=>{const b=document.querySelector(".portfolio-wheel").getBoundingClientRect(), cx=b.x+b.width/2, cy=b.y+b.height/2, r=b.width/2;return els.flatMap(el=>{const q=el.getBoundingClientRect(),img=el.querySelector("img"),v=document.querySelector(".portfolio-foreground").getBoundingClientRect();const outside=q.left<v.left-1||q.right>v.right+1||q.top<v.top-1||q.bottom>v.bottom+1;const inside=Math.hypot(q.x+q.width/2-cx,q.y+q.height/2-cy)<r;return outside||inside||!img.complete||!img.naturalWidth?[el.dataset.brand]:[]})}')
                self.assertEqual(errors, [])
                self.assertEqual(page.locator('.portfolio-energy-a').evaluate('el=>getComputedStyle(el).animationName'), 'none')
                self.assertEqual(page.locator('.portfolio-digital-core>svg').evaluate('el=>getComputedStyle(el).animationName'), 'none')
                if width > 1024:
                    outer = page.locator('.portfolio-support-orbit').bounding_box()
                    self.assertGreater(outer['width'], circle['width'] * 2)
                else:
                    page.locator('.catalog-leaf').evaluate('el=>el.scrollTop=el.scrollHeight')
                    last = page.locator('.portfolio-supplier').last.bounding_box()
                    leaf = page.locator('.catalog-leaf').bounding_box()
                    self.assertLessEqual(last['y']+last['height'],leaf['y']+leaf['height']+1)

    def test_portfolio_animation_respects_reduced_motion(self):
        page = self.open_page(1440, 1000, mobile=False, freeze_animation=False)
        for _ in range(7): page.keyboard.press('ArrowLeft')
        energy = page.locator('.portfolio-energy-a')
        self.assertEqual(energy.evaluate('el=>getComputedStyle(el).animationName'), 'none')
        page.emulate_media(reduced_motion='no-preference')
        self.assertEqual(energy.evaluate('el=>getComputedStyle(el).animationName'), 'portfolio-ring-turn')
        start = energy.evaluate('el=>getComputedStyle(el).transform')
        page.wait_for_timeout(150)
        self.assertNotEqual(energy.evaluate('el=>getComputedStyle(el).transform'), start)
        page.emulate_media(reduced_motion='reduce')
        self.assertEqual(energy.evaluate('el=>getComputedStyle(el).animationName'), 'none')

    def test_touch_drag_keyboard_and_page_swipe(self):
        page = self.open_page(390, 700)
        # Start a vertical swipe on the cover, including 65px lateral drift.
        client = page.context.new_cdp_session(page)
        client.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':175,'y':560}]})
        for step in range(1, 9):
            client.send('Input.dispatchTouchEvent', {'type':'touchMove','touchPoints':[{'x':175+65*step/8,'y':560-310*step/8}]})
            page.wait_for_timeout(25)
        client.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})
        page.wait_for_timeout(150)
        self.assertEqual(page.locator('.catalog-page-context>b').inner_text(), 'جلد')
        self.assertGreater(page.locator('.catalog-leaf').evaluate('el=>el.scrollTop'), 0)
        page.keyboard.press('Home')
        self.assertEqual(page.locator('.catalog-leaf').evaluate('el=>el.scrollTop'), 0)
        page.keyboard.press('End')
        self.assertEqual(page.locator('.catalog-page-context>b').inner_text(), 'جلد')
        self.assertGreater(page.locator('.catalog-leaf').evaluate('el=>el.scrollTop'), 0)
        page.keyboard.press('Home')
        # A distinctly horizontal gesture still turns the catalogue.
        self.swipe(page.locator('.cover-image img'), (280, 180), (100, 185))
        self.assertNotEqual(page.locator('.catalog-page-context>b').inner_text(), 'جلد')
        self.assertEqual(page.locator('.catalog-leaf').evaluate('el=>el.scrollTop'), 0)

    def test_nested_timeline_and_stepper_do_not_turn_catalogue(self):
        page = self.open_page()
        page.keyboard.press('ArrowLeft')
        rail = page.locator('.history-rail-scroll')
        self.assertIn('pan-y', rail.evaluate('el=>getComputedStyle(el).touchAction'))
        title = page.locator('.catalog-page-context>b').inner_text()
        target = rail.locator('button').first
        self.swipe(target, (280, 200), (60, 200))
        self.assertEqual(page.locator('.catalog-page-context>b').inner_text(), title)
        # Vertical drags originating on the horizontal timeline also scroll.
        page.locator('.catalog-leaf').evaluate('el=>el.scrollTop=0')
        rail.scroll_into_view_if_needed()
        rect=rail.bounding_box()
        client=page.context.new_cdp_session(page)
        x=rect['x']+rect['width']/2; y=rect['y']+rect['height']/2
        start=page.locator('.catalog-leaf').evaluate('el=>el.scrollTop')
        client.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
        for step in range(1,7):
            client.send('Input.dispatchTouchEvent', {'type':'touchMove','touchPoints':[{'x':x,'y':y-130*step/6}]})
            page.wait_for_timeout(25)
        client.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})
        page.wait_for_timeout(120)
        self.assertGreater(page.locator('.catalog-leaf').evaluate('el=>el.scrollTop'), start)
        self.assertEqual(page.locator('.catalog-page-context>b').inner_text(), title)
        for _ in range(4): page.keyboard.press('ArrowLeft')
        title=page.locator('.catalog-page-context>b').inner_text()
        icon=page.locator('.process-flow-stepper svg').first
        self.swipe(icon, (280, 200), (60, 200))
        self.assertEqual(page.locator('.catalog-page-context>b').inner_text(), title)

    def test_desktop_navigation_and_aspect_ratio_unchanged(self):
        page = self.open_page(1440, 1000, mobile=False)
        rect = page.locator('.catalog-leaf').bounding_box()
        self.assertAlmostEqual(rect['width']/rect['height'], 16/9, places=2)
        self.assertEqual(page.locator('.catalog-leaf').evaluate('el=>getComputedStyle(el).overflowY'), 'visible')
        page.keyboard.press('ArrowDown')
        self.assertNotEqual(page.locator('.catalog-page-context>b').inner_text(), 'جلد')
        page.keyboard.press('Home')
        self.assertEqual(page.locator('.catalog-page-context>b').inner_text(), 'جلد')
        rect = page.locator('.catalog-leaf').bounding_box()
        page.mouse.move(rect['x']+100, rect['y']+100)
        page.mouse.wheel(0, 150)
        page.wait_for_timeout(120)
        self.assertNotEqual(page.locator('.catalog-page-context>b').inner_text(), 'جلد')

if __name__ == '__main__':
    unittest.main(verbosity=2)
