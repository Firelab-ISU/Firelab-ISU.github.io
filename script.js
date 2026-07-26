document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupActiveNavigation();
  setupRevealAnimations();
  setupCounters();

  setupFiltering('.people-filter .filter-btn', '.person-card');
  setupFiltering('.news-filter .filter-btn', '.news-card');

  setupPublicationYearFiltering();
  loadFeaturedPublications(3);
});

/* ---------------------------------------------
   Mobile navigation
--------------------------------------------- */

function setupNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.setAttribute(
      'aria-expanded',
      navLinks.classList.contains('open')
    );
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------
   Active navigation link
--------------------------------------------- */

function setupActiveNavigation() {
  const pageName = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');

    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---------------------------------------------
   Reveal animations
--------------------------------------------- */

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal');

  if (!revealItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12
  });

  revealItems.forEach((item) => observer.observe(item));
}

function revealElement(element) {
  if (!element) return;

  requestAnimationFrame(() => {
    element.classList.add('visible');
  });
}

/* ---------------------------------------------
   Animated counters
--------------------------------------------- */

function setupCounters() {
  const counters = document.querySelectorAll('[data-count]');

  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1100;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        el.textContent = `${Math.round(target * eased)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, {
    threshold: 0.6
  });

  counters.forEach((counter) => counterObserver.observe(counter));
}

/* ---------------------------------------------
   Generic filtering for People and News pages
--------------------------------------------- */

function setupFiltering(buttonSelector, itemSelector) {
  const buttons = document.querySelectorAll(buttonSelector);
  const items = document.querySelectorAll(itemSelector);

  if (!buttons.length || !items.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      items.forEach((item) => {
        const category = item.dataset.category || '';
        const categories = category.split(/\s+/);

        const show = filter === 'all' || categories.includes(filter);

        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ---------------------------------------------
   Year-only publication filtering
--------------------------------------------- */

function setupPublicationYearFiltering() {
  const yearButtons = document.querySelectorAll(
    '.publication-year-filter .filter-btn'
  );

  const publications = document.querySelectorAll('.pub-card');

  if (!yearButtons.length || !publications.length) return;

  function applyYearFilter(selectedYear) {
    publications.forEach((pub) => {
      const pubYear =
        pub.dataset.year ||
        pub.querySelector('.year-badge')?.textContent.trim();

      const show = selectedYear === 'all' || pubYear === selectedYear;

      pub.style.display = show ? '' : 'none';
    });
  }

  yearButtons.forEach((button) => {
    button.addEventListener('click', () => {
      yearButtons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      applyYearFilter(button.dataset.year);
    });
  });

  applyYearFilter('all');
}

/* ---------------------------------------------
   Homepage featured publications
   This automatically pulls the first 3 publications
   from publications.html into index.html.
--------------------------------------------- */

async function loadFeaturedPublications(limit = 3) {
  const container = document.querySelector('#featured-publications');

  if (!container) return;

  try {
    const response = await fetch('publications.html', {
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error('Could not load publications.html');
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const publications = Array.from(
      doc.querySelectorAll('.publication-list .pub-card')
    ).slice(0, limit);

    if (!publications.length) {
      throw new Error('No publication cards found in publications.html');
    }

    container.innerHTML = '';

    publications.forEach((pub) => {
      const clone = pub.cloneNode(true);

      clone.classList.add('reveal');

      const links = clone.querySelectorAll('a');

      links.forEach((link) => {
        const href = link.getAttribute('href');

        if (!href || href === '#') {
          link.setAttribute('href', 'publications.html');
        } else if (href.startsWith('#')) {
          link.setAttribute('href', `publications.html${href}`);
        }
      });

      container.appendChild(clone);
      revealElement(clone);
    });
  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <article class="pub-card reveal visible">
        <div class="year-badge">!</div>
        <div>
          <div class="pub-meta">
            <span>Publications</span>
          </div>
          <h3>Unable to load featured publications.</h3>
          <p>Please visit the publications page to view recent research highlights.</p>
          <div class="pub-links">
            <a class="text-link" href="publications.html">View Publications</a>
          </div>
        </div>
      </article>
    `;
  }
}