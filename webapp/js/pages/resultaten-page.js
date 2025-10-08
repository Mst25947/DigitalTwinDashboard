import { LitElement, html, css } from "lit";

export class ResultatenPage extends LitElement {
  static styles = css`
    h2 {
      color: #2a2a2a;
      font-family: sans-serif;
      text-align: center;
    }
  `;

  render() {
    return html`<h2>Resultaten Page</h2>`;
  }
}

customElements.define("resultaten-page", ResultatenPage);