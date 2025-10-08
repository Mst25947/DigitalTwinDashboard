import { LitElement, html, css } from "lit";

export class NavBarSeparator extends LitElement {
  static styles = css`
    div {
      width: 2px;   
      height: 20px;       
      background-color: #000000; 
      border-radius: 2px;    
    }
  `;

  render() {
    return html`<div></div>`;
  }
}

customElements.define("nav-bar-separator", NavBarSeparator);
