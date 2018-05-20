/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import './state-searchbox/state-searchbox.js';
import './chart/chart.js';
import {Services} from "./services.js";

class Dashboard extends PolymerElement {
  ready() {
    super.ready();
    this.selected = 0;

    (new Services().request('data/states.json')).then((data) => {
      this.allStates = Object.keys(data).map((key) => {
        return { code: key, name: data[key] }
      });
    });
  }

  setSelected(event) {
    console.log(event)
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div class="card">  
        <state-searchbox all-states="[[allStates]]" filtered-states="{{filteredStates}}"></state-searchbox>
        <paper-tabs selected="{{selected}}">
          <paper-tab>Age Demography</paper-tab>
          <paper-tab>Workforce distribution</paper-tab>
        </paper-tabs>   
        <iron-pages selected="{{selected}}">
          <us-chart 
            x-label="Population"
            active="{{!selected}}" 
            data-src="data/population.csv"
            all-states="[[allStates]]"
            filtered-states="[[filteredStates]]">
          </us-chart>
          <us-chart 
            x-label="Ocupational percentage"
            active="{{selected}}"
            data-src="data/jobs.json"
            all-states="[[allStates]]"
            filtered-states="[[filteredStates]]">
          </us-chart>
        </iron-pages> 
      </div>
    `;
  }

  static get properties() {
    return {
      filteredStates: {
        type: Array
      },

      allStates: {
        type: Array,
        value: []
      },

      selected: {
        type:Boolean
      }
    };
  }
}

window.customElements.define('my-dashboard', Dashboard);
