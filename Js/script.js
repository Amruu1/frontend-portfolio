(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Project details open in a modal dialog filled from the hidden block next to each project.
  const dialog = document.getElementById("detail");
  const body = dialog.querySelector(".dialog__body");
  document.querySelectorAll("[data-detail]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const source = document.getElementById(btn.dataset.detail);
      body.replaceChildren(
        ...[...source.children].map((node) => node.cloneNode(true)),
      );
      dialog.showModal();
    });
  });
  dialog
    .querySelector(".dialog__close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  document.querySelectorAll(".portrait__frame img").forEach((img) => {
    const hide = () => {
      img.hidden = true;
    };
    img.addEventListener("error", hide);
    if (img.complete && !img.naturalWidth) hide();
  });

  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );
    reveals.forEach((el) => revealer.observe(el));
  }

  // Mark the nav link for the section crossing the middle of the viewport.
  const links = [
    ...document.querySelectorAll('.dock a[href^="#"]:not(.dock__logo)'),
  ];
  if (!("IntersectionObserver" in window)) return;
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          if (a.hash === `#${entry.target.id}`)
            a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  links.forEach((a) => spy.observe(document.querySelector(a.hash)));
})();
