import React from "react";
import { render } from "react-dom";
import { Controller } from "@hotwired/stimulus";
import App from "../react_app/components/App";

export default class extends Controller {
  connect() {
    render(<App productId={this.element.dataset.productId} />, this.element);
  }

  disconnect() {
    this.element.remove();
  }
}
