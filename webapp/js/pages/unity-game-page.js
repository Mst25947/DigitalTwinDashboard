import { LitElement, html, css } from "lit";

class UnityGamePage extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: calc(100vh - var(--nav-bar-height, 60px));
    }

    .container {
      height: 100%;
      width: 100%;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  `;

  render() {
    return html`
      <div class="container">
        <iframe src="/TestBuild/index.html"></iframe>
      </div>
    `;
  }
}

customElements.define("unity-game-page", UnityGamePage);
