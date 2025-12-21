import { LitElement, html, css } from "lit";
import { initDashboard } from "../../js/dashboard/dashboard.js";

export class ResultatenPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* HEADER */
    header {
      background-color: #dcdcdc;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .brand {
      font-size: 1.2rem;
      font-weight: bold;
      color: #333;
      display: flex;
      align-items: center;
      gap: 10px;
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

    /* GRID LAYOUT */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Twee gelijke kolommen */
      grid-template-rows: auto auto;
      gap: 20px;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* CARDS */
    .card {
      background: white;
      border-radius: 8px; /* Iets rondere hoeken */
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

    /* TABLE LAYOUT (BOB-INPUT) */
    .data-table {
      width: 100%;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    .data-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .data-row:last-child { border-bottom: none; }
    .data-label { text-align: left; }
    .data-value { text-align: right; font-weight: bold; }

    /* CHART SECTION */
    .chart-container {
      grid-column: 1 / -1; 
      max-width: 600px; 
    }

    /* RIGHT COLUMN (Placeholder BGR) */
    .bgr-content {
      margin-top: 20px;
      font-weight: bold;
    }

    .loading-msg { color: #007bff; font-weight: bold; margin-left: 10px; display: none; }
  `;

  firstUpdated() {
    initDashboard(this.shadowRoot);
  }

  render() {
    return html`


      <div class="controls">
        <input type="text" id="tokenInput" placeholder="Tygron Token">
        <input type="text" id="sessionInput" placeholder="Bobgame Code">
        <button id="fetchBtn">Laad Ontwerp</button>
        <button id="excelBtn">Export Excel</button>
        <span id="loading" class="loading-msg">Laden...</span>
        <span id="displayToken" style="font-size: 0.8em; color: #999; margin-left: auto;"></span>
      </div>

      <div class="dashboard-grid">

        <div class="card">
          <div class="card-title">BOB-Input</div>
          <div class="card-subtitle">Huidige verdeling van het ontwerp</div>

          <div class="data-table">
            <div class="data-row" style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
              <span></span>
              <span>Gemiddeld:</span>
            </div>

            <div class="data-row">
              <span class="data-label">Straat & Stoep:</span>
              <span class="data-value" id="val-roads">--</span>
            </div>
            <div class="data-row">
              <span class="data-label">Wooneenheden:</span>
              <span class="data-value" id="val-buildings">--</span>
            </div>
            <div class="data-row">
              <span class="data-label">Parkeren:</span>
              <span class="data-value" id="val-parking">--</span>
            </div>
            <div class="data-row">
              <span class="data-label">Tuin prive:</span>
              <span class="data-value" id="val-gardens">--</span>
            </div>
            <div class="data-row">
              <span class="data-label">Groen publiek:</span>
              <span class="data-value" id="val-public-green">--</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Participatie Data</div>
          <div class="card-subtitle">Live data uit de sessie</div>

          <div class="data-table">
            <div class="data-row" style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
              <span></span><span>Resultaat:</span>
            </div>

<!--            <div class="data-row">-->
<!--              <span class="data-label">Gemiddeld Draagvlak:</span>-->
<!--              <span class="data-value" id="unity-draagvlak" style="color: #27ae60;">&#45;&#45;</span>-->
<!--            </div>-->
<!--            <div class="data-row">-->
<!--              <span class="data-label">Behaald Doel:</span>-->
<!--              <span class="data-value" id="unity-doel">&#45;&#45;</span>-->
<!--            </div>-->
<!--            <div class="data-row">-->
<!--              <span class="data-label">Budget Benut:</span>-->
<!--              <span class="data-value" id="unity-budget">&#45;&#45;</span>-->
<!--            </div>-->

            <div class="sub-header">Draagvlak per partij:</div>
            <div class="data-row"><span class="data-label">Partij 1:</span><span class="data-value" id="unity-partij1">--</span></div>
            <div class="data-row"><span class="data-label">Partij 2:</span><span class="data-value" id="unity-partij2">--</span></div>
            <div class="data-row"><span class="data-label">Partij 3:</span><span class="data-value" id="unity-partij3">--</span></div>
            <div class="data-row"><span class="data-label">Partij 4:</span><span class="data-value" id="unity-partij4">--</span></div>

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