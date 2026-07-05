/**
 * Portfolio interactions:
 * - Smooth-scroll navigation from the "Hierarchy" panel to each "Inspector" section
 * - Active nav item tracking via IntersectionObserver
 * - Mobile hierarchy drawer (open/close)
 * - Decorative toolbar play/pause/stop state
 */

// --- Private module-level state ---------------------------------------
const _navItems = document.querySelectorAll(".hierarchy__item");
const _sections = document.querySelectorAll(".component");
const _hierarchy = document.getElementById("hierarchy");
const _overlay = document.getElementById("hierarchyOverlay");
const _menuToggle = document.getElementById("menuToggle");
const _statusText = document.getElementById("statusText");
const _toolbarButtons = document.querySelectorAll("[data-tool-btn]");

const _sectionById = new Map();
_sections.forEach((section) => _sectionById.set(section.id, section));

// --- Nav: click to scroll ------------------------------------------------
function _setActiveNavItem(targetId) {
  _navItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.target === targetId);
  });
}

_navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetId = item.dataset.target;
    const targetSection = _sectionById.get(targetId);
    if (!targetSection) return;

    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    _setActiveNavItem(targetId);
    _closeMobileHierarchy();
  });
});

// --- Nav: highlight active section while scrolling -----------------------
const _observer = new IntersectionObserver(
  (entries) => {
    // Pick the entry closest to the top of the viewport that is intersecting.
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visible.length > 0) {
      _setActiveNavItem(visible[0].target.id);
    }
  },
  { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
);

_sections.forEach((section) => _observer.observe(section));

// --- Mobile hierarchy drawer ----------------------------------------------
function _openMobileHierarchy() {
  _hierarchy.classList.add("is-open");
  _overlay.classList.add("is-visible");
  _menuToggle.setAttribute("aria-expanded", "true");
}

function _closeMobileHierarchy() {
  _hierarchy.classList.remove("is-open");
  _overlay.classList.remove("is-visible");
  _menuToggle.setAttribute("aria-expanded", "false");
}

_menuToggle.addEventListener("click", () => {
  const isOpen = _hierarchy.classList.contains("is-open");
  isOpen ? _closeMobileHierarchy() : _openMobileHierarchy();
});

_overlay.addEventListener("click", _closeMobileHierarchy);

// --- Decorative toolbar controls (play / pause / stop) --------------------
const _statusByTool = {
  play: "Running...",
  pause: "Ready.",
  stop: "Stopped.",
};

_toolbarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    _toolbarButtons.forEach((b) => b.classList.remove("is-active"));
    button.classList.add("is-active");

    const tool = button.dataset.toolBtn;
    _statusText.textContent = _statusByTool[tool] ?? "Ready.";
  });
});
