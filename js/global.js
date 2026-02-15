
    (function () {
      // rotating subtitle
      const el = document.querySelector('.subtitle .rot');
      const words = ['nature', 'biotech', 'automation'];
      let i = 0;
      setInterval(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i === 0 ? words.length - 1 : i - 1] + ' · ' + words[i] + ' · ' + words[(i + 1) % words.length];
      }, 2600);

      // mobile menu
      const btn = document.getElementById('menuBtn');
      const drawer = document.getElementById('mobileMenu');
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        drawer.classList.toggle('open');
      });
      // close on link click
      drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        btn.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('open');
      }));
    })();

    (function () {
      const navbar = document.getElementById('navbar');
      let lastScrollY = window.scrollY;
      let ticking = false;

      function updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY;

        if (Math.abs(scrollDiff) < 10) {
          ticking = false;
          return;
        }

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // scrolling down → hide
          navbar.classList.add('hide');
          navbar.classList.remove('show');
        } else {
          // scrolling up → show
          navbar.classList.remove('hide');
          navbar.classList.add('show');
        }

        // add shadow when scrolled past top
        if (currentScrollY > 20) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        lastScrollY = currentScrollY;
        ticking = false;
      }

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(updateNavbar);
          ticking = true;
        }
      });
    })();

    (function () {
      const list = document.getElementById('newsList');
      if (!list) return;

      fetch('data/news.json')
        .then(r => r.json())
        .then(items => {
          const sorted = items
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

          list.innerHTML = sorted.map(renderItem).join('');
        })
        .catch(() => {
          list.innerHTML = '<li class="news-item muted">Unable to load news right now.</li>';
        });

      function renderItem(n) {
        const date = new Date(n.date);
        const nice = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        const tags = (n.tags || []).map(t => `<span class="tag mini">${t}</span>`).join('');
        const title = n.url ? `<a href="${n.url}" target="_blank" rel="noopener">${n.title}</a>`
          : `<span>${n.title}</span>`;
        const sum = n.summary ? `<p class="news-sum">${n.summary}</p>` : '';
        return `
        <li class="news-item">
          <div class="news-meta">
            <time datetime="${n.date}" class="news-date">${nice}</time>
            <div class="news-tags">${tags}</div>
          </div>
          <h3 class="news-title">${title}</h3>
          ${sum}
        </li>`;
      }
    })();

    (function () {
      const root = document.documentElement;
      const btns = [document.getElementById('themeToggle'), document.getElementById('themeToggleMobile')].filter(Boolean);

      // Load saved theme
      const saved = localStorage.getItem('theme'); // 'light' or 'dark'
      if (saved === 'light') root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme'); // default dark

      // Toggle handler
      function toggleTheme() {
        const isLight = root.getAttribute('data-theme') === 'light';
        if (isLight) {
          root.removeAttribute('data-theme');     // back to dark
          localStorage.setItem('theme', 'dark');
        } else {
          root.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
        }
      }
      btns.forEach(b => b.addEventListener('click', toggleTheme));
    })();