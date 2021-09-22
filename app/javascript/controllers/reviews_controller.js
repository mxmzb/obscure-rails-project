import React from "react";
import { render } from "react-dom";
import { Controller } from "@hotwired/stimulus";
import App from "../react_app/components/App";

export default class extends Controller {
  connect() {
    render(<div>Hello React</div>, this.element);
  }

  disconnect() {
    this.element.destroy(reactRoot);
  }
}
