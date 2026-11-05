// Renders the "Awakening" scroll narrative on the homepage from the real
// Story doc beats in data/lore.json (world.stages), with a lightweight
// scroll-reveal. No framework; respects prefers-reduced-motion.
export async function renderStoryScroll(mount) {
  const lore = await fetch("/data/lore.json").then((r) => r.json());
  const stages = lore.world?.stages || [];
  mount.innerHTML = stages
    .map(
      (s, i) => `
    <article class="story-stage" data-index="${i}">
      <p class="eyebrow">${s.eyebrow}</p>
      <h2>${s.heading}</h2>
      <p class="story-text">${s.text}</p>
    </article>`,
    )
    .join("");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = mount.querySelectorAll(".story-stage");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.35 },
  );
  items.forEach((el) => observer.observe(el));
}
