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

  document.body.classList.add(
    "hero-mode-classic",
    "visual-bg-soft",
    "visual-card-neon",
    "visual-image-tilt",
    "visual-motion-impact"
  );

  const applyTimeBackground = () => {
    const hour = new Date().getHours();
    const isDaytime = hour >= 8 && hour < 19;
    document.body.classList.toggle("visual-day-soft", isDaytime);
    document.body.dataset.backgroundSchedule = isDaytime ? "dia" : "noche";
  };
  applyTimeBackground();
  window.setInterval(applyTimeBackground, 5 * 60 * 1000);

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
