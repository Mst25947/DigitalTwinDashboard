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
      img {
        height: 20em;
        width: auto;
        object-fit: contain;
      }

      :host,
      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `;
  }
}

customElements.define("nav-provincie-utrecht-logo", ProvincieUtrechtLogo);
