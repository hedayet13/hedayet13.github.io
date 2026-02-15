(async function renderRecentProjects() {
  const grid = document.getElementById("recentProjectsGrid");
  if (!grid) return;

  const JSON_PATH = "data/projects.json"; // ✅ change path if your file is in another folder

  // Convert descriptionHtml to plain text for preview (keeps UI clean)
  function htmlToText(html = "") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim();
  }

  function isExternal(url = "") {
    return /^https?:\/\//i.test(url);
  }

  function cardHTML(p, idx) {
    const desc = htmlToText(p.descriptionHtml || "");
    const tools = Array.isArray(p.tools) ? p.tools.slice(0, 8) : [];
    const links = Array.isArray(p.links) ? p.links.slice(0, 4) : [];

    const badge = idx === 0 ? "Recent" : "Featured";

    return `
      <article class="rp-card ${idx === 0 ? "rp-card--accent" : ""}">
        <div class="rp-media">
          <span class="rp-badge">${badge}</span>
          <img src="${p.image}" alt="${p.imageAlt || p.title}" loading="lazy" decoding="async">
        </div>

        <div class="rp-body">
          <h3 class="rp-title">${p.title}</h3>
          <p class="rp-desc">${desc}</p>

          <div class="rp-tools">
            ${tools.map(t => `<span class="rp-chip">${t}</span>`).join("")}
          </div>

          <div class="rp-links">
            ${links.map(l => `
              <a class="rp-link"
                 href="${l.url}"
                 ${isExternal(l.url) ? `target="_blank" rel="noopener"` : ""}>
                ${l.label}
              </a>
            `).join("")}
          </div>
        </div>
      </article>
    `;
  }

  try {
    const res = await fetch(JSON_PATH, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load: ${JSON_PATH}`);

    const data = await res.json();

    // ✅ IMPORTANT: your JSON is { "projects": [...] }
    const projects = Array.isArray(data.projects) ? data.projects : [];

    // ✅ recent 3 = first 3 items in JSON
    const recent3 = projects.slice(0, 3);

    if (!recent3.length) {
      grid.innerHTML = `<div class="rp-empty">No projects found.</div>`;
      return;
    }

    grid.innerHTML = recent3.map(cardHTML).join("");
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div class="rp-empty">Could not load projects.</div>`;
  }
})();
