// Entry point for the build script in your package.json
// import "@hotwired/turbo-rails"
// import "./controllers"

// modal handling
(() => {
  const modalHandler = e => {
    e.preventDefault();

    const dataModal = e.target.getAttribute("data-modal");
    const dataPath = e.target.getAttribute("data-path");
    const dataElement = e.target.getAttribute("data-element");

    if(dataModal === "open") {
      fetch(dataPath)
        .then(data => data.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // don't confuse: document is the current page document, doc is the 
          // parsed doc from dataPath

          // #modal-content can be specific, because this is a handler scoped 
          // to modals
          const modalContent = document.querySelector("#modal-content");
          const element = doc.querySelector(dataElement);

          modalContent.appendChild(element);
          modal.classList.remove("hidden");
      });
    }

    // clear all the content from modal and hide it again
    if(dataModal === "close") {
      const modalContent = document.querySelector("#modal-content");
      modalContent.textContent = "";
      modal.classList.add("hidden");
    }
  }

  // call on all elements that indicate they are a modal handler in markup
  document.querySelectorAll('[data-modal]').forEach(modalActivator => {
    modalActivator.addEventListener("click", modalHandler);
  });
})();
