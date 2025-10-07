// nav-bar-component.js
import { LitElement, html, css } from "lit";
import "./nav-bar-items.js";

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
      
    .separator {
      color: #aaa;
      font-weight: 300;
    }
  `;

  render() {
    return html`
      <nav-bar-items label="Resultaten"></nav-bar-items>
      <span class="separator">|</span>
      <nav-bar-items label="Bob-game"></nav-bar-items>
    `;
  }
}

customElements.define("nav-bar-component", NavBar);
