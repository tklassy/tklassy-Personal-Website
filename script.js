const sidebarBrand = 'tKlassy';
const sidebarLinks = [
  { label: 'Home Page', target: 'index.html' },
  { label: 'Project: Vehicles', target: 'pages/projects/vehicles/index.html' },
  { label: 'Project: School', target: 'pages/projects/school/index.html' },
  { label: 'Project: Games', target: 'pages/projects/games/index.html' },
  { label: 'Project: 4', target: 'pages/projects/project-4/index.html' },
  { label: 'Project: 5', target: 'pages/projects/project-5/index.html' }
];

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
  const currentRelative = getCurrentPageRelativePath();
  const currentDir = currentRelative.includes('/')
    ? currentRelative.substring(0, currentRelative.lastIndexOf('/'))
    : '';
  const currentSegments = currentDir ? currentDir.split('/') : [];
  const targetSegments = target.split('/').filter(Boolean);

  let commonDepth = 0;
  while (
    commonDepth < Math.min(currentSegments.length, targetSegments.length) &&
    currentSegments[commonDepth] === targetSegments[commonDepth]
  ) {
    commonDepth += 1;
  }

  const upCount = currentSegments.length - commonDepth;
  const downSegments = targetSegments.slice(commonDepth);

  if (upCount === 0) {
    return downSegments.join('/');
  }

  const upPrefix = Array(upCount).fill('..').join('/');
  return `${upPrefix}/${downSegments.join('/')}`;
}

function isActiveTarget(target) {
  const currentRelative = getCurrentPageRelativePath();
  const normalizedTarget = target.replace(/\/+$|index\.html$/i, '');

  if (!normalizedTarget) {
    return currentRelative === 'index.html';
  }

  return currentRelative === target || currentRelative.startsWith(normalizedTarget);
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
