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
        .then(data => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return data.text();
        })
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // don"t confuse: document is the current page document, doc is the 
          // parsed doc from dataPath

          // #modal-content can be specific, because this is a handler scoped 
          // to modals
          const modalContent = document.querySelector("#modal-content");
          const element = doc.querySelector(dataElement);

          modalContent.appendChild(element);
          modal.classList.remove("hidden");
        })
        .catch(error => {
          // create some error markup which we can show in this case
        });
    }

    // clear all the content from modal and hide it again
    if(dataModal === "close") {
      const modalContent = document.querySelector("#modal-content");
      modalContent.textContent = "";
      modal.classList.add("hidden");
    }
  }

  // initially call on all elements that indicate they are a modal handler in markup
  document.querySelectorAll("[data-modal]").forEach(modalActivator => {
    modalActivator.addEventListener("click", modalHandler);
  });
})();



(() => {
  // callback to handle form submissions
  const formHandler = e => {
    e.preventDefault();

    const form = e.target;

    const data = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: data,
    })
      .then(data => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return data.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // get the first element that matches the target
        const element = doc.querySelector(form.getAttribute("data-element"));
        const target = document.querySelector(form.getAttribute("data-target"));

        if(form.getAttribute("data-insert") === "before") {
          target.prependChild(element);
        }

        if(form.getAttribute("data-insert") === "after") {
          target.appendChild(element);
        }
      })
      .catch(error => {
        // create some error markup which we can show in this case
      });

    // close all open modals in anticipation of the form being in one.
    // very arbitrary, but i think good enough for mvp
    const modalContent = document.querySelector("#modal-content");
    modalContent.textContent = "";
    modal.classList.add("hidden");
  }

  // dom observer to look for dom changes
  // ty https://stackoverflow.com/a/14570614/744230
  // alternatively i would have naively checked for dom character length every 100ms or so
  const observeDOM = (() => {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return ( obj, callback ) => {
      if( !obj || obj.nodeType !== 1 ) return; 

      if( MutationObserver ){
        // define a new observer
        const mutationObserver = new MutationObserver(callback);

        // have the observer observe foo for changes in children
        mutationObserver.observe( obj, { childList:true, subtree:true });
        return mutationObserver;
      }
      
      // browser support fallback
      else if( window.addEventListener ){
        obj.addEventListener("DOMNodeInserted", callback, false);
        obj.addEventListener("DOMNodeRemoved", callback, false);
      }
    }
  })();


  // attach form handlers when dom changes
  observeDOM(document.body, (m) => { 
    const addedNodes = [], removedNodes = [];

    m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes));
    m.forEach(record => record.removedNodes.length & removedNodes.push(...record.removedNodes));

    // add listeners for form handling
    addedNodes.forEach(node => {
      const forms = node.querySelectorAll("form");
      forms.forEach(f => {
        f.addEventListener("submit", formHandler);
      });
    });

    // remove added listeners again
    removedNodes.forEach(node => {
      const forms = node.querySelectorAll("form");
      forms.forEach(f => {
        f.removeEventListener("submit", formHandler);
      });
    });

    console.log("Added:", addedNodes, "Removed:", removedNodes);
  });
})();

