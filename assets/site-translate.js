(function(){
  const LANGS = ['fr', 'en', 'es', 'de', 'zh-CN', 'ru', 'ar'];
  const STORE_KEY = 'cookonai-lang';

  function setCookie(name, value) {
    const maxAge = value ? ';max-age=31536000' : ';max-age=0';
    document.cookie = `${name}=${value};path=/${maxAge};SameSite=Lax`;
    document.cookie = `${name}=${value};domain=.cookonai.com;path=/${maxAge};SameSite=Lax`;
  }

  function getLang() {
    const stored = localStorage.getItem(STORE_KEY);
    return LANGS.includes(stored) ? stored : 'fr';
  }

  function markActive(lang) {
    document.documentElement.lang = lang === 'zh-CN' ? 'zh-Hans' : lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.lang === lang);
      button.setAttribute('aria-pressed', button.dataset.lang === lang ? 'true' : 'false');
    });
  }

  function ensureTranslateElement() {
    if (document.getElementById('google_translate_element')) return;
    const el = document.createElement('div');
    el.id = 'google_translate_element';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }

  function loadGoogleTranslate() {
    if (window.google?.translate?.TranslateElement) return;
    if (document.querySelector('script[data-google-translate]')) return;
    window.googleTranslateElementInit = function(){
      new google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'fr,en,es,de,zh-CN,ru,ar',
        autoDisplay: false
      }, 'google_translate_element');
    };
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.dataset.googleTranslate = 'true';
    document.head.appendChild(script);
  }

  function chooseLanguage(lang) {
    if (!LANGS.includes(lang)) return;
    localStorage.setItem(STORE_KEY, lang);
    markActive(lang);
    if (lang === 'fr') {
      setCookie('googtrans', '');
    } else {
      setCookie('googtrans', `/fr/${lang}`);
    }
    location.reload();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const lang = getLang();
    markActive(lang);
    ensureTranslateElement();
    loadGoogleTranslate();
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.addEventListener('click', event => {
        const next = button.dataset.lang || 'fr';
        if (next !== getLang()) {
          event.preventDefault();
          chooseLanguage(next);
        }
      }, true);
    });
  });
})();
