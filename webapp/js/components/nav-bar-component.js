import { LitElement, html, css } from "lit";
import "./nav-bar-navigational-items.js";
import "./nav-bar-separator.js";
import "./nav-provincie-utrecht-logo.js";

export class NavBar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      height: 90px;
      width: 100%;
      background-color: #ffffffff;
      border-bottom: 2px solid #ccc;
      font-family: sans-serif;
      position: relative;
      box-shadow: 0 2px 4px rgba(34, 34, 34, 0.5);
    }

    #nav-provincie-utrecht-logo {
    align-self: stretch;
    }
      
    #navigational-items {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    #navigational-items nav-bar-navigational-items {
      transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
    }

    #navigational-items:hover nav-bar-navigational-items {
      opacity: 0.5;
      filter: grayscale(100%);
    }

    #navigational-items nav-bar-navigational-items:hover {
      opacity: 1;
      filter: grayscale(0%);
      transform: scale(1.1);
    }

  `;

  render() {
    return html`
      <nav-provincie-utrecht-logo></nav-provincie-utrecht-logo>
        <div id="navigational-items">
          <nav-bar-navigational-items label="Resultaten" route="/resultaten"></nav-bar-navigational-items>
          <nav-bar-separator></nav-bar-separator>
          <nav-bar-navigational-items label="BOB-Game" route="/"></nav-bar-navigational-items>
        </div>
    `;
    }
}

customElements.define("nav-bar-component", NavBar);
