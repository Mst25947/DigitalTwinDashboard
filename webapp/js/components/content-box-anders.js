import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";

export class ContentBoxAnders extends LitElement {
    static properties = {
        label: { type: String },
        route: { type: String },
        active: { type: Boolean }
    };

    static styles = css`
    #content-box {
        background-color: rgba(255, 255, 255, 0.85);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #ddd;
        min-height: 150px;
        font-size: 20px;
        flex-direction: column;
        gap: 10px; 
    }
  `;


    render() {
        return html`
      <div id="content-box"></div>
    `;
    }
}

customElements.define("content-box-anders-component", ContentBoxAnders);