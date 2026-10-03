(() => {
  "use strict";

  const FORMATS = {
    square: {
      id: "square",
      platform: "facebook",
      index: "01",
      label: "Feed cuadrado",
      short: "1:1",
      width: 1080,
      height: 1080,
      ratio: "1:1",
      hint: "Tamaño recomendado para fotos en el feed. Máxima compatibilidad.",
    },
    portrait: {
      id: "portrait",
      platform: "facebook",
      index: "02",
      label: "Feed vertical",
      short: "4:5",
      width: 1080,
      height: 1350,
      ratio: "4:5",
      hint: "Ocupa más pantalla en el móvil. El formato más visible del feed.",
    },
    landscape: {
      id: "landscape",
      platform: "facebook",
      index: "03",
      label: "Feed paisaje",
      short: "1.91:1",
      width: 1200,
      height: 630,
      ratio: "1.91:1",
      hint: "Enlace y portada de enlace. El recorte horizontal clásico de Facebook.",
    },
    stories: {
      id: "stories",
      platform: "instagram",
      index: "04",
      label: "Stories",
      short: "9:16",
      width: 1080,
      height: 1920,
      ratio: "9:16",
      hint: "Pantalla completa en Instagram y Facebook Stories. 1080 × 1920.",
    },
    pin: {
      id: "pin",
      platform: "pinterest",
      index: "05",
      label: "Pin vertical",
      short: "2:3",
      width: 1080,
      height: 1620,
      ratio: "2:3",
      hint: "Pin estándar de Pinterest. Máxima visibilidad en el feed.",
    },
  };

  const FORMAT_LIST = [FORMATS.square, FORMATS.portrait, FORMATS.landscape, FORMATS.stories, FORMATS.pin];
  const FORMAT_GROUPS = [
    { label: "Facebook", items: FORMAT_LIST.filter((item) => item.platform === "facebook") },
    { label: "Instagram", items: FORMAT_LIST.filter((item) => item.platform === "instagram") },
    { label: "Pinterest", items: FORMAT_LIST.filter((item) => item.platform === "pinterest") },
  ];
  const TEMPLATES = [
    { id: "editorial", label: "Editorial", index: "A" },
    { id: "quote", label: "Cita", index: "B" },
    { id: "launch", label: "Lanzamiento", index: "C" },
  ];
  const FONT_STACK = {
    display: "Syne, 'IBM Plex Sans', sans-serif",
    body: "'IBM Plex Sans', sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  };
  const FONT_LABEL = { display: "Syne", body: "Plex", mono: "Mono" };
  const TEXT_SWATCHES = [
    { id: "warm", label: "Cálido", value: "#F4F1EA" },
    { id: "ink", label: "Tinta", value: "#090D16" },
    { id: "amber", label: "Ámbar", value: "#F5A623" },
    { id: "cyan", label: "Cian", value: "#00B8A9" },
  ];
  const WEIGHTS = [400, 500, 600, 700, 800];
  const FAMILIES = ["display", "body", "mono"];
  const ALIGNS = [
    { id: "left", label: "Izquierda" },
    { id: "center", label: "Centro" },
    { id: "right", label: "Derecha" },
  ];
  const SAFE_MARGIN = 6;
  const PERSIST_KEY = "fabrica-posts-v1";
  const ICONS = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 15 5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="9" r="1.2" fill="currentColor"/></svg>',
    rotate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>',
    alignLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h10M4 18h14"/></svg>',
    alignCenter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M7 12h10M5 18h14"/></svg>',
    alignRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M10 12h10M6 18h14"/></svg>',
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function uid() {
    return crypto.randomUUID();
  }

  function snapX(align, width) {
    if (align === "center") return (100 - width) / 2;
    if (align === "right") return 100 - width - SAFE_MARGIN;
    return SAFE_MARGIN;
  }

  function defaultLayers(template) {
    if (template === "quote") {
      return [
        layer({
          id: "kicker",
          text: "NOTA DE TALLER",
          x: snapX("center", 80),
          y: 28,
          width: 80,
          align: "center",
          fontSize: 2.1,
          fontFamily: "mono",
          fontWeight: 500,
          color: "#00B8A9",
          letterSpacing: 0.22,
          shadow: false,
          uppercase: true,
        }),
        layer({
          id: "headline",
          text: "“Lo que no se publica\nno existe.”",
          x: snapX("center", 82),
          y: 36,
          width: 82,
          align: "center",
          fontSize: 6.8,
          fontFamily: "display",
          fontWeight: 700,
          color: "#F4F1EA",
          letterSpacing: -0.03,
          lineHeight: 1.08,
        }),
        layer({
          id: "credit",
          text: "Fábrica de Posts Infinitos",
          x: snapX("center", 80),
          y: 78,
          width: 80,
          align: "center",
          fontSize: 2.4,
          fontFamily: "body",
          fontWeight: 500,
          color: "#F5A623",
          letterSpacing: 0.04,
          shadow: false,
        }),
      ];
    }
    if (template === "launch") {
      return [
        layer({
          id: "kicker",
          text: "LANZAMIENTO  ·  00",
          y: 62,
          width: 86,
          fontSize: 2.2,
          fontFamily: "mono",
          fontWeight: 500,
          color: "#F5A623",
          letterSpacing: 0.18,
          uppercase: true,
        }),
        layer({
          id: "headline",
          text: "Ahora en el feed.",
          y: 68,
          width: 86,
          fontSize: 7.4,
          fontFamily: "display",
          fontWeight: 700,
          letterSpacing: -0.035,
          lineHeight: 1.02,
        }),
        layer({
          id: "sub",
          text: "Imagen nativa 1080 · texto editable · PNG listo",
          y: 86,
          width: 86,
          fontSize: 2.5,
          fontFamily: "body",
          fontWeight: 400,
          letterSpacing: 0.01,
        }),
      ];
    }
    return [
      layer({
        id: "kicker",
        text: "EDICIÓN 01  ·  FEED",
        y: 52,
        width: 84,
        fontSize: 2.15,
        fontFamily: "mono",
        fontWeight: 500,
        color: "#00B8A9",
        letterSpacing: 0.2,
        uppercase: true,
      }),
      layer({
        id: "headline",
        text: "El futuro no se espera.\nSe publica.",
        y: 58,
        width: 84,
        fontSize: 7,
        fontFamily: "display",
        fontWeight: 700,
        letterSpacing: -0.035,
        lineHeight: 1.05,
      }),
    ];
  }

  function layer(partial) {
    return {
      id: uid(),
      text: "Nuevo bloque",
      x: SAFE_MARGIN,
      y: 40,
      width: 78,
      align: "left",
      fontSize: 6.2,
      fontFamily: "display",
      fontWeight: 700,
      color: "#F4F1EA",
      letterSpacing: -0.02,
      lineHeight: 1.12,
      shadow: true,
      background: false,
      uppercase: false,
      ...partial,
    };
  }

  function blankLayer() {
    return layer({
      id: uid(),
      text: "Nuevo bloque",
      x: snapX("left", 78),
      y: 40,
      width: 78,
    });
  }

  const persistKeys = [
    "formatId",
    "templateId",
    "overlay",
    "gradient",
    "guides",
    "layers",
    "selectedId",
    "caption",
    "brief",
  ];

  function loadState() {
    const base = {
      formatId: "square",
      templateId: "editorial",
      image: null,
      overlay: 0.22,
      gradient: true,
      guides: true,
      layers: defaultLayers("editorial"),
      selectedId: "headline",
      caption: "",
      brief: "",
    };
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      for (const key of persistKeys) {
        if (saved[key] !== undefined) base[key] = saved[key];
      }
      if (!Array.isArray(base.layers) || base.layers.length === 0) {
        base.layers = defaultLayers(base.templateId);
      }
    } catch {
      /* ignore */
    }
    return base;
  }

  const state = loadState();
  let busy = false;
  let inspectorLock = null;
  let drag = null;
  let imageDrag = null;

  function persist() {
    const slice = {};
    for (const key of persistKeys) slice[key] = state[key];
    localStorage.setItem(PERSIST_KEY, JSON.stringify(slice));
  }

  function selected() {
    return state.layers.find((item) => item.id === state.selectedId) ?? null;
  }

  function format() {
    return FORMATS[state.formatId] ?? FORMATS.square;
  }

  function toast(message) {
    const host = document.getElementById("toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  function patchLayer(id, patch) {
    state.layers = state.layers.map((item) => {
      if (item.id !== id) return item;
      const next = { ...item, ...patch };
      next.x = clamp(next.x, 0, 100 - next.width);
      next.y = clamp(next.y, 0, 92);
      next.width = clamp(next.width, 28, 100);
      next.fontSize = clamp(next.fontSize, 1.6, 16);
      return next;
    });
    persist();
  }

  function snapAlign(id, align) {
    const item = state.layers.find((layerItem) => layerItem.id === id);
    if (!item) return;
    patchLayer(id, { align, x: snapX(align, item.width) });
  }

  function setImage(image) {
    if (state.image?.src?.startsWith("blob:")) URL.revokeObjectURL(state.image.src);
    state.image = image;
  }

  function patchImage(patch) {
    if (!state.image) return;
    state.image = {
      ...state.image,
      zoom: clamp(patch.zoom ?? state.image.zoom, 1, 2.4),
      offsetX: clamp(patch.offsetX ?? state.image.offsetX, -40, 40),
      offsetY: clamp(patch.offsetY ?? state.image.offsetY, -40, 40),
    };
  }

  async function readImageFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("Usa un archivo de imagen (JPG, PNG, WebP).");
    }
    const src = URL.createObjectURL(file);
    const size = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => reject(new Error("No se pudo leer la imagen."));
      img.src = src;
    });
    return {
      src,
      naturalWidth: size.w,
      naturalHeight: size.h,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    };
  }

  function coverRect(imgW, imgH, canvasW, canvasH, zoom, offsetX, offsetY) {
    const imgAspect = imgW / imgH;
    const canvasAspect = canvasW / canvasH;
    let w;
    let h;
    if (imgAspect > canvasAspect) {
      h = canvasH * zoom;
      w = h * imgAspect;
    } else {
      w = canvasW * zoom;
      h = w / imgAspect;
    }
    const cx = canvasW / 2 + (offsetX / 100) * canvasW;
    const cy = canvasH / 2 + (offsetY / 100) * canvasH;
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }

  function wrapLines(measure, text, maxWidth) {
    const paragraphs = text.replace(/\r/g, "").split("\n");
    const lines = [];
    for (const paragraph of paragraphs) {
      if (paragraph.length === 0) {
        lines.push("");
        continue;
      }
      const words = paragraph.split(/\s+/);
      let current = "";
      for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (current && measure(test) > maxWidth) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      }
      if (current) lines.push(current);
    }
    return lines;
  }

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function drawBackdrop(ctx, spec) {
    const { width: w, height: h } = spec;
    ctx.fillStyle = "#090D16";
    ctx.fillRect(0, 0, w, h);
    const wash = ctx.createLinearGradient(0, 0, w, h);
    wash.addColorStop(0, "#101827");
    wash.addColorStop(0.55, "#090D16");
    wash.addColorStop(1, "#0b1524");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.strokeStyle = "rgba(244, 241, 234, 0.045)";
    ctx.lineWidth = 1;
    const step = Math.round(w / 18);
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(0, 184, 169, 0.22)";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, w - 48, h - 48);
    ctx.fillStyle = "#F5A623";
    ctx.fillRect(24, 24, 72, 3);
  }

  function drawLayer(ctx, spec, item) {
    const boxX = (item.x / 100) * spec.width;
    const boxY = (item.y / 100) * spec.height;
    const boxW = (item.width / 100) * spec.width;
    const fontPx = (item.fontSize / 100) * spec.height;
    const raw = item.uppercase ? item.text.toUpperCase() : item.text;
    ctx.textBaseline = "top";
    ctx.font = `${item.fontWeight} ${fontPx}px ${FONT_STACK[item.fontFamily]}`;
    ctx.letterSpacing = `${item.letterSpacing * fontPx}px`;
    const lines = wrapLines((text) => ctx.measureText(text).width, raw, boxW);
    const lineHeight = fontPx * item.lineHeight;
    const blockH = Math.max(lineHeight, lines.length * lineHeight);
    if (item.background) {
      const padX = fontPx * 0.35;
      const padY = fontPx * 0.22;
      ctx.fillStyle = "rgba(9, 13, 22, 0.72)";
      roundRect(ctx, boxX - padX, boxY - padY, boxW + padX * 2, blockH + padY * 2, Math.min(14, fontPx * 0.18));
      ctx.fill();
    }
    ctx.fillStyle = item.color;
    if (item.shadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = fontPx * 0.38;
      ctx.shadowOffsetY = fontPx * 0.06;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    }
    lines.forEach((line, index) => {
      const width = ctx.measureText(line).width;
      let x = boxX;
      if (item.align === "center") x = boxX + (boxW - width) / 2;
      if (item.align === "right") x = boxX + boxW - width;
      ctx.fillText(line, x, boxY + index * lineHeight);
    });
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.letterSpacing = "0px";
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("No se pudo leer la imagen"));
      image.src = src;
    });
  }

  async function renderPostPng() {
    await document.fonts.ready;
    const spec = format();
    const canvas = document.createElement("canvas");
    canvas.width = spec.width;
    canvas.height = spec.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas no disponible");
    ctx.fillStyle = "#090D16";
    ctx.fillRect(0, 0, spec.width, spec.height);
    if (state.image) {
      const img = await loadImage(state.image.src);
      const rect = coverRect(
        img.naturalWidth,
        img.naturalHeight,
        spec.width,
        spec.height,
        state.image.zoom,
        state.image.offsetX,
        state.image.offsetY,
      );
      ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h);
    } else {
      drawBackdrop(ctx, spec);
    }
    if (state.overlay > 0) {
      ctx.fillStyle = `rgba(9, 13, 22, ${state.overlay})`;
      ctx.fillRect(0, 0, spec.width, spec.height);
    }
    if (state.gradient) {
      const g = ctx.createLinearGradient(0, spec.height * 0.38, 0, spec.height);
      g.addColorStop(0, "rgba(9, 13, 22, 0)");
      g.addColorStop(1, "rgba(9, 13, 22, 0.78)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, spec.width, spec.height);
    }
    for (const item of state.layers) drawLayer(ctx, spec, item);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("No se pudo exportar el PNG");
    return blob;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function composeCaption() {
    const overlay = state.layers
      .map((item) => item.text.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ");
    const headline =
      overlay.split(/[.!?\n]/)[0]?.trim().slice(0, 90) || "Una pieza nueva en el feed.";
    const brief = state.brief.trim();
    const closers = [
      "Diseñado al milímetro para Facebook: 1080 nativo, sin recortes.",
      "Publica a tamaño real. El feed no perdona un recorte torpe.",
      "Una imagen nítida, un texto que se lee, un post que se queda.",
    ];
    const closer = closers[headline.length % closers.length];
    if (brief) {
      return `${headline} ${brief.endsWith(".") ? brief : `${brief}.`} ${closer}`.slice(0, 500);
    }
    return `${headline} ${closer}`.slice(0, 500);
  }

  function rangeStyle(el, min, max, value) {
    const pct = ((Number(value) - min) / (max - min)) * 100;
    el.style.setProperty("--p", `${clamp(pct, 0, 100)}%`);
  }

  function renderTopbar() {
    const spec = format();
    document.getElementById("formatChip").textContent = `${spec.width} × ${spec.height}`;
    document.getElementById("exportLabel").textContent = busy ? "Exportando…" : "Descargar PNG";
    document.getElementById("exportBtn").disabled = busy;
    document.getElementById("copyPngBtn").disabled = busy;
  }

  function renderSidebar() {
    const image = state.image;
    document.getElementById("sidebar").innerHTML = `
      <div class="panel">
        <section class="section">
          <div class="section-title"><span class="idx">01</span><h2>Formato</h2></div>
          ${FORMAT_GROUPS.map(
            (group) => `
            <p class="platform-label">${group.label}</p>
            ${group.items
              .map(
                (item) => `
            <button type="button" class="format-btn ${item.id === state.formatId ? "is-active" : ""}" data-format="${item.id}">
              <div class="format-top">
                <strong>${item.label}</strong>
                <span class="badge">${item.short}</span>
              </div>
              <p class="size">${item.width} × ${item.height}</p>
              <p class="desc">${item.hint}</p>
            </button>
          `,
              )
              .join("")}
          `,
          ).join("")}
        </section>
        <hr class="divider" />
        <section class="section">
          <div class="section-title"><span class="idx">02</span><h2>Imagen</h2></div>
          <button type="button" class="dropzone" id="dropzone">
            ${ICONS.image}
            <b>Suelta la foto o elige archivo</b>
            <span class="muted" style="letter-spacing:.14em;text-transform:uppercase">JPG · PNG · WebP</span>
          </button>
          ${
            image
              ? `
            <div class="image-tools">
              <div class="image-tools-head">
                <p class="muted">${image.naturalWidth} × ${image.naturalHeight}</p>
                <button type="button" class="btn btn-ghost btn-sm" data-action="clear-image">${ICONS.trash} Quitar</button>
              </div>
              <div class="field">
                <label>Zoom</label>
                <input class="range" data-img="zoom" type="range" min="1" max="2.4" step="0.01" value="${image.zoom}" />
              </div>
              <div class="field">
                <label>Desplazar imagen X</label>
                <input class="range" data-img="offsetX" type="range" min="-40" max="40" step="0.5" value="${image.offsetX}" />
              </div>
              <div class="field">
                <label>Desplazar imagen Y</label>
                <input class="range" data-img="offsetY" type="range" min="-40" max="40" step="0.5" value="${image.offsetY}" />
              </div>
              <button type="button" class="btn btn-outline btn-sm btn-block" data-action="recenter">${ICONS.rotate} Recentrar</button>
            </div>
          `
              : ""
          }
        </section>
        <hr class="divider" />
        <section class="section">
          <div class="section-title"><span class="idx">03</span><h2>Lectura</h2></div>
          <div class="field">
            <label>Oscurecer</label>
            <input class="range" data-overlay type="range" min="0" max="0.7" step="0.01" value="${state.overlay}" />
          </div>
          <div class="switch-row">
            <span>Degradado inferior</span>
            <button type="button" class="switch" data-toggle="gradient" role="switch" aria-checked="${state.gradient}"></button>
          </div>
          <div class="switch-row">
            <span>Guía de seguridad 6%</span>
            <button type="button" class="switch" data-toggle="guides" role="switch" aria-checked="${state.guides}"></button>
          </div>
        </section>
        <hr class="divider" />
        <section class="section">
          <div class="section-title"><span class="idx">04</span><h2>Plantilla</h2></div>
          <div class="templates">
            ${TEMPLATES.map(
              (item) => `
              <button type="button" class="template-btn ${item.id === state.templateId ? "is-active" : ""}" data-template="${item.id}">
                <span class="idx">${item.index}</span>
                <span>${item.label}</span>
              </button>
            `,
            ).join("")}
          </div>
        </section>
        <hr class="divider" />
        <section class="section">
          <div class="section-title"><span class="idx">05</span><h2>Capas</h2></div>
          <ul class="layer-list">
            ${state.layers
              .map(
                (item, index) => `
              <li>
                <button type="button" class="layer-btn ${item.id === state.selectedId ? "is-active" : ""}" data-select="${item.id}">
                  <span class="idx">${String(index + 1).padStart(2, "0")}</span>
                  <em>${escapeHtml(item.text.split("\n")[0] || "Sin texto")}</em>
                </button>
              </li>
            `,
              )
              .join("")}
          </ul>
        </section>
      </div>
    `;
    document.querySelectorAll("#sidebar .range").forEach((input) => {
      rangeStyle(input, Number(input.min), Number(input.max), input.value);
    });
  }

  function renderInspector() {
    if (inspectorLock) return;
    const item = selected();
    document.getElementById("inspector").innerHTML = `
      <div class="panel">
        <section class="section">
          <div class="section-head">
            <div class="section-title"><span class="idx">06</span><h2>Bloque de texto</h2></div>
            <button type="button" class="btn btn-outline btn-icon" data-action="add-layer" aria-label="Añadir texto">${ICONS.plus}</button>
          </div>
          ${
            item
              ? `
            <div class="field">
              <label>Contenido</label>
              <textarea data-layer="text" rows="4">${escapeHtml(item.text)}</textarea>
            </div>
            <div class="field">
              <label>Alinear bloque</label>
              <div class="grid-3">
                ${ALIGNS.map((align, i) => {
                  const icon = [ICONS.alignLeft, ICONS.alignCenter, ICONS.alignRight][i];
                  const active = item.align === align.id;
                  return `<button type="button" class="btn ${active ? "btn-cyan" : "btn-outline"} btn-sm" data-align="${align.id}" aria-label="${align.label}">${icon}<span class="hide-sm">${align.label}</span></button>`;
                }).join("")}
              </div>
            </div>
            <div class="field">
              <label>Desplazamiento · ${Math.round(item.x)}</label>
              <input class="range" data-layer="x" type="range" min="0" max="${100 - item.width}" step="0.5" value="${item.x}" />
            </div>
            <div class="field">
              <label>Altura · ${Math.round(item.y)}</label>
              <input class="range" data-layer="y" type="range" min="0" max="90" step="0.5" value="${item.y}" />
            </div>
            <div class="field">
              <label>Ancho del bloque · ${Math.round(item.width)}</label>
              <input class="range" data-layer="width" type="range" min="28" max="100" step="1" value="${item.width}" />
            </div>
            <div class="field">
              <label>Tipografía</label>
              <div class="grid-3">
                ${FAMILIES.map(
                  (family) =>
                    `<button type="button" class="btn ${item.fontFamily === family ? "btn-secondary" : "btn-outline"} btn-sm" data-font="${family}">${FONT_LABEL[family]}</button>`,
                ).join("")}
              </div>
            </div>
            <div class="field">
              <label>Tamaño · ${item.fontSize.toFixed(1)}</label>
              <input class="range" data-layer="fontSize" type="range" min="1.6" max="16" step="0.1" value="${item.fontSize}" />
            </div>
            <div class="field">
              <label>Peso</label>
              <div class="grid-5">
                ${WEIGHTS.map(
                  (weight) =>
                    `<button type="button" class="btn ${item.fontWeight === weight ? "btn-secondary" : "btn-outline"} btn-sm btn-pad0" data-weight="${weight}">${weight}</button>`,
                ).join("")}
              </div>
            </div>
            <div class="field">
              <label>Color</label>
              <div class="swatches">
                ${TEXT_SWATCHES.map(
                  (swatch) =>
                    `<button type="button" class="swatch ${item.color === swatch.value ? "is-active" : ""}" data-color="${swatch.value}" aria-label="${swatch.label}" style="background:${swatch.value}"></button>`,
                ).join("")}
              </div>
            </div>
            <div class="switch-row">
              <span>Sombra de lectura</span>
              <button type="button" class="switch" data-flag="shadow" role="switch" aria-checked="${item.shadow}"></button>
            </div>
            <div class="switch-row">
              <span>Fondo del bloque</span>
              <button type="button" class="switch" data-flag="background" role="switch" aria-checked="${item.background}"></button>
            </div>
            <div class="switch-row">
              <span>Mayúsculas</span>
              <button type="button" class="switch" data-flag="uppercase" role="switch" aria-checked="${item.uppercase}"></button>
            </div>
            <div class="grid-2">
              <button type="button" class="btn btn-outline btn-sm" data-action="duplicate">Duplicar</button>
              <button type="button" class="btn btn-outline btn-sm" data-action="remove">${ICONS.trash} Borrar</button>
            </div>
          `
              : `<p class="hint">Selecciona un bloque en el lienzo o añade uno nuevo. Arrástralo o usa el control de desplazamiento.</p>`
          }
        </section>
        <hr class="divider" />
        <section class="section">
          <div class="section-title"><span class="idx">07</span><h2>Pie de publicación</h2></div>
          <div class="field">
            <label>Brief (opcional)</label>
            <textarea class="sm" data-caption="brief" rows="2" placeholder="Producto, tono, llamada a la acción…">${escapeHtml(state.brief)}</textarea>
          </div>
          <div class="field">
            <label>Texto del post</label>
            <textarea data-caption="caption" rows="5" placeholder="El pie de foto que acompaña a la imagen en Facebook.">${escapeHtml(state.caption)}</textarea>
          </div>
          <p class="muted">${state.caption.length} / 500</p>
          <div class="grid-2">
            <button type="button" class="btn btn-secondary" data-action="generate">${ICONS.pen} Generar</button>
            <button type="button" class="btn btn-outline" data-action="copy-caption">${ICONS.copy} Copiar</button>
          </div>
        </section>
      </div>
    `;
    document.querySelectorAll("#inspector .range").forEach((input) => {
      rangeStyle(input, Number(input.min), Number(input.max), input.value);
    });
  }

  function escapeHtml(value) {
    const amp = String.fromCharCode(38);
    return String(value)
      .replaceAll("&", amp + "amp;")
      .replaceAll("<", amp + "lt;")
      .replaceAll(">", amp + "gt;")
      .replaceAll('"', amp + "quot;");
  }

  function renderStage() {
    const spec = format();
    const stage = document.getElementById("stage");
    const ratio = spec.width / spec.height;
    stage.style.aspectRatio = `${spec.width} / ${spec.height}`;
    stage.style.width = `min(100%, calc(100cqh * ${ratio}))`;
    const fill = document.getElementById("stageFill");
    if (state.image) {
      const imgAspect = state.image.naturalWidth / state.image.naturalHeight;
      const coverByHeight = imgAspect > ratio;
      fill.innerHTML = `<img class="stage-img" alt="" draggable="false" src="${state.image.src}" style="height:${coverByHeight ? `${state.image.zoom * 100}%` : "auto"};width:${coverByHeight ? "auto" : `${state.image.zoom * 100}%`};left:${50 + state.image.offsetX}%;top:${50 + state.image.offsetY}%" />`;
    } else {
      fill.innerHTML = `
        <div class="backdrop">
          <div class="studio-wash"></div>
          <div class="grid-wash"></div>
          <div class="frame"></div>
          <div class="amber-bar"></div>
          <p class="drop-hint">Suelta una imagen · o pégala</p>
        </div>`;
    }
    document.getElementById("scrim").style.background = `rgba(9, 13, 22, ${state.overlay})`;
    document.getElementById("gradient").hidden = !state.gradient;
    const guides = document.getElementById("guides");
    guides.hidden = !state.guides;
    guides.style.left = `${SAFE_MARGIN}%`;
    guides.style.top = `${SAFE_MARGIN}%`;
    guides.style.width = `${100 - SAFE_MARGIN * 2}%`;
    guides.style.height = `${100 - SAFE_MARGIN * 2}%`;
    const cqwFactor = spec.height / spec.width;
    document.getElementById("layers").innerHTML = state.layers
      .map((item) => {
        const selectedClass = item.id === state.selectedId ? " is-selected" : "";
        return `<div class="layer${selectedClass}" data-layer-id="${item.id}" role="button" tabindex="0" aria-label="Bloque de texto" style="left:${item.x}%;top:${item.y}%;width:${item.width}%;text-align:${item.align};font-family:${FONT_STACK[item.fontFamily]};font-size:${item.fontSize * cqwFactor}cqw;font-weight:${item.fontWeight};color:${item.color};letter-spacing:${item.letterSpacing}em;line-height:${item.lineHeight};text-transform:${item.uppercase ? "uppercase" : "none"};text-shadow:${item.shadow ? "0 2px 22px rgba(0,0,0,0.55)" : "none"};background:${item.background ? "rgba(9,13,22,0.72)" : "transparent"};padding:${item.background ? "0.22em 0.38em" : "0"}">${escapeHtml(item.text)}</div>`;
      })
      .join("");
    const specMeta = format();
    document.getElementById("meta").innerHTML = `
      <span>FMT ${specMeta.index} · ${specMeta.label}</span>
      <span class="cyan">${specMeta.width} × ${specMeta.height} · ${specMeta.ratio}</span>
      <span>${state.image ? "PNG nativo · imagen cargada" : "PNG nativo · fondo de estudio"}</span>
    `;
  }

  function render() {
    renderTopbar();
    renderSidebar();
    renderInspector();
    renderStage();
  }

  async function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    try {
      setImage(await readImageFile(file));
      persist();
      render();
    } catch (error) {
      toast(error instanceof Error ? error.message : "No se pudo cargar.");
    }
  }

  async function makeBlob() {
    busy = true;
    renderTopbar();
    try {
      return await renderPostPng();
    } catch (error) {
      toast(error instanceof Error ? error.message : "No se pudo exportar.");
      return null;
    } finally {
      busy = false;
      renderTopbar();
    }
  }

  function bind() {
    document.getElementById("exportBtn").addEventListener("click", async () => {
      const blob = await makeBlob();
      if (!blob) return;
      const spec = format();
      downloadBlob(blob, `fabrica-${spec.id}-${spec.width}x${spec.height}.png`);
      toast("PNG exportado al tamaño de Facebook");
    });

    document.getElementById("copyPngBtn").addEventListener("click", async () => {
      const blob = await makeBlob();
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        toast("Imagen copiada");
      } catch {
        const spec = format();
        downloadBlob(blob, `fabrica-${spec.id}-${spec.width}x${spec.height}.png`);
        toast("PNG descargado");
      }
    });

    document.getElementById("fileInput").addEventListener("change", (event) => {
      void handleFiles(event.target.files);
      event.target.value = "";
    });

    document.getElementById("sidebar").addEventListener("click", (event) => {
      const formatBtn = event.target.closest("[data-format]");
      if (formatBtn) {
        state.formatId = formatBtn.dataset.format;
        persist();
        render();
        return;
      }
      const templateBtn = event.target.closest("[data-template]");
      if (templateBtn) {
        state.templateId = templateBtn.dataset.template;
        state.layers = defaultLayers(state.templateId);
        state.selectedId = state.layers[1]?.id ?? state.layers[0]?.id ?? null;
        persist();
        render();
        return;
      }
      const selectBtn = event.target.closest("[data-select]");
      if (selectBtn) {
        state.selectedId = selectBtn.dataset.select;
        persist();
        render();
        return;
      }
      if (event.target.closest("#dropzone")) {
        document.getElementById("fileInput").click();
        return;
      }
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "clear-image") {
        setImage(null);
        persist();
        render();
        return;
      }
      if (action === "recenter") {
        patchImage({ zoom: 1, offsetX: 0, offsetY: 0 });
        persist();
        render();
        return;
      }
      const toggle = event.target.closest("[data-toggle]");
      if (toggle) {
        state[toggle.dataset.toggle] = !state[toggle.dataset.toggle];
        persist();
        render();
      }
    });

    document.getElementById("sidebar").addEventListener("input", (event) => {
      const overlay = event.target.closest("[data-overlay]");
      if (overlay) {
        state.overlay = clamp(Number(overlay.value), 0, 0.7);
        rangeStyle(overlay, 0, 0.7, overlay.value);
        persist();
        renderStage();
        return;
      }
      const img = event.target.closest("[data-img]");
      if (img) {
        const key = img.dataset.img;
        patchImage({ [key]: Number(img.value) });
        rangeStyle(img, Number(img.min), Number(img.max), img.value);
        persist();
        renderStage();
      }
    });

    const sidebar = document.getElementById("sidebar");
    sidebar.addEventListener("dragover", (event) => {
      if (event.target.closest("#dropzone")) {
        event.preventDefault();
        event.target.closest("#dropzone").classList.add("is-over");
      }
    });
    sidebar.addEventListener("dragleave", (event) => {
      event.target.closest("#dropzone")?.classList.remove("is-over");
    });
    sidebar.addEventListener("drop", (event) => {
      const zone = event.target.closest("#dropzone");
      if (!zone) return;
      event.preventDefault();
      zone.classList.remove("is-over");
      void handleFiles(event.dataTransfer.files);
    });

    document.getElementById("inspector").addEventListener("click", (event) => {
      const item = selected();
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "add-layer") {
        const next = blankLayer();
        state.layers = [...state.layers, next];
        state.selectedId = next.id;
        persist();
        render();
        return;
      }
      if (!item) return;
      if (action === "duplicate") {
        const copy = { ...item, id: uid(), y: clamp(item.y + 8, 0, 90) };
        state.layers = [...state.layers, copy];
        state.selectedId = copy.id;
        persist();
        render();
        return;
      }
      if (action === "remove") {
        state.layers = state.layers.filter((layerItem) => layerItem.id !== item.id);
        state.selectedId = state.layers.at(-1)?.id ?? null;
        persist();
        render();
        return;
      }
      if (action === "generate") {
        state.caption = composeCaption();
        persist();
        renderInspector();
        toast("Pie de foto listo");
        return;
      }
      if (action === "copy-caption") {
        if (!state.caption.trim()) {
          toast("No hay pie de foto para copiar.");
          return;
        }
        void navigator.clipboard.writeText(state.caption).then(() => toast("Pie de foto copiado"));
        return;
      }
      const align = event.target.closest("[data-align]")?.dataset.align;
      if (align) {
        snapAlign(item.id, align);
        render();
        return;
      }
      const family = event.target.closest("[data-font]")?.dataset.font;
      if (family) {
        patchLayer(item.id, { fontFamily: family });
        render();
        return;
      }
      const weight = event.target.closest("[data-weight]")?.dataset.weight;
      if (weight) {
        patchLayer(item.id, { fontWeight: Number(weight) });
        render();
        return;
      }
      const color = event.target.closest("[data-color]")?.dataset.color;
      if (color) {
        patchLayer(item.id, { color });
        render();
        return;
      }
      const flag = event.target.closest("[data-flag]");
      if (flag) {
        patchLayer(item.id, { [flag.dataset.flag]: !item[flag.dataset.flag] });
        render();
      }
    });

    document.getElementById("inspector").addEventListener("input", (event) => {
      const item = selected();
      const caption = event.target.closest("[data-caption]");
      if (caption) {
        state[caption.dataset.caption] = event.target.value;
        persist();
        if (caption.dataset.caption === "caption") {
          const counter = document.querySelector("#inspector .muted");
          if (counter) counter.textContent = `${state.caption.length} / 500`;
        }
        return;
      }
      if (!item) return;
      const text = event.target.closest("[data-layer='text']");
      if (text) {
        patchLayer(item.id, { text: event.target.value });
        renderStage();
        return;
      }
      const control = event.target.closest("[data-layer]");
      if (!control || control.tagName !== "INPUT") return;
      const key = control.dataset.layer;
      const value = Number(control.value);
      patchLayer(item.id, { [key]: value });
      rangeStyle(control, Number(control.min), Number(control.max), control.value);
      const label = control.closest(".field")?.querySelector("label");
      if (label && key === "x") label.textContent = `Desplazamiento · ${Math.round(value)}`;
      if (label && key === "y") label.textContent = `Altura · ${Math.round(value)}`;
      if (label && key === "width") label.textContent = `Ancho del bloque · ${Math.round(value)}`;
      if (label && key === "fontSize") label.textContent = `Tamaño · ${value.toFixed(1)}`;
      renderStage();
    });

    document.getElementById("inspector").addEventListener("focusin", (event) => {
      if (event.target.matches("textarea, input")) inspectorLock = event.target.dataset.layer || event.target.dataset.caption;
    });
    document.getElementById("inspector").addEventListener("focusout", () => {
      inspectorLock = null;
    });

    const stage = document.getElementById("stage");
    stage.addEventListener("pointerdown", (event) => {
      const block = event.target.closest("[data-layer-id]");
      if (block) {
        const id = block.dataset.layerId;
        const item = state.layers.find((layerItem) => layerItem.id === id);
        if (!item) return;
        event.stopPropagation();
        state.selectedId = id;
        persist();
        document.querySelectorAll(".layer").forEach((el) => {
          el.classList.toggle("is-selected", el.dataset.layerId === id);
        });
        renderInspector();
        drag = {
          id,
          x: event.clientX,
          y: event.clientY,
          ox: item.x,
          oy: item.y,
          width: item.width,
        };
        block.setPointerCapture(event.pointerId);
        return;
      }
      if (state.selectedId) {
        state.selectedId = null;
        persist();
        renderInspector();
        document.querySelectorAll(".layer").forEach((el) => el.classList.remove("is-selected"));
      }
      if (!state.image) return;
      const rect = stage.getBoundingClientRect();
      imageDrag = {
        x: event.clientX,
        y: event.clientY,
        ox: state.image.offsetX,
        oy: state.image.offsetY,
        w: rect.width,
        h: rect.height,
      };
      stage.setPointerCapture(event.pointerId);
    });

    stage.addEventListener("pointermove", (event) => {
      if (drag) {
        const rect = stage.getBoundingClientRect();
        const dx = ((event.clientX - drag.x) / rect.width) * 100;
        const dy = ((event.clientY - drag.y) / rect.height) * 100;
        patchLayer(drag.id, {
          x: clamp(drag.ox + dx, 0, 100 - drag.width),
          y: clamp(drag.oy + dy, 0, 92),
        });
        const item = state.layers.find((layerItem) => layerItem.id === drag.id);
        const el = document.querySelector(`[data-layer-id="${drag.id}"]`);
        if (item && el) {
          el.style.left = `${item.x}%`;
          el.style.top = `${item.y}%`;
        }
        return;
      }
      if (imageDrag && state.image) {
        const dx = ((event.clientX - imageDrag.x) / imageDrag.w) * 100;
        const dy = ((event.clientY - imageDrag.y) / imageDrag.h) * 100;
        patchImage({ offsetX: imageDrag.ox + dx, offsetY: imageDrag.oy + dy });
        persist();
        const img = document.querySelector(".stage-img");
        if (img) {
          img.style.left = `${50 + state.image.offsetX}%`;
          img.style.top = `${50 + state.image.offsetY}%`;
        }
      }
    });

    stage.addEventListener("pointerup", () => {
      const moved = Boolean(drag);
      drag = null;
      imageDrag = null;
      if (moved) renderInspector();
    });

    stage.addEventListener("dblclick", (event) => {
      const block = event.target.closest("[data-layer-id]");
      if (!block) return;
      event.stopPropagation();
      const item = state.layers.find((layerItem) => layerItem.id === block.dataset.layerId);
      if (!item) return;
      block.classList.add("is-editing", "is-selected");
      block.innerHTML = `<textarea>${escapeHtml(item.text)}</textarea>`;
      const area = block.querySelector("textarea");
      area.focus();
      area.addEventListener("pointerdown", (ev) => ev.stopPropagation());
      area.addEventListener("input", () => {
        patchLayer(item.id, { text: area.value });
      });
      area.addEventListener("blur", () => {
        renderStage();
        renderInspector();
      });
    });

    stage.addEventListener("dragover", (event) => event.preventDefault());
    stage.addEventListener("drop", (event) => {
      event.preventDefault();
      void handleFiles(event.dataTransfer.files);
    });

    window.addEventListener("paste", (event) => {
      const entry = [...(event.clipboardData?.items ?? [])].find((item) => item.type.startsWith("image/"));
      const file = entry?.getAsFile();
      if (file) void handleFiles([file]);
    });

    window.addEventListener("keydown", (event) => {
      const target = event.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const item = selected();
      if (!item) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        state.layers = state.layers.filter((layerItem) => layerItem.id !== item.id);
        state.selectedId = state.layers.at(-1)?.id ?? null;
        persist();
        render();
        return;
      }
      const step = event.shiftKey ? 2.5 : 0.8;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        patchLayer(item.id, { x: item.x - step });
        render();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        patchLayer(item.id, { x: item.x + step });
        render();
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        patchLayer(item.id, { y: item.y - step });
        render();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        patchLayer(item.id, { y: item.y + step });
        render();
      }
    });

    document.querySelectorAll(".mobile-nav button").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelector(".studio").dataset.tab = button.dataset.tab;
        document.querySelectorAll(".mobile-nav button").forEach((item) => item.classList.toggle("is-active", item === button));
      });
    });
    document.querySelector(".studio").dataset.tab = "canvas";
  }

  bind();
  render();
})();
