import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./esphome-logo";

import "./my-canvas-display";
import "./my-section";

@customElement("my-app")
export class MyApp extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        height: 100vh;
        margin: 0;
        padding: 0;
        font-family: "Wendy";
        font-size: 1.5em;
      }

      .screen-container {
        margin: 20px;
        text-align: center;
      }

      .col1 {
      }

      .container {
        display: flex;
        /* flex-flow: column; */
        flex-direction: column;
        height: 100%;
      }

      .second-row {
        /* flex:1 1 auto; */
        flex-grow: 1;
      }

      .second-row-container {
        display: flex;
        height: 100%;
      }
      .col1 {
        /* flex:0 1 auto; */
        flex-grow: 0;
        align-self: auto;
      }

      .col2 {
        /* flex:1 1 auto; */
        flex-grow: 1;
        align-self: auto;
      }

      .second-col-container {
        display: flex;

        /* flex-flow: column; */
        flex-direction: column;
        height: 100%;
      }

      .second-col-container .row1 {
        /* flex:1 1 auto; */
        flex-grow: 1;
        align-self: auto;
      }

      .second-col-container .row2 {
        /* flex:0 1 auto; */
        flex-grow: 0;
        align-self: stretch;
      }
      .header {
        text-align: left;
        font-size: 2em;
        margin: 0;
        padding: 0px;
        line-height: 80px;
        vertical-align: middle;
      }
      .logo,
      .title {
        display: inline-block;
      }
      .logo {
        margin-top: auto;

        align-items: center;
      }
      @media (prefers-color-scheme: dark) {
        .header {
          /* dark mode variables go here */
          background-color: #555555;
        }
        .col1,
        .col3 {
          background-color: #222222;
        }
      }
      h2 {
        text-decoration: underline;
      }
    `,
  ];

  @property({ type: Number })
  screenWidth: number = 128;

  @property({ type: Number })
  screenHeight: number = 64;

  @property({ type: Boolean })
  showGrid: boolean = true;

  @property({ type: Number })
  canvasGridWidth: number = 2;

  @property({ type: Number })
  canvasScale: number = 5;

  connectedCallback(): void {
    super.connectedCallback();
  }

  handleInitCanvas() {
    console.log("init-canvas");
  }

  handleDrawingUpdate() {
    console.log("drawing-update");
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    document.documentElement.style.setProperty("color-scheme", "dark");
  }

  render() {
    return html`
      <div class="container two-rows-row">
        <div class="first-row header">
          <div class="title">WASM display renderer</div>
        </div>
        <div class="second-row">
          <div class="second-row-container three-cols-row">
            <div class="col1">
              <div class="screen-settings-container">
                <my-section class="settings">
                  <span slot="title">Screen settings</span>
                  <div>
                    <label for="screenwidth">Display Width</label>
                    <input
                      id="screenwidth"
                      type="number"
                      min="1"
                      value="${this.screenWidth}"
                      @change="${(e: Event) => {
                        this.screenWidth = parseInt(
                          (e.target as HTMLInputElement).value,
                          10
                        );
                      }}"
                    />
                  </div>
                  <div>
                    <label for="screenwidth">Display Height</label>
                    <input
                      id="screenheight"
                      type="number"
                      min="1"
                      value="${this.screenHeight}"
                      @change="${(e: Event) => {
                        this.screenHeight = parseInt(
                          (e.target as HTMLInputElement).value,
                          10
                        );
                      }}"
                    />
                  </div>
                  <div>
                    <label for="showgrid">Show grid</label>
                    <input
                      id="showgrid"
                      type="checkbox"
                      .checked="${this.showGrid}"
                      @change="${(e: Event) =>
                        (this.showGrid = (
                          e.target as HTMLInputElement
                        ).checked)}"
                    />
                  </div>
                  <div>
                    <label for="gridwidth">Grid Width</label>
                    <input
                      id="gridwidth"
                      type="number"
                      min="1"
                      value="${this.canvasGridWidth}"
                      @change="${(e: Event) => {
                        this.canvasGridWidth = parseInt(
                          (e.target as HTMLInputElement).value,
                          10
                        );
                      }}"
                    />
                  </div>
                  <div>
                    <label for="gridwidth">Pixel Scale</label>
                    <input
                      id="pixelscale"
                      type="number"
                      min="1"
                      value="${this.canvasScale}"
                      @change="${(e: Event) => {
                        this.canvasScale = parseInt(
                          (e.target as HTMLInputElement).value,
                          10
                        );
                      }}"
                    />
                  </div>
                </my-section>
              </div>
            </div>
            <div class="col2 second-col-container two-rows-col">
              <div class="row1 screen-container">
                <my-canvas-display
                  .displayWidth="${this.screenWidth}"
                  .displayHeight="${this.screenHeight}"
                  .canvasGridWidth="${this.canvasGridWidth}"
                  .canvasScale="${this.canvasScale}"
                  .showGrid="${this.showGrid}"
                  @init-canvas="${this.handleInitCanvas}"
                  @drawing-update="${this.handleDrawingUpdate}"
                ></my-canvas-display>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
  }
}
