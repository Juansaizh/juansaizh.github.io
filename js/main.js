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

  // ratio: proporción de la captura ("ancho / alto"). El marco la adopta en lugar de recortarla.
  function media(path, label, { eager = false, ratio = null } = {}) {
    const isVideo = /\.(mp4|webm)$/i.test(path);
    return h(
      "figure",
      {
        class: ratio ? "media has-ratio" : "media",
        style: ratio ? `--ar: ${ratio}` : null,
        "data-src": path,
        "data-type": isVideo ? "video" : "image",
        "data-eager": eager || null,
      },
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

  // Sin `ratio` en data.js, el marco toma la proporción real al cargar. No se hace dentro
  // del carrusel: un cambio de ancho tardío haría saltar el scroll.
  function adoptRatio(fig, w, h) {
    if (!w || !h || fig.classList.contains("has-ratio") || fig.closest(".slide")) return;
    fig.style.setProperty("--ar", `${w} / ${h}`);
    fig.classList.add("has-ratio");
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
        adoptRatio(fig, v.videoWidth, v.videoHeight);
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
      img.onload = () => {
        adoptRatio(fig, img.naturalWidth, img.naturalHeight);
        fig.classList.add("is-ready");
      };
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

  function carousel(items, title, heading = null) {
    const track = h(
      "div",
      { class: "track", tabindex: "0", role: "group", "aria-label": `${title}: features` },
      items.map((it, i) =>
        h(
          "article",
          { class: "slide", "aria-label": `${i + 1} of ${items.length}`, style: it.ratio ? `--ar: ${it.ratio}` : null },
          media(it.media, it.title, { ratio: it.ratio }),
          // Título en negrita como arranque del propio texto (estilo apple.com).
          h("p", { class: "slide-text" }, h("strong", {}, /[.!?:]$/.test(it.title) ? it.title : `${it.title}.`), " ", it.text)
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

    // Los slides tienen anchos distintos (cada uno el de su captura): se navega por posición real.
    const slides = [...track.children];
    const posOf = (slide) =>
      track.scrollLeft +
      slide.getBoundingClientRect().left -
      track.getBoundingClientRect().left -
      (parseFloat(getComputedStyle(track).paddingLeft) || 0);
    const current = () => {
      let best = 0;
      let dist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(posOf(s) - track.scrollLeft);
        if (d < dist) [best, dist] = [i, d];
      });
      return best;
    };
    const behavior = reducedMotion ? "auto" : "smooth";
    const goTo = (i) => track.scrollTo({ left: posOf(slides[Math.max(0, Math.min(slides.length - 1, i))]), behavior });
    prev.addEventListener("click", () => goTo(current() - 1));
    next.addEventListener("click", () => goTo(current() + 1));

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = track.scrollWidth - track.clientWidth;
      const atEnd = track.scrollLeft >= max - 4;
      const idx = atEnd ? items.length - 1 : current();
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = atEnd;
      [...dots.children].forEach((d, i) => d.setAttribute("aria-selected", i === idx ? "true" : "false"));
    };
    track.addEventListener("scroll", () => (raf ||= requestAnimationFrame(update)), { passive: true });
    window.addEventListener("resize", () => (raf ||= requestAnimationFrame(update)));
    requestAnimationFrame(update);

    // Título propio del carrusel, un nivel por debajo del nombre de la herramienta (como apple.com).
    return h(
      "div",
      { class: "carousel" },
      heading && h("h4", { class: "wrap carousel-head" }, heading),
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
        h("li", { class: "link", style: `--i: ${i}`, "aria-hidden": "true" }, h("span", { class: "wire" }), h("span", { class: "head" }))
      );
    });
    ol.append(h("li", { class: "node out" }, h("div", {}, h("span", { class: "node-num" }, "→"), h("span", { class: "node-name" }, data.output.name), h("span", { class: "node-tools" }, data.output.tools))));
  }

  function renderImpact() {
    document.getElementById("impact").append(
      ...data.impact.map((m) => h("li", {}, h("strong", {}, m.value), h("span", { class: "impact-label" }, m.label), h("span", { class: "impact-tool" }, m.tool)))
    );
  }

  // Media principal de una herramienta: antes/después si lo tiene, si no su captura.
  function heroMedia(p) {
    // Antes/después: cada columna tan ancha como la proporción de su captura, así las dos
    // tienen la misma altura sin recortar ninguna.
    const ratioNum = (r) => {
      const [w, hgt] = String(r).split("/").map(Number);
      return w / (hgt || 1);
    };
    const beforeRatio = p.compare && (p.compare.before.ratio || p.compare.after.ratio);
    const afterRatio = p.compare && (p.compare.after.ratio || p.compare.before.ratio);
    return p.compare
      ? h(
          "div",
          {
            class: "compare",
            style: beforeRatio && afterRatio ? `--cols: ${ratioNum(beforeRatio).toFixed(4)}fr ${ratioNum(afterRatio).toFixed(4)}fr` : null,
          },
          h("div", { class: "compare-item" }, h("span", { class: "compare-tag before" }, "Before"), media(p.compare.before.media, p.compare.before.label, { ratio: beforeRatio })),
          h("div", { class: "compare-item" }, h("span", { class: "compare-tag after" }, "After"), media(p.compare.after.media, p.compare.after.label, { ratio: afterRatio }))
        )
      : media(p.media, `${p.name}: overview`, { ratio: p.ratio });
  }

  function featuredBlock(p) {
    return h(
      "article",
      { class: "featured" },
      h(
        "div",
        { class: "wrap featured-head" },
        h("div", {}, h("span", { class: "eyebrow" }, "Featured tool"), h("h3", {}, p.name), chips(p.stack)),
        h("div", {}, h("p", { class: "lead" }, p.lead), p.impact && h("p", { class: "impact-pill" }, p.impact))
      ),
      h("div", { class: "wrap featured-media" }, heroMedia(p)),
      p.features && carousel(p.features, p.name, p.featuresTitle || "Feature by feature.")
    );
  }

  function supportBlock(p) {
    const text = h(
      "div",
      { class: "support-text" },
      chips(p.stack),
      h("h4", {}, p.name),
      h("p", {}, p.text),
      p.impact && h("p", { class: "impact-pill" }, p.impact),
      p.bullets && h("ul", { class: "bullets" }, p.bullets.map((b) => h("li", {}, b)))
    );
    // Con antes/después el texto va arriba y la comparación ocupa todo el ancho debajo.
    return h(
      "article",
      { class: p.compare ? "support has-compare" : "support" },
      h("div", { class: "wrap support-grid" }, p.compare ? [text, heroMedia(p)] : [heroMedia(p), text]),
      p.features && carousel(p.features, p.name, p.featuresTitle || "Feature by feature.")
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
            h("div", {}, h("h2", { id: `${s.id}-title` }, s.name), h("p", { class: "stage-tagline" }, s.tagline))
          ),
          featuredBlock(s.featured),
          s.support?.length && h("h3", { class: "wrap support-head" }, `More in ${s.name}.`),
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
    const singles = ["#impact", ".featured-media", ".carousel-head", ".track", ".carousel-controls", ".support-head", ".support-grid > .media", ".support-grid > .compare"];

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

  // ---------- Pipeline: las flechas se encienden en secuencia al entrar en pantalla ----------

  function initPipelineLights() {
    const ol = document.getElementById("pipeline");
    if (reducedMotion || !("IntersectionObserver" in window)) return ol.classList.add("is-on");
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        ol.classList.add("is-on");
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(ol);
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
  initPipelineLights();
  initScrollSpy();
  document.getElementById("year").textContent = new Date().getFullYear();
})();
