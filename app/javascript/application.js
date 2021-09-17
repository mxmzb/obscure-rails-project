// Entry point for the build script in your package.json
// import "@hotwired/turbo-rails"
// import "./controllers"

(() => {
  document.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();

    const dataModal = e.target.getAttribute("data-modal");
    const dataPath = e.target.getAttribute("data-path");
    const dataElement = e.target.getAttribute("data-element");
    const dataTarget = e.target.getAttribute("data-target");

    if(dataModal === "open") {
      fetch(dataPath)
        .then(data => data.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // don't confuse: document is the current page document, doc is the 
          // parsed doc from dataPath
          const target = document.querySelector(dataTarget);
          const element = doc.querySelector(dataElement);

          target.appendChild(element);
          modal.classList.remove("hidden");
        });
    }
  });  
})();
