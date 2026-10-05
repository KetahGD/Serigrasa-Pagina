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
  const isContact = /contacto\.html$/.test(window.location.pathname);
  let contactOrigin = "pagina";
  if (form || isContact) {
    const section = document.querySelector("main > section");
    const banner = document.createElement("div");
    banner.className = "origin-banner";
    banner.innerHTML = '<span class="eyebrow" data-origin-label>Atención personalizada</span><button class="btn" type="button" data-origin-change>Cambiar origen</button>';
    section.querySelector(".section-head").after(banner);
    const guide = document.createElement("article");
    guide.className = "notice tiktok-guide";
    guide.hidden = true;
    guide.innerHTML = `<span class="eyebrow">TikTok · Personaliza tu producto</span><h3>Envíanos tu diseño</h3><p>Comparte tu archivo en PDF o PNG de alta definición por WhatsApp o correo. Incluye tu usuario de TikTok o el número de pedido para identificar tu compra.</p><ol><li>Ten a la mano tu usuario o número de pedido.</li><li>Envía el diseño en su tamaño original, evitando capturas de pantalla.</li><li>Indica el producto y los detalles de personalización. Revisaremos tu archivo contigo.</li></ol><a class="highlight" href="https://wa.me/525544940431" target="_blank" rel="noopener noreferrer">WhatsApp: 55 4494 0431</a><a class="highlight origin-mail" href="mailto:garsa.serigrafia@gmail.com">garsa.serigrafia@gmail.com</a><p class="origin-file-note">Adjunta el archivo directamente en WhatsApp o en tu correo después de abrir el mensaje.</p>`;
    banner.after(guide);
    const identity = document.createElement("div");
    identity.className = "tiktok-identity";
    identity.hidden = true;
    identity.innerHTML = `<p class="quote-note">Para identificarte, completa al menos uno de estos datos.</p><div class="form-row"><div><label for="tiktokUsuario">Usuario de TikTok</label><input id="tiktokUsuario" type="text" placeholder="@tuusuario" aria-describedby="tiktokIdentityHint"></div><div><label for="tiktokPedido">Número de pedido</label><input id="tiktokPedido" type="text" placeholder="Número de tu compra" aria-describedby="tiktokIdentityHint"></div></div><small id="tiktokIdentityHint">Puedes indicar tu usuario, tu número de pedido o ambos.</small>`;
    if (form) form.prepend(identity);
    else {
      const tiktokForm = document.createElement("form");
      tiktokForm.className = "tiktok-contact-form";
      tiktokForm.hidden = true;
      tiktokForm.append(identity);
      tiktokForm.insertAdjacentHTML("beforeend", '<div class="quote-actions"><button class="btn btn-wa" type="submit" data-send="whatsapp">Enviar por WhatsApp</button><button class="btn btn-mail" type="submit" data-send="email">Enviar por correo</button></div>');
      guide.after(tiktokForm);
      tiktokForm.addEventListener("submit", e => {
        e.preventDefault();
        if (!validateIdentity()) return;
        sendTikTok(e.submitter?.dataset.send);
      });
    }
    const user = identity.querySelector("#tiktokUsuario");
    const order = identity.querySelector("#tiktokPedido");
    function validateIdentity() {
      user.setCustomValidity(user.value.trim() || order.value.trim() ? "" : "Indica tu usuario de TikTok o tu número de pedido.");
      return user.reportValidity();
    }
    [user, order].forEach(input => input.addEventListener("input", () => user.setCustomValidity("")));
    function sendTikTok(action) {
      const message = `Hola, vengo de TikTok y quiero enviar el diseño de mi producto.\nUsuario de TikTok: ${user.value.trim() || "No indicado"}\nNúmero de pedido: ${order.value.trim() || "No indicado"}\nAdjuntaré mi diseño en PDF o PNG de alta definición en este mensaje.`;
      if (action === "email") window.location.href = "mailto:garsa.serigrafia@gmail.com?subject=" + encodeURIComponent("Diseño de producto · TikTok SERIGARSA") + "&body=" + encodeURIComponent(message);
      else window.open("https://wa.me/525544940431?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    }
    if (form) form.validateTikTokIdentity = validateIdentity;
    const dialog = document.createElement("dialog");
    dialog.className = "origin-dialog";
    dialog.setAttribute("aria-labelledby", "originTitle");
    dialog.innerHTML = `<button type="button" class="origin-close" aria-label="Cerrar y continuar desde la página">×</button><span class="eyebrow">Bienvenido a SERIGARSA</span><h2 id="originTitle">¿De dónde vienes?</h2><p>Elige una opción para mostrarte la información que necesitas.</p><div class="origin-options"><button class="origin-option" type="button" data-origin="tiktok"><img src="assets/icons/tiktok.png" alt=""><strong>Vengo de TikTok</strong><span>Envía tu diseño e identifica tu compra.</span></button><button class="origin-option" type="button" data-origin="pagina"><span class="origin-web" aria-hidden="true">↗</span><strong>Vengo de la página</strong><span>Cotiza y recibe información para tu proyecto.</span></button></div>`;
    document.body.append(dialog);
    const title = section.querySelector(".section-head h1");
    const intro = section.querySelector(".section-head p");
    const originalTitle = title.textContent;
    const originalIntro = intro.textContent;
    const note = form?.querySelector(".quote-note:not(.tiktok-identity .quote-note)");
    const originalNote = note?.textContent;
    const applyOrigin = origin => {
      contactOrigin = origin;
      const tiktok = origin === "tiktok";
      banner.querySelector("[data-origin-label]").textContent = tiktok ? "Vienes de TikTok" : "Vienes de la página";
      guide.hidden = identity.hidden = !tiktok;
      section.querySelector(".tiktok-contact-form")?.toggleAttribute("hidden", !tiktok);
      title.textContent = tiktok ? "Personaliza tu compra de TikTok" : originalTitle;
      intro.textContent = tiktok ? "Identifica tu compra y envíanos tu diseño para revisar la personalización de tu producto." : originalIntro;
      if (note) note.textContent = tiktok ? "Adjunta tu diseño en PDF o PNG de alta definición al abrir WhatsApp o tu correo. Incluye tu usuario de TikTok o número de pedido." : originalNote;
      section.querySelectorAll(".terms-panel, .process-grid").forEach(el => el.hidden = tiktok);
      const processHead = section.querySelector(".process-grid")?.previousElementSibling;
      if (processHead) processHead.hidden = tiktok;
      const notice = section.querySelector(".quote-layout > .notice");
      if (notice) notice.hidden = tiktok;
      user.setCustomValidity("");
      if (form) {
        form.querySelector("#producto").required = !tiktok;
        form.querySelectorAll("[data-send] span").forEach(span => {
          if (!span.hasAttribute("aria-hidden")) span.textContent = tiktok ? (span.closest("button").dataset.send === "email" ? "Enviar diseño por correo" : "Enviar diseño por WhatsApp") : (span.closest("button").dataset.send === "email" ? "Enviar por correo" : "Enviar por WhatsApp");
        });
      }
    };
    dialog.querySelectorAll("[data-origin]").forEach(button => button.addEventListener("click", () => { applyOrigin(button.dataset.origin); dialog.close(); }));
    dialog.querySelector(".origin-close").addEventListener("click", () => dialog.close());
    banner.querySelector("button").addEventListener("click", () => dialog.showModal());
    applyOrigin("pagina");
    dialog.showModal();
  }
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
      if (contactOrigin === "tiktok" && !form.validateTikTokIdentity()) return;
      const get = id => (document.getElementById(id)?.value || "").trim();
      const action = e.submitter?.dataset.send || "whatsapp";
      const message = [
        contactOrigin === "tiktok" ? "Hola, vengo de TikTok y quiero personalizar mi producto." : "Hola, vengo de la página y quiero solicitar una cotización con SERIGARSA.",
        ...(contactOrigin === "tiktok" ? [`Usuario de TikTok: ${get("tiktokUsuario") || "No indicado"}`, `Número de pedido: ${get("tiktokPedido") || "No indicado"}`] : []),
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
        contactOrigin === "tiktok" ? "Adjuntaré mi diseño en PDF o PNG de alta definición al enviar este mensaje." : "Adjuntaré imágenes, logotipo o PDF del diseño que deseo cotizar al enviar este mensaje."
      ].join("\n");
      const text = encodeURIComponent(message);
      if(action === "email"){
        const subject = encodeURIComponent(contactOrigin === "tiktok" ? "Diseño de producto · TikTok SERIGARSA" : "Solicitud de cotización SERIGARSA");
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
