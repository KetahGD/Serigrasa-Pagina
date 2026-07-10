function scrollCarousel(id, amount){
  const el = document.getElementById(id);
  if(el) el.scrollBy({ left: amount, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
  const sidebarCloseControls = document.querySelectorAll("[data-sidebar-close]");
  const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
  const setSidebarState = (open) => {
    document.body.classList.toggle("sidebar-open", open);
    if (sidebar) sidebar.setAttribute("aria-hidden", String(!open));
    if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", String(open));
  };
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      setSidebarState(!document.body.classList.contains("sidebar-open"));
    });
  }
  sidebarCloseControls.forEach((control) => {
    control.addEventListener("click", () => setSidebarState(false));
  });
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => setSidebarState(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("sidebar-open")) {
      setSidebarState(false);
    }
  });

  const visualLabsKey = "serigarsaVisualLabs";
  const visualLabs = (() => {
    try {
      return JSON.parse(localStorage.getItem(visualLabsKey) || "{}");
    } catch {
      return {};
    }
  })();
  const backgroundModes = ["none", "brick", "halftone", "grid", "diagonal"];
  const colorModes = ["default", "ink", "graphite", "petrol", "purple", "green"];
  const accentModes = ["default", "cyan", "magenta", "yellow", "green", "white"];
  const cardModes = ["default", "glass", "neon", "minimal"];
  const imageModes = ["default", "soft", "sharp", "tilt"];
  const motionModes = ["default", "calm", "impact"];
  const setBodyMode = (group, modes, mode, persist = true) => {
    const selected = modes.includes(mode) ? mode : modes[0];
    modes.forEach((name) => {
      document.body.classList.toggle(`visual-${group}-${name}`, selected === name && name !== modes[0]);
    });
    visualLabs[group] = selected;
    if (persist) localStorage.setItem(visualLabsKey, JSON.stringify(visualLabs));
    document.querySelectorAll(`[data-${group}-mode]`).forEach((control) => {
      control.setAttribute("aria-pressed", String(control.dataset[`${group}Mode`] === selected));
    });
  };
  const setBackgroundMode = (mode, persist = true) => {
    const selected = backgroundModes.includes(mode) ? mode : "none";
    backgroundModes.forEach((name) => {
      document.body.classList.toggle(`visual-bg-${name}`, selected === name && name !== "none");
    });
    visualLabs.background = selected;
    if (persist) localStorage.setItem(visualLabsKey, JSON.stringify(visualLabs));
    document.querySelectorAll("[data-bg-mode]").forEach((control) => {
      control.setAttribute("aria-pressed", String(control.dataset.bgMode === selected));
    });
  };
  const initialBackground = visualLabs.background || (visualLabs["brick-bg-enabled"] ? "brick" : "none");
  setBackgroundMode(initialBackground, false);
  const setColorMode = (mode, persist = true) => {
    const selected = colorModes.includes(mode) ? mode : "default";
    colorModes.forEach((name) => {
      document.body.classList.toggle(`visual-tone-${name}`, selected === name && name !== "default");
    });
    visualLabs.color = selected;
    if (persist) localStorage.setItem(visualLabsKey, JSON.stringify(visualLabs));
    document.querySelectorAll("[data-color-mode]").forEach((control) => {
      control.setAttribute("aria-pressed", String(control.dataset.colorMode === selected));
    });
  };
  setColorMode(visualLabs.color || "default", false);
  setBodyMode("accent", accentModes, visualLabs.accent || "default", false);
  setBodyMode("card", cardModes, visualLabs.card || "default", false);
  setBodyMode("image", imageModes, visualLabs.image || "default", false);
  setBodyMode("motion", motionModes, visualLabs.motion || "default", false);

  const debugPanel = document.createElement("div");
  debugPanel.className = "visual-debug";
  const hasHeroModes = Boolean(document.querySelector("[data-hero-view]"));
  debugPanel.innerHTML = `
    <button class="visual-debug-toggle" type="button" aria-expanded="false" aria-controls="visualDebugPanel">Pruebas visuales</button>
    <div class="visual-debug-panel" id="visualDebugPanel" hidden>
      <strong>Comparaci&oacute;n de formatos</strong>
      ${hasHeroModes ? `
        <details class="visual-debug-group">
          <summary>Inicio visual</summary>
          <div class="visual-debug-options" role="group" aria-label="Seleccionar presentaci&oacute;n inicial">
            <button type="button" data-hero-mode="collage" aria-pressed="true">Collage</button>
            <button type="button" data-hero-mode="classic" aria-pressed="false">Cl&aacute;sica</button>
          </div>
        </details>
      ` : ""}
      <details class="visual-debug-group">
        <summary>Fondo general</summary>
        <div class="visual-debug-options" role="group" aria-label="Seleccionar fondo experimental">
          <button type="button" data-bg-mode="none" aria-pressed="true">Sin fondo</button>
          <button type="button" data-bg-mode="brick" aria-pressed="false">Ladrillo</button>
          <button type="button" data-bg-mode="halftone" aria-pressed="false">Trama</button>
          <button type="button" data-bg-mode="grid" aria-pressed="false">Ret&iacute;cula</button>
          <button type="button" data-bg-mode="diagonal" aria-pressed="false">Diagonal</button>
        </div>
      </details>
      <details class="visual-debug-group">
        <summary>Color base</summary>
        <div class="visual-debug-options color-options" role="group" aria-label="Seleccionar color de fondo">
          <button type="button" data-color-mode="default" aria-pressed="true">Base</button>
          <button type="button" data-color-mode="ink" aria-pressed="false">Negro</button>
          <button type="button" data-color-mode="graphite" aria-pressed="false">Grafito</button>
          <button type="button" data-color-mode="petrol" aria-pressed="false">Petr&oacute;leo</button>
          <button type="button" data-color-mode="purple" aria-pressed="false">Morado</button>
          <button type="button" data-color-mode="green" aria-pressed="false">Verde</button>
        </div>
      </details>
      <details class="visual-debug-group">
        <summary>Acento</summary>
        <div class="visual-debug-options color-options" role="group" aria-label="Seleccionar color de acento">
          <button type="button" data-accent-mode="default" aria-pressed="true">CMYK</button>
          <button type="button" data-accent-mode="cyan" aria-pressed="false">Cyan</button>
          <button type="button" data-accent-mode="magenta" aria-pressed="false">Magenta</button>
          <button type="button" data-accent-mode="yellow" aria-pressed="false">Yellow</button>
          <button type="button" data-accent-mode="green" aria-pressed="false">Verde</button>
          <button type="button" data-accent-mode="white" aria-pressed="false">Blanco</button>
        </div>
      </details>
      <details class="visual-debug-group">
        <summary>Tarjetas</summary>
        <div class="visual-debug-options" role="group" aria-label="Seleccionar estilo de tarjetas">
          <button type="button" data-card-mode="default" aria-pressed="true">Base</button>
          <button type="button" data-card-mode="glass" aria-pressed="false">Cristal</button>
          <button type="button" data-card-mode="neon" aria-pressed="false">Neon</button>
          <button type="button" data-card-mode="minimal" aria-pressed="false">Limpio</button>
        </div>
      </details>
      <details class="visual-debug-group">
        <summary>Im&aacute;genes</summary>
        <div class="visual-debug-options" role="group" aria-label="Seleccionar forma de im&aacute;genes">
          <button type="button" data-image-mode="default" aria-pressed="true">Base</button>
          <button type="button" data-image-mode="soft" aria-pressed="false">Suave</button>
          <button type="button" data-image-mode="sharp" aria-pressed="false">Recta</button>
          <button type="button" data-image-mode="tilt" aria-pressed="false">Din&aacute;mica</button>
        </div>
      </details>
      <details class="visual-debug-group">
        <summary>Movimiento</summary>
        <div class="visual-debug-options" role="group" aria-label="Seleccionar intensidad visual">
          <button type="button" data-motion-mode="default" aria-pressed="true">Base</button>
          <button type="button" data-motion-mode="calm" aria-pressed="false">Calma</button>
          <button type="button" data-motion-mode="impact" aria-pressed="false">Impacto</button>
        </div>
      </details>
      <small>Opciones locales para comparar estilos sin dejarlos fijos.</small>
    </div>
  `;
  document.body.appendChild(debugPanel);
  const debugToggle = debugPanel.querySelector(".visual-debug-toggle");
  const debugContent = debugPanel.querySelector(".visual-debug-panel");
  debugToggle.addEventListener("click", () => {
    const isOpen = debugContent.hidden;
    debugContent.hidden = !isOpen;
    debugToggle.setAttribute("aria-expanded", String(isOpen));
  });
  const debugGroups = debugPanel.querySelectorAll(".visual-debug-group");
  debugGroups.forEach((group) => {
    group.addEventListener("toggle", () => {
      if (!group.open) return;
      debugGroups.forEach((otherGroup) => {
        if (otherGroup !== group) otherGroup.open = false;
      });
    });
    group.addEventListener("click", (event) => {
      if (event.target.closest(".visual-debug-options") || event.target.closest("summary")) return;
      group.open = !group.open;
    });
  });
  debugPanel.querySelectorAll("[data-bg-mode]").forEach((control) => {
    control.addEventListener("click", () => setBackgroundMode(control.dataset.bgMode));
  });
  debugPanel.querySelectorAll("[data-color-mode]").forEach((control) => {
    control.addEventListener("click", () => setColorMode(control.dataset.colorMode));
  });
  debugPanel.querySelectorAll("[data-accent-mode]").forEach((control) => {
    control.addEventListener("click", () => setBodyMode("accent", accentModes, control.dataset.accentMode));
  });
  debugPanel.querySelectorAll("[data-card-mode]").forEach((control) => {
    control.addEventListener("click", () => setBodyMode("card", cardModes, control.dataset.cardMode));
  });
  debugPanel.querySelectorAll("[data-image-mode]").forEach((control) => {
    control.addEventListener("click", () => setBodyMode("image", imageModes, control.dataset.imageMode));
  });
  debugPanel.querySelectorAll("[data-motion-mode]").forEach((control) => {
    control.addEventListener("click", () => setBodyMode("motion", motionModes, control.dataset.motionMode));
  });
  setBackgroundMode(visualLabs.background || initialBackground, false);
  setColorMode(visualLabs.color || "default", false);
  setBodyMode("accent", accentModes, visualLabs.accent || "default", false);
  setBodyMode("card", cardModes, visualLabs.card || "default", false);
  setBodyMode("image", imageModes, visualLabs.image || "default", false);
  setBodyMode("motion", motionModes, visualLabs.motion || "default", false);

  const heroModeControls = document.querySelectorAll("[data-hero-mode]");
  if (heroModeControls.length) {
    const storageKey = "serigarsaHeroMode";
    const setHeroMode = (mode, persist = true) => {
      const selected = mode === "classic" ? "classic" : "collage";
      document.body.classList.toggle("hero-mode-classic", selected === "classic");
      document.body.classList.toggle("hero-mode-collage", selected === "collage");
      heroModeControls.forEach((control) => {
        control.setAttribute("aria-pressed", String(control.dataset.heroMode === selected));
      });
      if (persist) localStorage.setItem(storageKey, selected);
    };
    setHeroMode(localStorage.getItem(storageKey) || "collage", false);
    heroModeControls.forEach((control) => {
      control.addEventListener("click", () => setHeroMode(control.dataset.heroMode));
    });
  }

  const form = document.getElementById("quoteForm");
  if(form){
    const params = new URLSearchParams(window.location.search);
    const selected = params.get("producto");
    if(selected){
      const product = document.getElementById("producto");
      const msg = document.getElementById("mensaje");
      if(product){
        const existing = Array.from(product.options).find(option => option.textContent.trim() === selected);
        if(existing){
          product.value = existing.value;
        } else {
          const option = document.createElement("option");
          option.textContent = selected;
          option.value = selected;
          product.appendChild(option);
          product.value = selected;
        }
      }
      if(msg) msg.value = "Me interesa cotizar: " + selected + ".";
    }

    form.addEventListener("submit", function(e){
      e.preventDefault();
      const get = id => (document.getElementById(id)?.value || "").trim();
      const action = e.submitter?.dataset.send || "whatsapp";
      const message = [
        "Hola, quiero solicitar una cotización con SERIGARSA.",
        "",
        `Nombre: ${get("nombre")}`,
        `WhatsApp: ${get("telefono")}`,
        `Correo: ${get("correo") || "No indicado"}`,
        `Producto/servicio: ${get("producto")}`,
        `Cantidad aproximada: ${get("cantidad") || "Por definir"}`,
        `Fecha de entrega: ${get("fecha") || "Por definir"}`,
        `Diseño: ${get("diseno") || "Por definir"}`,
        `Detalles: ${get("mensaje") || "Sin detalles adicionales"}`,
        "",
        "Importante: adjunto imágenes, logotipo o PDF del diseño que deseo cotizar."
      ].join("\n");
      const text = encodeURIComponent(message);
      if(action === "email"){
        const subject = encodeURIComponent("Solicitud de cotización SERIGARSA");
        window.location.href = "mailto:garsa.serigrafia@gmail.com?subject=" + subject + "&body=" + text;
        return;
      }
      window.open("https://wa.me/525544940431?text=" + text, "_blank");
    });
  }
});

