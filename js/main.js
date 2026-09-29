document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Load global header & footer partials ---------- */
  var headerSlot = document.getElementById('header-placeholder');
  var footerSlot = document.getElementById('footer-placeholder');

  var headerLoaded = headerSlot
    ? fetch('/partials/header.html').then(function (r) { return r.text(); }).then(function (html) {
        headerSlot.outerHTML = html;
      })
    : Promise.resolve();

  var footerLoaded = footerSlot
    ? fetch('/partials/footer.html').then(function (r) { return r.text(); }).then(function (html) {
        footerSlot.outerHTML = html;
      })
    : Promise.resolve();

  Promise.all([headerLoaded, footerLoaded]).then(function () {
    initHeaderNav();
    initHeaderScrollShadow();
    initFooterYear();
  }).catch(function (err) {
    console.error('Failed to load site header/footer partials:', err);
  });

  /* ---------- Menu tabs ---------- */
  var tabButtons = document.querySelectorAll('.menu-tab-btn');
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-target');
      document.querySelectorAll('.menu-tab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.menu-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.querySelector(target);
      panel && panel.classList.add('active');
    });
  });

  /* ---------- Accordion (FAQ) ---------- */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var panel = item.querySelector('.accordion-panel');
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.closest('.accordion-list').querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Horizontal scroll carousels (reviews / gallery) ---------- */
  function wireCarousel(trackSelector, prevSelector, nextSelector) {
    var track = document.querySelector(trackSelector);
    if (!track) return;
    var prev = document.querySelector(prevSelector);
    var next = document.querySelector(nextSelector);
    function scrollAmount() {
      var card = track.querySelector(':scope > *');
      return card ? card.getBoundingClientRect().width + 24 : 300;
    }
    prev && prev.addEventListener('click', function () { track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }); });
    next && next.addEventListener('click', function () { track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); });
  }
  wireCarousel('.review-track', '.review-nav .prev', '.review-nav .next');
  wireCarousel('.gallery-track', '.gallery-nav .prev', '.gallery-nav .next');

});

/* ---------- Header: mobile nav toggle ---------- */
function initHeaderNav() {
  var hamburger = document.querySelector('.hamburger');
  var mainNav = document.querySelector('.main-nav');
  var backdrop = document.querySelector('.nav-backdrop');

  function closeNav() {
    hamburger && hamburger.classList.remove('active');
    mainNav && mainNav.classList.remove('open');
    backdrop && backdrop.classList.remove('open');
  }

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mainNav.classList.toggle('open');
      backdrop && backdrop.classList.toggle('open');
    });
  }
  backdrop && backdrop.addEventListener('click', closeNav);
  document.querySelectorAll('.main-nav a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });
}

/* ---------- Header: shadow on scroll ---------- */
function initHeaderScrollShadow() {
  var header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 4) header.style.boxShadow = '0 4px 18px rgba(0,0,0,0.06)';
    else header.style.boxShadow = 'none';
  });
}

/* ---------- Footer: copyright year ---------- */
function initFooterYear() {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
