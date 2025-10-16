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
    return html`<iframe src="https://www.goedbeslissen.nl/" width="100%" height="800px" style="border:none;"></iframe>`;
  }
}

customElements.define("bob-game-page", BobGamePage);