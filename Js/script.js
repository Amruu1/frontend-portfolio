(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".portrait__frame img").forEach((img) => {
    const hideImage = () => {
      img.hidden = true;
    };

    img.addEventListener("error", hideImage);

    if (img.complete && !img.naturalWidth) {
      hideImage();
    }
  });

  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-in"));
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

    reveals.forEach((element) => revealer.observe(element));
  }

  const links = [
    ...document.querySelectorAll('.dock a[href^="#"]:not(.dock__logo)'),
  ];

  if (!("IntersectionObserver" in window)) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  links.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) sectionObserver.observe(section);
  });
})();
