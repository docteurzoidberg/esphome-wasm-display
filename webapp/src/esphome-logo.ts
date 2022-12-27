import { html, LitElement, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("esphome-logo")
export default class ESPHomeLogo extends LitElement {
  static styles = css`
    :root {
    }
  `;

  render() {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="7 8 73 56"
      width="73"
      height="56"
    >
      <g
        style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"
      >
        <g id="b">
          <path d="M27 16v-4c0-1 1-2.7 2-2.7 2 0 3 1.7 3 2.7v4" id="a" />
          <use x="9" href="#a" />
          <use x="18" href="#a" />
          <use x="27" href="#a" />
          <use x="36" href="#a" />
          <use x="45" href="#a" />
        </g>
        <use transform="matrix(1 0 0 -1 0 72)" href="#b" />
        <path
          d="M78 16H26c-1 0-1 1-1 1v38c0 1 0 1 1 1h52c1 0 1 0 1-1V17s0-1-1-1z"
          class="box"
        />
        <path
          d="M40 38h2.9v7.8h17V38h2.9l-2.9-2.9V30h-1.8v3.3l-6.8-6.8z"
          class="home"
          fill="currentColor"
        />
        <path d="M24 54H8v-4h12v-4H8v-4h12v-4H8v-4h12v-4H8V18" class="aerial" />
      </g>
    </svg>`;
  }
}
