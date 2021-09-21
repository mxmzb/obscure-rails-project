// Entry point for the build script in your packagevt.json
// import "@hotwired/turbo-rails"
// import "./controllers"
import React from "react";
import { render } from "react-dom";

const App = () => (
  <div>hello react</div>
);

document.addEventListener("DOMContentLoaded", () => {
  render(<App />, document.body.appendChild(document.createElement("div")));
});



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

// control modal from html
const modalHandler = async evt => {
  evt.preventDefault();

  const dataModal = evt.target.getAttribute("data-modal");
  const dataPath = evt.target.getAttribute("data-path");
  const dataElement = evt.target.getAttribute("data-element");

  if(dataModal === "open") {
    try {
      const data = await fetch(dataPath);
      if (!data.ok) {
        throw Error(data.statusText);
      }
      const html = await data.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // don"t confuse: document is the current page document, doc is the 
      // parsed doc from dataPath
      // 
      // #modal-content can be specific, because this is a handler scoped 
      // to modals
      const modalContent = document.querySelector("#modal-content");
      const element = doc.querySelector(dataElement);

      modalContent.appendChild(element);
      modal.classList.remove("hidden");
    } catch(error) {
      // create some error markup which we can show in this case
    }
  }

  // clear all the content from modal and hide it again
  if(dataModal === "close") {
    const modalContent = document.querySelector("#modal-content");
    modalContent.textContent = "";
    modal.classList.add("hidden");
  }
}

// callback to handle form submissions
const formHandler = async evt => {
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
  const formData = new FormData(form);
  const parser = new DOMParser();

  try {
    const reviewData = await fetch(form.action, {
      method: "POST",
      body: formData,
    });

    if (!reviewData.ok) {
      throw reviewData;
    }
    const reviewHtml = await reviewData.text();
    const reviewDoc = parser.parseFromString(reviewHtml, "text/html");
    const reviewElement = reviewDoc.querySelector("[id^=review]");
    const reviewsContainer = document.querySelector("#reviews");

    // change to append if you want to order reviews old -> new, but don't forget
    // to change the order in the reviews#index action accordingly
    // target.append(reviewElement);
    reviewsContainer.prepend(reviewElement);

    // we'll just update the average rating on the current page without url with another
    // request. i'm aware that's surely not a beautiful solution (among other reasons, 
    // because it's done sequentially), but for now it shall suffice as an mvp solution

    // we know that form.action is something like `/products/14/reviews`
    const avgRatingData = await fetch(form.action + "/avg_rating", {
      method: "GET",
    });

    if (!avgRatingData.ok) {
      throw Error("Couldn't fetch updated average rating")
    }
    const avgRatingHtml = await avgRatingData.text();
    const avgRatingDoc = parser.parseFromString(avgRatingHtml, "text/html");
    const avgRatingElement = avgRatingDoc.querySelector("#average-rating");
    const avgRatingContainer = document.querySelector("#average-rating");
    
    avgRatingContainer.replaceWith(avgRatingElement);

    // we removed the modal indicator from the html for the form submission,
    // because we want to the modal stay open if there is errors (catch). 
    // hoowever, if there is no errors, we're closing manually here:
    const modalContent = document.querySelector("#modal-content");
    modalContent.textContent = "";
    modal.classList.add("hidden");
  } catch(error) {
    if(error.status === 422) {
      const html = await error.text()
      const doc = parser.parseFromString(html, "text/html");

      const errorExplanation = doc.querySelector("#error_explanation");
      const reviewErrors = document.querySelector("#review-errors");
      
      reviewErrors.textContent = "";
      reviewErrors.appendChild(errorExplanation);
    }
    // handle other errors
    console.log({ error })
  }
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


