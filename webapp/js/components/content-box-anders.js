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

    ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}
    li {
        margin-bottom: 8px;
        font-size: 16px;
    }
        

  #title {
        font-weight: bold;
        font-size: 24px;
        margin-bottom: 10px;
    }
        #cats {
        font-size: 20px;
        font-weight: bold;
}
          #desc {
        font-size: 16px;
        margin-bottom: 15px;
    }
  `;


    render() {
        return html`
      <div id="content-box">
      <p id="title">BOB-Input</p>
      <p id="desc">In de onderstaande lijst staan de verschillende categorieën die in de BOB-tool worden meegenomen voor de analyse van het geselecteerde gebied:</p>
      <ul>
        <p id="cats">Categorieën:</p>
        <li>Straat & Stoep</li>
        <li>Wooneenheden</li>
        <li>Parkeren</li>
        <li>Tuin prive </li>
        <li>Groen publiek </li>
      </ul>
      </div>
    `;
    }
}

customElements.define("content-box-anders-component", ContentBoxAnders);