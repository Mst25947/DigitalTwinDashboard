import { LitElement, html, css } from "lit";
import { initDashboard } from "../../js/dashboard/dashboard.js";

export class ResultatenPage extends LitElement {
  static styles = css`
    /* Algemene stijlen */
    body { font-family: sans-serif; padding: 2rem; background-color: #f7f9fc; }
    pre { background: #e9ecef; padding: 1rem; border-radius: 5px; white-space: pre-wrap; overflow-x: auto; }
    .hidden { display: none !important; }
    select { padding: 0.5rem; margin-right: 1rem; border-radius: 5px; border: 1px solid #ced4da; }
    button { padding: 0.5rem 1rem; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer; transition: background-color 0.2s; }
    button:hover { background-color: #0056b3; }

    /* DASHBOARD LAYOUT */
    #dashboard-container {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }

    #sidebar {
      flex: 0 0 300px;
      background-color: white;
      padding: 15px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    #main-content {
      flex-grow: 1;
      background-color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    /* KPI Stijlen */
    #kpi-cards { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .kpi-card {
      padding: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      text-align: center;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .kpi-card h4 { margin: 0 0 5px 0; font-size: 0.9em; color: #6c757d; }
    .kpi-card p { font-size: 1.8em; font-weight: bold; margin: 0; }

    /* Accordeon Stijlen */
    .accordion-item {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 10px;
      overflow: hidden;
    }

    .accordion-header {
      background-color: #f8f9fa;
      padding: 15px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      color: #34495e;
      transition: background-color 0.2s;
    }

    .accordion-header:hover {
      background-color: #e9ecef;
    }

    .accordion-header .arrow {
      transition: transform 0.3s ease;
      font-size: 1.2em;
    }

    .accordion-header.active .arrow {
      transform: rotate(90deg);
    }

    .accordion-content {
      padding: 0 15px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out, padding 0.3s ease-out;
      background-color: #ffffff;
    }

    .accordion-content.open {
      max-height: 300px;
      padding: 15px;
    }

    .accordion-content p {
      margin-bottom: 5px;
      font-size: 0.9em;
      color: #555;
    }
    .accordion-content strong {
      color: #333;
    }
  `;

  firstUpdated() {
    initDashboard(this.shadowRoot);
  }

  render() {
    return html`
      <h1>Digital Twin Dashboard</h1>

      <h2 style="margin-bottom: 20px;">
        Gebruikte API code:
        <span id="displayToken" style="font-weight: normal; color: #dc3545; font-size: 0.8em;">(Nog niet geladen)</span>
      </h2>

      <div id="dashboard-container">

        <div id="sidebar">
          <input type="text" id="tokenInput" placeholder="Voer Tygron Token hier in">
          <button id="fetchBtn">Laad Ontwerp</button>
          <div id="loading" style="display: none; padding: 10px; text-align: center; color: #007bff; font-weight: bold;">Bezig met laden...</div>
          <div id="error" style="display: none; padding: 10px; text-align: center; color: #dc3545; font-weight: bold; border: 1px solid #dc3545; border-radius: 5px; margin-top: 10px;"></div>
          <div id="kpi-cards">
            
            <div class="kpi-card">
              <h4>Bebouwing (Fractie)</h4>
              <p id="kpi-building" style="color: #a55eea;">--</p>
            </div>
            <div class="kpi-card">
              <h4>Groen & Water (Totaal)</h4>
              <p id="kpi-green-water" style="color: #2ecc71;">--</p>
            </div>
            <div class="kpi-card">
              <h4>Vloeroppervlakte (Totaal)</h4>
              <p id="kpi-area" style="color: #e74c3c;">--</p>
            </div>
          </div>

          <h3>Details</h3>
          <div id="accordion">

            <div class="accordion-item">
              <div class="accordion-header" id="header-public-green">Publiek Groen & Tuinen <span class="arrow">></span></div>
              <div class="accordion-content" id="content-public-green">
                <p>Publiek Groen Fractie: <strong id="val-fraction-public-green">--</strong></p>
                <p>Tuin Fractie: <strong id="val-fraction-gardens">--</strong></p>
              </div>
            </div>

            <div class="accordion-item">
              <div class="accordion-header" id="header-roads">Wegen & Trottoir <span class="arrow">></span></div>
              <div class="accordion-content" id="content-roads">
                <p>Wegen Fractie: <strong id="val-fraction-roads">--</strong></p>
                <p>Weg Breedte: <strong id="val-road-width">--</strong></p>
                <p>Trottoir Breedte: <strong id="val-sidewalk-width">--</strong></p>
                <p>Weg Afstand Y-as: <strong id="val-road-distance-y">--</strong></p>
              </div>
            </div>

            <div class="accordion-item">
              <div class="accordion-header" id="header-water">Water <span class="arrow">></span></div>
              <div class="accordion-content" id="content-water">
                <p>Water Fractie: <strong id="val-fraction-water">--</strong></p>
                <p>Water Breedte: <strong id="val-water-width">--</strong></p>
              </div>
            </div>

            <div class="accordion-item">
              <div class="accordion-header" id="header-parking">Parkeerplaatsen <span class="arrow">></span></div>
              <div class="accordion-content" id="content-parking">
                <p>Parkeer Fractie: <strong id="val-fraction-parking">--</strong></p>
                <p>Parkeer Lengte: <strong id="val-parking-length">--</strong></p>
                <p>Parkeer Breedte: <strong id="val-parking-width">--</strong></p>
              </div>
            </div>

            <div class="accordion-item">
              <div class="accordion-header" id="header-building-details">Gebouw & Kavel Details <span class="arrow">></span></div>
              <div class="accordion-content" id="content-building-details">
                <p>Kavel 1: Totale vloeropp.: <strong id="val-total-area-1">--</strong> m²</p>
                <p>Kavel 2: Totale vloeropp.: <strong id="val-total-area-2">--</strong> m²</p>
                <p>Kavel 1: Aantal verdiepingen: <strong id="val-building-floors-1">--</strong></p>
                <p>Kavel 2: Aantal verdiepingen: <strong id="val-building-floors-2">--</strong></p>
                <p>Afstand tot weg: <strong id="val-building-road-distance">--</strong> m</p>
                <p>Achtertuin afstand: <strong id="val-backyard-distance">--</strong> m</p>
                <p>Fit Fractie (Kavel 1): <strong id="val-fit-fraction-1">--</strong></p>
                <p>Fit Fractie (Kavel 2): <strong id="val-fit-fraction-2">--</strong></p>
              </div>
            </div>

          </div>
        </div>

        <div id="main-content">
          <h3>Resultaten: Grondgebruik Verhoudingen</h3>
          <div style="max-width: 500px; margin: 0 auto;">
            <canvas id="landUseChart"></canvas>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("resultaten-page", ResultatenPage);