function highlightYourName(authors) {
  if (!authors) return "";
  return authors.replace(
    /Md Hedayetul Islam Chy/g,
    '<span class="me">Md Hedayetul Islam Chy</span>'
  );
}

function sortPublications(items) {
  return items.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;

    const statusOrder = {
      "Published": 1,
      "Accepted": 2,
      "Under Review": 3,
      "Submitted": 4,
      "Abstract Submitted": 5,
      "In Preparation": 6
    };

    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });
}

function createPublicationCard(item) {
  const div = document.createElement("article");
  div.className = "pub-card";

  const actionHTML =
    item.link && item.link.trim() !== ""
      ? `<a class="btn-chip" href="${item.link}" target="_blank" rel="noopener">Paper ↗</a>`
      : `<span class="btn-chip status-chip">${item.status || "Ongoing"}</span>`;

  div.innerHTML = `
    <div class="pub-meta">
      <span class="pub-badge">${item.category}</span>
      <span class="pub-journal">${item.venue}</span>
      <span class="pub-year">${item.year}</span>
    </div>

    <div class="pub-body">
      <h3 class="pub-title">${item.title}</h3>
      <p class="pub-authors muted">${highlightYourName(item.authors)}</p>
      <div class="pub-actions">
        ${actionHTML}
      </div>
    </div>
  `;

  return div;
}

async function loadPublications() {
  try {
    const response = await fetch("./data/publications.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const publicationList = document.getElementById("publication-list");

    if (!publicationList) return;

    publicationList.innerHTML = "";

    const items = sortPublications(data.publications || []);
    items.forEach(item => {
      publicationList.appendChild(createPublicationCard(item));
    });
  } catch (error) {
    console.error("Failed to load publications:", error);
    const publicationList = document.getElementById("publication-list");
    if (publicationList) {
      publicationList.innerHTML = "<p>Failed to load publications.</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", loadPublications);