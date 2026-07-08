(function(){
  const saved = localStorage.getItem("serigarsa-theme");
  if(saved === "dark" || (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)){
    document.documentElement.setAttribute("data-theme","dark");
  }
})();

function toggleTheme(){
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  if(next === "dark"){
    document.documentElement.setAttribute("data-theme","dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem("serigarsa-theme", next);
}

function scrollCarousel(id, amount){
  const el = document.getElementById(id);
  if(el) el.scrollBy({ left: amount, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
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

  const openLightbox = (img) => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "Imagen ampliada";
    caption.textContent = img.alt || "";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".product-media img, .gallery-mini img, .hero-card-img img, .preview-grid img").forEach((img) => {
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
