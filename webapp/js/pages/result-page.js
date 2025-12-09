import { LitElement, html, css } from "lit";
import { initDashboard } from "../../js/dashboard/dashboard.js";
import "../components/content-box-indicators-component.js";
import "../components/content-box-anders.js";

export class ResultPage extends LitElement {
  static styles = css`
    #dashboard-container {
      display: Grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 20px;
    }
  `;

  firstUpdated() {
    initDashboard(this.shadowRoot);
  }


  render() {
    return html`
    <div id="dashboard-container">
        <content-box-anders-component></content-box-anders-component>
        <content-box-anders-component></content-box-anders-component>
        <content-box-indicators-component></content-box-indicators-component>
        <content-box-anders-component></content-box-anders-component>
    </div>
    `;
  }
}

customElements.define("result-page", ResultPage);