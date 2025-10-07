import { LitElement, html, css } from "lit";

export class NavBarItem extends LitElement {
  static properties = {
    label: { type: String },
  };

  static styles = css`
    div {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 8px;
      font-family: sans-serif;
      transition: background 0.2s ease;
    }
      
    div:hover {
      background: #eef;
    }
  `;

  render() {
    return html`<div>${this.label}</div>`;
  }
}

customElements.define("nav-bar-items", NavBarItem);
