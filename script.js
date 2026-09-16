const sidebarBrand = 'tKlassy';
const sidebarLinks = [
  { label: 'Home Page', target: 'index.html' },
  { label: 'Project: Vehicles', target: 'pages/projects/vehicles/index.html' },
  { label: 'Project: School', target: 'pages/projects/school/index.html' },
  { label: 'Project: Games', target: 'pages/projects/games/index.html' },
  { label: 'Project: 4', target: 'pages/projects/project-4/index.html' },
  { label: 'Project: 5', target: 'pages/projects/project-5/index.html' }
];

const siteRoot = new URL('./', document.currentScript?.src || window.location.href);

function getCurrentPageRelativePath() {
  const fullPath = decodeURI(window.location.pathname);
  const marker = '/tklassy Personal Website/';
  const markerIndex = fullPath.indexOf(marker);

  let relativePath = '';
  
  if (markerIndex !== -1) {
    // File protocol: extract path after workspace folder
    relativePath = fullPath.slice(markerIndex + marker.length).replace(/^\/+/, '');
  } else {
    // Live Server or HTTP: use pathname directly, strip leading slash
    relativePath = fullPath.replace(/^\/+/, '');
  }

  return relativePath;
}

function buildRelativeHref(target) {
  return new URL(target, siteRoot).href;
}

function isActiveTarget(target) {
  const currentPath = new URL(window.location.href).pathname;
  const targetPath = new URL(target, siteRoot).pathname;
  const normalizedTarget = targetPath.replace(/\/+$|index\.html$/i, '');

  if (target === 'index.html') {
    return currentPath === targetPath;
  }

  return currentPath === targetPath || currentPath.startsWith(normalizedTarget);
}

function renderSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = `
    <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
    <div class="brand">${sidebarBrand}</div>
    <nav class="nav" aria-label="Sidebar navigation">
      ${sidebarLinks
        .map((link) => {
          const href = buildRelativeHref(link.target);
          const activeClass = isActiveTarget(link.target) ? ' class="active"' : '';
          return `<a href="${href}"${activeClass}>${link.label}</a>`;
        })
        .join('')}
    </nav>
  `;

  const toggle = sidebar.querySelector('.menu-toggle');
  if (!toggle) return;

  sidebar.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');

  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  sidebar.querySelectorAll('.nav a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 820) {
        sidebar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', renderSidebar);
