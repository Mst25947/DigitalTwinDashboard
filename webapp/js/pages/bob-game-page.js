import { LitElement, html, css } from "lit";

export class BobGamePage extends LitElement {
  static styles = css`
    h2 {
      color: #2a2a2a;
      font-family: sans-serif;
      text-align: center;
    }
  `;

  render() {
    return html`<h2>BOB-Game Page</h2>`;
  }
}

customElements.define("bob-game-page", BobGamePage);