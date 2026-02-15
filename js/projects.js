(async function () {
  const root = document.getElementById("projectsList");
  if (!root) return;

  try {
    const res = await fetch("data/projects.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load data/projects.json (${res.status})`);
    const { projects = [] } = await res.json();

    if (!projects.length) {
      root.innerHTML = `<div class="p-empty">No projects found.</div>`;
      return;
    }

    const first = projects[0];
    const rest = projects.slice(1);

    root.innerHTML =
      renderFeatured(first) +
      `<div class="p-grid">${rest.map(renderCompact).join("")}</div>`;
  } catch (e) {
    console.error(e);
    root.innerHTML = `
      <div class="p-empty">
        Could not load projects. Check <code>data/projects.json</code> path and run via a local server.
      </div>`;
  }

  function esc(s = "") {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderTags(links = []) {
    return links.map(l => {
      const label = esc(l.label || "Link");
      const url = esc(l.url || "#");
      return `<a class="p-tag" href="${url}" target="_blank" rel="noopener">${label}</a>`;
    }).join("");
  }

  function renderTools(tools = []) {
    if (!tools.length) return "";
    return `<div class="p-tools"><strong>Tools:</strong> ${tools.map(esc).join(", ")}</div>`;
  }

  function renderFeatured(p) {
    const title = esc(p.title || "");
    const img = esc(p.image || "");
    const alt = esc(p.imageAlt || p.title || "Project image");
    const descHtml = p.descriptionHtml || "";
    const toolsHtml = renderTools(p.tools || []);
    const tagsHtml = renderTags(p.links || []);

    return `
      <article class="p-card p-featured">
        <div class="p-media">
          <img src="${img}" alt="${alt}" loading="lazy" decoding="async">
          <div class="p-mediaGlow"></div>
        </div>

        <div class="p-content">
          <div class="p-kicker">Featured Project</div>
          <h3 class="p-title">${title}</h3>
          <div class="p-desc">${descHtml}</div>
          ${toolsHtml}
          <div class="p-tags">${tagsHtml}</div>
        </div>
      </article>
    `;
  }

  function renderCompact(p) {
    const title = esc(p.title || "");
    const img = esc(p.image || "");
    const alt = esc(p.imageAlt || p.title || "Project image");
    const descHtml = p.descriptionHtml || "";
    const toolsHtml = renderTools(p.tools || []);
    const tagsHtml = renderTags(p.links || []);

    return `
      <article class="p-card p-compact">
        <div class="p-media">
          <img src="${img}" alt="${alt}" loading="lazy" decoding="async">
        </div>

        <div class="p-content">
          <h3 class="p-title">${title}</h3>
          <div class="p-desc p-clamp">${descHtml}</div>
          ${toolsHtml}
          <div class="p-tags">${tagsHtml}</div>
        </div>
      </article>
    `;
  }
})();
