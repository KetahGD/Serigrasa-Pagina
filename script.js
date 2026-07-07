
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
      if(product) product.value = "Otro producto";
      if(msg) msg.value = "Me interesa cotizar: " + selected + ".";
    }

    form.addEventListener("submit", function(e){
      e.preventDefault();
      const get = id => (document.getElementById(id)?.value || "").trim();
      const text =
        `Hola, quiero solicitar una cotización con SERIGARSA.%0A%0A` +
        `Nombre: ${encodeURIComponent(get("nombre"))}%0A` +
        `WhatsApp: ${encodeURIComponent(get("telefono"))}%0A` +
        `Correo: ${encodeURIComponent(get("correo") || "No indicado")}%0A` +
        `Producto/servicio: ${encodeURIComponent(get("producto"))}%0A` +
        `Cantidad aproximada: ${encodeURIComponent(get("cantidad") || "Por definir")}%0A` +
        `Fecha de entrega: ${encodeURIComponent(get("fecha") || "Por definir")}%0A` +
        `Diseño: ${encodeURIComponent(get("diseno") || "Por definir")}%0A` +
        `Detalles: ${encodeURIComponent(get("mensaje") || "Sin detalles adicionales")}`;
      window.open("https://wa.me/525544940431?text=" + text, "_blank");
    });
  }
});
