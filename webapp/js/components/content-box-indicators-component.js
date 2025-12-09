import { LitElement, html, css } from "lit";
import { Router } from "@vaadin/router";

export class ContentBoxIndicators extends LitElement {
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
        min-height: 150px; /* Controls the height */
        font-size: 20px;
        flex-direction: column; /* Alles netjes onder elkaar */
        gap: 10px; /* Ruimte tussen onderdelen */
    }

    #title {
        font-weight: bold;
        font-size: 24px;
        margin-bottom: 10px;
    }

    #desc {
        font-size: 16px;
        margin-bottom: 15px;
    }

    #indc {
        font-size: 10px;
        
    }

    #dropdown {
        font-size: 16px;
        padding: 6px 10px;
        border-radius: 6px;
    }

    #title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
  `;


    render() {
        return html`
      <div id="content-box">
      <div id="title-row">
        <p id="title">GGO-Lite resultaten</p>
        <select id="dropdown" title="Selecteer een van de voorgaande scenario's">
            <option value="Scenario 1">Scenario 1</option>
            <option value="Scenario 2">Scenario 2</option>
            <option value="Scenario 3">Scenario 3</option>
        </select>
        </div>
        <p id="desc">Hieronder ziet u een overzicht van de belangrijkste indicatoren uit de GGO-Lite analyse voor het geselecteerde gebied. Deze waarden geven inzicht in de impact, prestaties en samenstelling van de onderzochte scenario’s.</p>
        <img src="https://help.qlik.com/nl-NL/cloud-services/Subsystems/Hub/Content/Resources/Images/ui_gen_BarChart.png" id="indc" alt="GGO-lite resultaten"></img>
      </div>
    `;
    }
}

customElements.define("content-box-indicators-component", ContentBoxIndicators);