// Imagen ampliada para las galerías
document.addEventListener("DOMContentLoaded", () => {
  let lightbox = document.querySelector(".image-lightbox");

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.innerHTML = `
      <button class="image-lightbox-close" type="button" aria-label="Cerrar imagen ampliada">x</button>
      <img src="" alt="Imagen ampliada">
      <div class="image-lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".image-lightbox-caption");
  const closeBtn = lightbox.querySelector(".image-lightbox-close");
  const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);

  const openLightbox = (img) => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "Imagen ampliada";
    const product = img.closest(".product-card");
    if (product) {
      const title = product.querySelector("h4")?.textContent.trim() || img.alt || "Producto";
      const description = product.querySelector(".product-info p")?.textContent.trim() || "";
      const tags = Array.from(product.querySelectorAll(".tag-list span")).map(tag => tag.textContent.trim()).filter(Boolean);
      caption.innerHTML = `
        <strong>${escapeHtml(title)}</strong>
        ${description ? `<span>${escapeHtml(description)}</span>` : ""}
        ${tags.length ? `<small>${tags.map(escapeHtml).join(" · ")}</small>` : ""}
      `;
    } else {
      caption.textContent = img.alt || "";
    }
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".product-media img, .gallery-mini img, .hero-card-img img, .collage-item img, .preview-grid img").forEach((img) => {
    img.setAttribute("tabindex", "0");
    img.addEventListener("click", () => openLightbox(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) closeLightbox();
  });
});
