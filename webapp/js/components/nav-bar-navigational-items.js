import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";

export class NavBarItem extends LitElement {
  static properties = {
    label: { type: String },
    route: { type: String },
    active: { type: Boolean }
  };

  static styles = css`
    div {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.2s;
      font-size: 20px;
    }

    div {
        transition: transform 0.5s ease;
    }

    div:hover {
      transform: scale(1.1); 
    }
  `;

  navigateTo(path) {
    Router.go(path);
  }

  render() {
    return html`
      <div @click=${() => this.navigateTo(this.route)}>${this.label}</div>
    `;
  }
}

customElements.define("nav-bar-navigational-items", NavBarItem);