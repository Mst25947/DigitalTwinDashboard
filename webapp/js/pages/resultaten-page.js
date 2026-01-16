import { LitElement, html, css } from "lit";
import { initDashboard } from "../../js/dashboard/dashboard.js";

// 1. HIER IMPORTEREN WE DE PLAATJES (Net als je logo)
// De build-tool zorgt dat deze paden altijd kloppen
import defaultImg from "../../img/default.png";
import happyImg from "../../img/happy.png";
import sadImg from "../../img/sad.png";

export class ResultatenPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .status-icon {
      height: 24px;
      width: 24px;
      object-fit: contain;
      vertical-align: middle;
      margin-right: 10px;
      transition: filter 0.3s ease;
    }

    .value-container {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }


   

    /* STATUS TEKST KLEUREN */
    .status-green { color: #2ecc71; font-weight: bold; }
    .status-orange { color: #f39c12; font-weight: bold; }
    .status-red { color: #e74c3c; font-weight: bold; }

    /* HEADER & ALGEMEEN */
    header {
      background-color: #dcdcdc;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .controls {
      background: white;
      padding: 10px 20px;
      display: flex;
      gap: 10px;
      border-bottom: 1px solid #ccc;
    }
    input { padding: 5px; border: 1px solid #ccc; border-radius: 4px; }
    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    #fetchBtn { background-color: #333; color: white; }
    #excelBtn { background-color: #217346; color: white; }

    /* GRID & CARDS */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 20px;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 20px;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .card-title {
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 5px;
      color: #000;
    }
    .card-subtitle {
      text-align: center;
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 20px;
    }

    /* TABLE LAYOUT */
    .data-table {
      width: 100%;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .data-row:last-child { border-bottom: none; }
    .data-label { text-align: left; }

    .loading-msg { color: #007bff; font-weight: bold; margin-left: 10px; display: none; }
  `;

  firstUpdated() {
    // 2. We geven de afbeelding-variabelen mee aan het script
    initDashboard(this.shadowRoot, { defaultImg, happyImg, sadImg });
  }

  render() {
    return html`
      <div class="controls">
        <input type="text" id="tokenInput" placeholder="Tygron Token">
        <input type="text" id="sessionInput" placeholder="Bobgame Code">
        <button id="fetchBtn">Laad Ontwerp</button>
        <button id="excelBtn">Export Excel</button>
        <span id="loading" class="loading-msg">Laden...</span>
      </div>

      <div class="dashboard-grid">

        <div class="card">
          <div class="card-title">BOB-Input</div>
          <div class="card-subtitle">Huidige verdeling van het ontwerp</div>
          <div class="data-table">
            <div class="data-row" style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
              <span></span><span>Gemiddeld:</span>
            </div>
            <div class="data-row"><span class="data-label">Straat & Stoep:</span><span class="data-value" id="val-roads">--</span></div>
            <div class="data-row"><span class="data-label">Wooneenheden:</span><span class="data-value" id="val-buildings">--</span></div>
            <div class="data-row"><span class="data-label">Parkeren:</span><span class="data-value" id="val-parking">--</span></div>
            <div class="data-row"><span class="data-label">Tuin prive:</span><span class="data-value" id="val-gardens">--</span></div>
            <div class="data-row"><span class="data-label">Groen publiek:</span><span class="data-value" id="val-public-green">--</span></div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Participatie Data</div>
          <div class="card-subtitle">Live data uit de sessie</div>

          <div class="data-table">
            <div class="data-row" style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
              <span></span><span>Resultaat:</span>
            </div>

            <div class="sub-header">Draagvlak per partij:</div>

            <div class="data-row">
              <span class="data-label">Partij 1:</span>
              <div class="value-container">
                <img id="img-partij1" src="${defaultImg}" class="status-icon" alt="" />
                <span class="data-value" id="unity-partij1">--</span>
              </div>
            </div>

            <div class="data-row">
              <span class="data-label">Partij 2:</span>
              <div class="value-container">
                <img id="img-partij2" src="${defaultImg}" class="status-icon" alt="" />
                <span class="data-value" id="unity-partij2">--</span>
              </div>
            </div>

            <div class="data-row">
              <span class="data-label">Partij 3:</span>
              <div class="value-container">
                <img id="img-partij3" src="${defaultImg}" class="status-icon" alt="" />
                <span class="data-value" id="unity-partij3">--</span>
              </div>
            </div>

            <div class="data-row">
              <span class="data-label">Partij 4:</span>
              <div class="value-container">
                <img id="img-partij4" src="${defaultImg}" class="status-icon" alt="" />
                <span class="data-value" id="unity-partij4">--</span>
              </div>
            </div>

          </div>
        </div>

        <div class="card">
          <div class="card-title">GGO-Resultaten</div>
          <div style="position: relative; height: 300px; width: 100%;">
            <canvas id="landUseChart"></canvas>
          </div>
        </div>

      </div>
    `;
  }
}

customElements.define("resultaten-page", ResultatenPage);