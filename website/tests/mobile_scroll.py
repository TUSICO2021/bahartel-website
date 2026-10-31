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

    def open_page(self, width=390, height=844, mobile=True):
        page = self.browser.new_page(viewport={'width': width, 'height': height}, is_mobile=mobile, has_touch=mobile, reduced_motion='reduce')
        self.addCleanup(page.close)
        # Deterministic offline check: external fonts are optional.
        page.route('https://fonts.googleapis.com/**', lambda route: route.fulfill(status=200, content_type='text/css', body=''))
        page.goto(self.url, wait_until='networkidle')
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

    def test_portfolio_logos_stay_in_their_quadrants(self):
        groups = {
            'compute': ['dell', 'hpe', 'lenovo', 'supermicro'],
            'storage': ['dell', 'hpe', 'netapp', 'huawei'],
            'network': ['cisco', 'juniper', 'arista', 'huawei', 'fortinet'],
            'ai': ['dell', 'supermicro', 'hpe', 'lenovo', 'nvidia'],
        }
        for width, height in [(1440, 1000), (1024, 768), (390, 844), (320, 568), (844, 390)]:
            with self.subTest(width=width, height=height):
                page = self.open_page(width, height, mobile=width < 1025)
                for _ in range(7): page.keyboard.press('ArrowLeft')
                self.assertEqual(page.locator('.portfolio-detail-panel').count(), 0)
                self.assertEqual(page.locator('.portfolio-quadrant').count(), 4)
                circle = page.locator('.portfolio-diagram').bounding_box()
                self.assertAlmostEqual(circle['width'], circle['height'], places=1)
                stage = page.locator('.portfolio-stage').bounding_box()
                self.assertAlmostEqual(circle['x'] + circle['width']/2, stage['x'] + stage['width']/2, delta=1)
                for category, brands in groups.items():
                    group = page.locator(f'.portfolio-quadrant-{category}')
                    self.assertEqual(group.locator('.portfolio-brand-mark').count(), len(brands))
                    for brand in brands:
                        self.assertEqual(group.locator(f'.portfolio-brand-{brand}').count(), 1)
                    group.locator('button').click()
                    self.assertEqual(group.locator('button').get_attribute('aria-pressed'), 'true')
                errors = page.locator('.portfolio-brand-mark img, .portfolio-brand-wordmark').evaluate_all('''els => {
                    const b=document.querySelector('.portfolio-diagram').getBoundingClientRect(), cx=b.x+b.width/2, cy=b.y+b.height/2, radius=b.width/2;
                    const errors=els.flatMap(el=>{
                        const r=el.getBoundingClientRect(), q=el.closest('.portfolio-quadrant').getBoundingClientRect();
                        const outsideQuarter=r.top<q.top-1||r.bottom>q.bottom+1||r.left<q.left-1||r.right>q.right+1;
                        const outsideCircle=[[r.left,r.top],[r.right,r.top],[r.left,r.bottom],[r.right,r.bottom]].some(([x,y])=>Math.hypot(x-cx,y-cy)>radius+1);
                        const broken=el.tagName==='IMG'&&(!el.complete||el.naturalWidth===0);
                        return outsideQuarter||outsideCircle||broken ? [el.alt||el.innerText] : [];
                    });
                    for (const title of document.querySelectorAll('.portfolio-category-choice>b')) {
                        const range=document.createRange(); range.selectNodeContents(title);
                        for (const r of range.getClientRects()) {
                            if ([[r.left,r.top],[r.right,r.top],[r.left,r.bottom],[r.right,r.bottom]].some(([x,y])=>Math.hypot(x-cx,y-cy)>radius+1)) errors.push(title.innerText);
                        }
                    }
                    return errors;
                }''')
                self.assertEqual(errors, [])

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
