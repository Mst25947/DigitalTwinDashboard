import { LitElement, html, css } from "lit";
import provincieUtrechtLogo from "../../img/provincie_utrecht.png";

export class ProvincieUtrechtLogo extends LitElement {
  static properties = {
    src: { type: String },
    alt: { type: String },
    href: { type: String },
  };

  constructor() {
    super();
    this.src = provincieUtrechtLogo;
    this.alt = "Provincie Utrecht Logo";
    this.href = "./";
  }

  render() {
    return html`
        <img src="${this.src}" alt="${this.alt}" />
    `;
  }

  static get styles() {
    return css`
      :host {
  height: 90px;      
  display: flex;
  align-items: center;
}

img {
  height: 60px;       
  max-height: 100%;
  width: auto;
  object-fit: contain;
}
    `;
  }
}

customElements.define("nav-provincie-utrecht-logo", ProvincieUtrechtLogo);
