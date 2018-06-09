import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `p-d`
 * TBD
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PD extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'p-d',
      },
    };
  }
}

window.customElements.define('p-d', PD);
