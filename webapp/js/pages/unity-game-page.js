import {LitElement, html} from "lit";

class UnityGamePage extends LitElement{
    render() {
        return html`
            <style>
                div {
                    height: calc(100vh - var(--nav-bar-height, 60px));
                    width: 100%;
                }
                iframe{
                    height: 100%;
                    width: 100%;
                    border: none;
                }
            </style>
        <div>
            <iframe src="/index.html"></iframe>
        </div>
        `
    }
}

customElements.define('unity-game-page', UnityGamePage)