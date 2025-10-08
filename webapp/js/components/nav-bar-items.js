import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";

export class NavBarItem extends LitElement {
  static properties = {
    label: { type: String },
    route: { type: String },
  };

  static styles = css`
    div {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.2s;
    }
    div:hover {
      background: #eef;
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

customElements.define("nav-bar-items", NavBarItem);