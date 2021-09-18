// Entry point for the build script in your packagevt.json
// import "@hotwired/turbo-rails"
// import "./controllers"


// ty https://dev.to/akhil_001/adding-event-listeners-to-the-future-dom-elements-using-event-bubbling-3cp1
const addInterceptingEventListener = (selector, event, handler) => {
  const rootElement = document.querySelector("body");
  
  //since the root element is set to be body for our current dealings
  rootElement.addEventListener(event, (evt) => {
      let targetElement = evt.target;
      
      while (targetElement !== null) {
        if (targetElement.matches(selector)) {
          handler(evt);
          return;
        }
        targetElement = targetElement.parentElement;
      }
    },
    true
  );
}

// modal handling
const modalHandler = evt => {
  evt.preventDefault();

  const dataModal = evt.target.getAttribute("data-modal");
  const dataPath = evt.target.getAttribute("data-path");
  const dataElement = evt.target.getAttribute("data-element");

  if(dataModal === "open") {
    fetch(dataPath)
      .then(data => {
        if (!data.ok) {
          throw Error(data.statusText);
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

// callback to handle form submissions
const formHandler = evt => {
  evt.preventDefault();

  // find parent form, because we only get the input button as a target element
  let targetElement = evt.target;
  
  while (targetElement !== null) {
    if (targetElement.matches("form")) {
      break;
    }
    targetElement = targetElement.parentElement;
  }

  const form = targetElement;
  const data = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: data,
  })
    .then(data => {
      if (!data.ok) {
        throw Error(data.statusText);
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
}

// change star images on hover
const ratingHoverHandler = (evt) => {
  const ratingValue = evt.target.getAttribute("data-value");
  const stars = document.querySelectorAll(".review-rating");

  for(let i = 0; i < 5; i++) {
    if(i < ratingValue) {
      stars[i].classList.add("active");
    } else {
      stars[i].classList.remove("active");
    }
  }
}

// change star images on hover
const ratingHoverLeaveHandler = () => {
  // this is the hidden input containing the value of the rating, which we will 
  // update when the user *clicks* a star
  // 
  // also: .review-rating is a selectable star in the new review form, #review_rating is
  // the hidden input element in the same form that caries the selected rating value
  const selectedRating = parseInt(document.querySelector("#review_rating").value);
  
  const stars = document.querySelectorAll(".review-rating");

  for(let i = 0; i < 5; i++) {
    if(i < selectedRating) {
      stars[i].classList.add("active");
    } else {
      stars[i].classList.remove("active");
    }
  }
}

// change star images on hover
const ratingClickHandler = (evt) => {
  document.querySelector("#review_rating").value = evt.target.getAttribute("data-value");
}

addInterceptingEventListener(".review-rating", "mouseover", ratingHoverHandler);
addInterceptingEventListener(".review-rating", "mouseleave", ratingHoverLeaveHandler);
addInterceptingEventListener(".review-rating", "click", ratingClickHandler);
addInterceptingEventListener("[type=submit][data-transport=remote]", "click", formHandler);
addInterceptingEventListener("[data-modal]", "click", modalHandler);


