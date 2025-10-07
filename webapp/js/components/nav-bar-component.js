import { LitElement, html, css } from "lit";

export class NavBar extends LitElement {
  static styles = css`
    h1 {
      color: blue;
      font-family: sans-serif;
    }
  `;

  render() {
    return html`<h1>test</h1>`;
  }
}

customElements.define("nav-bar-component", NavBar);
