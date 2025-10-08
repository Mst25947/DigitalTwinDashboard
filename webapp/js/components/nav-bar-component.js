import { LitElement, html, css } from "lit";
import "./nav-bar-items.js";
import "./nav-bar-separator.js";
import { Router } from "@vaadin/router";

export class NavBar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      height: 60px;
      background-color: #f5f5f5;
      border-bottom: 2px solid #ccc;
      font-family: sans-serif;
    }
  `;

  render() {
    return html`
        <nav-bar-items label="Resultaten" route="/resultaten"></nav-bar-items>
        <nav-bar-separator></nav-bar-separator>
        <nav-bar-items label="Bob-game" route="/bob-game"></nav-bar-items>
    `;
    }
}

customElements.define("nav-bar-component", NavBar);
