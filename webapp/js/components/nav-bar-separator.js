import { LitElement, html, css } from "lit";

export class NavBarSeparator extends LitElement {
  static styles = css`
    div {
      width: 2px;             /* thickness of the line */
      height: 20px;           /* height of the separator */
      background-color: #aaa; /* color of the line */
      border-radius: 2px;     /* smooth edges */
    }
  `;

  render() {
    return html`<div></div>`;
  }
}

customElements.define("nav-bar-separator", NavBarSeparator);
