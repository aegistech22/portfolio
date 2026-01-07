// =========================
// PREMIUM PAGE ANIMATION ENGINE
// =========================

let isTransitioning = false;

// INIT
document.addEventListener("DOMContentLoaded", () => {
  prepareInitialView();
  interceptNavigation();
});

// Prepare first load
function prepareInitialView() {
  const app = document.querySelector("#app");
  if (!app) return;

  app.style.opacity = "0";
  app.style.transform = "translateY(20px)";

  requestAnimationFrame(() => {
    app.style.transition = "opacity 600ms ease, transform 600ms ease";
    app.style.opacity = "1";
    app.style.transform = "translateY(0)";
  });
}

// Intercept navigation clicks
function interceptNavigation() {
  document.body.addEventListener("click", async (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("http")) return;

    e.preventDefault();
    if (isTransitioning) return;

    await transitionTo(href);
  });
}

// Core transition logic
async function transitionTo(page) {
  isTransitioning = true;

  const app = document.querySelector("#app");
  if (!app) return;

  // Exit animation
  app.style.transition = "opacity 300ms ease, transform 300ms ease";
  app.style.opacity = "0";
  app.style.transform = "translateY(-10px)";

  await wait(320);

  // Load next page
  const res = await fetch(page);
  const html = await res.text();
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const nextApp = temp.querySelector("#app");
  if (!nextApp) return;

  app.innerHTML = nextApp.innerHTML;
  history.pushState({}, "", page);

  // Reset for entry
  app.style.transition = "none";
  app.style.transform = "translateY(20px)";

  requestAnimationFrame(() => {
    app.style.transition = "opacity 600ms ease, transform 600ms ease";
    app.style.opacity = "1";
    app.style.transform = "translateY(0)";
  });

  animateHeading();

  await wait(650);
  isTransitioning = false;
}

// Subtle heading entrance
function animateHeading() {
  const h1 = document.querySelector("#app h1");
  if (!h1) return;

  h1.style.opacity = "0";
  h1.style.transform = "translateY(10px)";

  requestAnimationFrame(() => {
    h1.style.transition = "opacity 500ms ease, transform 500ms ease";
    h1.style.opacity = "1";
    h1.style.transform = "translateY(0)";
  });
}

// Utility
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}