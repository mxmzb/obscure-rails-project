// Entry point for the build script in your package.json
// import "@hotwired/turbo-rails"
// import "./controllers"


// keep scope clean
(() => {
  const addReviewButton = document.getElementById("add-review-button");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  
  addReviewButton.addEventListener("click", (e) => {
    e.preventDefault();

    fetch("/reviews/new")
      .then((data) => data.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
  
        const newReview = doc.getElementById("new-review");
        modal.classList.remove("hidden");
        modalContent.appendChild(newReview);
      });
  });  
})();

