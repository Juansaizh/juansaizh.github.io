(() => {
  const data = window.PORTFOLIO;
  const ASSETS = "assets/";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tiny element helper: h("div", { class: "x" }, child, "text", ...)
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(c));
    }
    return el;
  }

  const pad = (n) => String(n).padStart(2, "0");
  const chips = (list, cls = "chip") => h("ul", { class: "chips", "aria-label": "Stack" }, list.map((t) => h("li", { class: cls }, t)));

  // ---------- Media (video/image with placeholder fallback) ----------

  function media(path, label, { eager = false } = {}) {
    const isVideo = /\.(mp4|webm)$/i.test(path);
    return h(
      "figure",
      { class: "media", "data-src": path, "data-type": isVideo ? "video" : "image", "data-eager": eager || null },
      h(
        "div",
        { class: "ph", "aria-hidden": "true" },
        h("span", { class: "ph-icon" }),
        h("span", { class: "ph-label" }, label),
        h("code", { class: "ph-file" }, "assets/" + path)
      ),
      h("figcaption", { class: "sr-only" }, label)
    );
  }

  function loadMedia(fig) {
    fig.dataset.loaded = "1";
    const src = ASSETS + fig.dataset.src;
    const label = fig.querySelector(".ph-label").textContent;
    if (fig.dataset.type === "video") {
      const v = document.createElement("video");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.setAttribute("aria-label", label);
      v.preload = "metadata";
      if (reducedMotion) v.controls = true;
      v.addEventListener("loadeddata", () => {
        fig.classList.add("is-ready");
        if (!reducedMotion && fig.dataset.visible === "1") v.play().catch(() => {});
      });
      v.addEventListener("error", () => {
        v.remove();
        fig.classList.add("is-missing");
      });
      v.src = src;
      fig.append(v);
    } else {
      const img = new Image();
      img.alt = label;
      img.decoding = "async";
      img.onload = () => fig.classList.add("is-ready");
      img.onerror = () => {
        img.remove();
        fig.classList.add("is-missing");
      };
      img.src = src;
      fig.append(img);
    }
  }

  function initMedia() {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const fig = e.target;
          fig.dataset.visible = e.isIntersecting ? "1" : "0";
          if (e.isIntersecting && !fig.dataset.loaded) loadMedia(fig);
          const v = fig.querySelector("video");
          if (!v || reducedMotion || !fig.classList.contains("is-ready")) continue;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );
    document.querySelectorAll(".media").forEach((f) => io.observe(f));
  }

  // ---------- Carousel (apple.com style: scroll-snap + prev/next) ----------

  function carousel(items, title) {
    const track = h(
      "div",
      { class: "track", tabindex: "0", role: "group", "aria-label": `${title}: features` },
      items.map((it, i) =>
        h(
          "article",
          { class: "slide", "aria-label": `${i + 1} of ${items.length}` },
          media(it.media, it.title),
          h("div", { class: "slide-body" }, h("span", { class: "slide-num" }, pad(i + 1)), h("h4", {}, it.title), h("p", {}, it.text))
        )
      )
    );

    const dots = h(
      "div",
      { class: "dots", role: "tablist", "aria-label": "Choose feature" },
      items.map((it, i) => h("button", { class: "dot", type: "button", role: "tab", "aria-label": it.title, onclick: () => goTo(i) }))
    );
    const prev = h("button", { class: "nav-btn prev", type: "button", "aria-label": "Previous" }, h("span", { "aria-hidden": "true" }, "‹"));
    const next = h("button", { class: "nav-btn next", type: "button", "aria-label": "Next" }, h("span", { "aria-hidden": "true" }, "›"));

    const step = () => {
      const slide = track.querySelector(".slide");
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return slide.getBoundingClientRect().width + gap;
    };
    const behavior = reducedMotion ? "auto" : "smooth";
    const goTo = (i) => track.scrollTo({ left: i * step(), behavior });
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior }));

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = track.scrollWidth - track.clientWidth;
      const atEnd = track.scrollLeft >= max - 4;
      const idx = atEnd ? items.length - 1 : Math.round(track.scrollLeft / step());
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = atEnd;
      [...dots.children].forEach((d, i) => d.setAttribute("aria-selected", i === idx ? "true" : "false"));
    };
    track.addEventListener("scroll", () => (raf ||= requestAnimationFrame(update)), { passive: true });
    window.addEventListener("resize", () => (raf ||= requestAnimationFrame(update)));
    requestAnimationFrame(update);

    return h(
      "div",
      { class: "carousel" },
      track,
      h("div", { class: "wrap carousel-controls" }, dots, h("div", { class: "arrows" }, prev, next))
    );
  }

  // ---------- Sections ----------

  function renderNav() {
    const links = data.stages.map((s, i) =>
      h("a", { href: `#${s.id}`, class: `nav-stage s${i + 1}`, "data-stage": s.id }, h("span", { class: "num" }, pad(i + 1)), h("span", { class: "label" }, s.name))
    );
    document.getElementById("stage-nav").append(...links);
  }

  function renderPipeline() {
    const ol = document.getElementById("pipeline");
    data.stages.forEach((s, i) => {
      ol.append(
        h(
          "li",
          { class: `node s${i + 1}` },
          h("a", { href: `#${s.id}` }, h("span", { class: "node-num" }, pad(i + 1)), h("span", { class: "node-name" }, s.name), h("span", { class: "node-tools" }, s.tools.join(" · ")))
        ),
        h("li", { class: `link s${i + 1}`, "aria-hidden": "true" })
      );
    });
    ol.append(h("li", { class: "node out" }, h("div", {}, h("span", { class: "node-num" }, "→"), h("span", { class: "node-name" }, data.output.name), h("span", { class: "node-tools" }, data.output.tools))));
  }

  function renderImpact() {
    document.getElementById("impact").append(
      ...data.impact.map((m) => h("li", {}, h("strong", {}, m.value), h("span", { class: "impact-label" }, m.label), h("span", { class: "impact-tool" }, m.tool)))
    );
  }

  function featuredBlock(p) {
    const hero = p.compare
      ? h(
          "div",
          { class: "compare" },
          h("div", { class: "compare-item" }, h("span", { class: "compare-tag before" }, "Before"), media(p.compare.before.media, p.compare.before.label)),
          h("div", { class: "compare-item" }, h("span", { class: "compare-tag after" }, "After"), media(p.compare.after.media, p.compare.after.label))
        )
      : media(p.media, `${p.name}: overview`);

    return h(
      "article",
      { class: "featured" },
      h(
        "div",
        { class: "wrap featured-head" },
        h("div", {}, h("span", { class: "eyebrow" }, "Featured tool"), h("h3", {}, p.name), chips(p.stack)),
        h("div", {}, h("p", { class: "lead" }, p.lead), p.impact && h("p", { class: "impact-pill" }, p.impact))
      ),
      h("div", { class: "wrap featured-media" }, hero),
      p.features && carousel(p.features, p.name)
    );
  }

  function supportBlock(p) {
    return h(
      "article",
      { class: "support" },
      h(
        "div",
        { class: "wrap support-grid" },
        media(p.media, `${p.name}: overview`),
        h(
          "div",
          { class: "support-text" },
          chips(p.stack),
          h("h4", {}, p.name),
          h("p", {}, p.text),
          p.impact && h("p", { class: "impact-pill" }, p.impact),
          p.bullets && h("ul", { class: "bullets" }, p.bullets.map((b) => h("li", {}, b)))
        )
      ),
      p.features && carousel(p.features, p.name)
    );
  }

  function renderStages() {
    const root = document.getElementById("stages");
    data.stages.forEach((s, i) => {
      root.append(
        h(
          "section",
          { class: `stage s${i + 1}`, id: s.id, "aria-labelledby": `${s.id}-title` },
          h(
            "header",
            { class: "wrap stage-head" },
            h("span", { class: "stage-num", "aria-hidden": "true" }, pad(i + 1)),
            h("div", {}, h("p", { class: "eyebrow" }, `Stage ${pad(i + 1)} of ${pad(data.stages.length)}`), h("h2", { id: `${s.id}-title` }, s.name), h("p", { class: "stage-tagline" }, s.tagline))
          ),
          featuredBlock(s.featured),
          s.support?.length && h("div", { class: "wrap support-label" }, h("span", {}, `Also in ${s.name}`)),
          (s.support || []).map(supportBlock)
        )
      );
    });
  }

  function renderAbout() {
    const p = data.person;
    document.getElementById("about-text").textContent = data.about;
    document.getElementById("contact").append(
      h("a", { class: "btn primary", href: `mailto:${p.email}` }, p.email),
      h("a", { class: "btn", href: p.linkedin, target: "_blank", rel: "noopener" }, "LinkedIn"),
      h("a", { class: "btn", href: p.cv, target: "_blank", rel: "noopener" }, "Download CV")
    );
    document.getElementById("footer-name").textContent = `${p.name} · ${p.role} · ${p.location}`;
  }

  function renderHero() {
    document.getElementById("hero-kicker").textContent = data.hero.kicker;
    document.getElementById("hero-title").textContent = data.hero.title;
    document.getElementById("hero-text").textContent = data.hero.text;
    document.getElementById("brand").textContent = data.person.name;
  }

  // ---------- Scroll reveal (apple.com style: fade in + slight rise) ----------

  function initReveal() {
    if (reducedMotion || !("IntersectionObserver" in window)) return;

    // Each group is revealed as a sequence: its children enter one after another.
    const STAGGER = 90; // ms
    const groups = [
      ".hero .wrap:first-child > *",
      "#pipeline > li",
      ".stage-head > *",
      ".featured-head > *",
      ".support-text > *",
      ".about-inner > *",
    ];
    // #impact enters as one block: its gap lines are the list background, which would show while items are hidden.
    const singles = ["#impact", ".featured-media", ".carousel", ".support-label", ".support-grid > .media"];

    const targets = [];
    groups.forEach((sel) => {
      const byParent = new Map();
      document.querySelectorAll(sel).forEach((el) => {
        const i = byParent.get(el.parentElement) || 0;
        byParent.set(el.parentElement, i + 1);
        el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * STAGGER}ms`);
        targets.push(el);
      });
    });
    singles.forEach((sel) => document.querySelectorAll(sel).forEach((el) => targets.push(el)));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    targets.forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  // ---------- Scroll spy for the stage nav ----------

  function initScrollSpy() {
    const links = new Map([...document.querySelectorAll(".nav-stage")].map((a) => [a.dataset.stage, a]));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          links.forEach((a, id) => a.classList.toggle("active", id === e.target.id));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document.querySelectorAll(".stage").forEach((s) => io.observe(s));
    const clear = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && links.forEach((a) => a.classList.remove("active")),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ["top", "about"].forEach((id) => document.getElementById(id) && clear.observe(document.getElementById(id)));
  }

  renderHero();
  renderNav();
  renderPipeline();
  renderImpact();
  renderStages();
  renderAbout();
  initMedia();
  initReveal();
  initScrollSpy();
  document.getElementById("year").textContent = new Date().getFullYear();
})();
