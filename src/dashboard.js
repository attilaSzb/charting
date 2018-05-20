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
import './charts/demography-chart.js';
import './charts/workforce-chart.js';

class Dashboard extends PolymerElement {
  ready(){
    super.ready()
    this.selected = 0;
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <h1>Dashboard</h1>
      <div class="card">
          <h2>Filter by state</h2>
          <state-searchbox filtered-states="{{filteredStatesList}}"></state-searchbox>
      </div>   
        
      <div class="card">  
        <paper-tabs selected="{{selected}}">
          <paper-tab link>
            <a href="#link1" class="link" tabindex="-1">Demography</a>
          </paper-tab>
          <paper-tab link>
            <a href="#link2" class="link" tabindex="-1">Workforce</a>
          </paper-tab>
        </paper-tabs>
  
        <iron-pages selected="{{selected}}" role="main">
          <demography-chart filtered-states="[[filteredStatesList]]"></demography-chart>
          <workforce-chart filtered-states="[[filteredStatesList]]"></workforce-chart>
        </iron-pages> 
      </div>
    `;
  }

  static get properties() {
    return {
      filteredStatesList: {
        type: Array
      }
    };
  }
}

window.customElements.define('my-dashboard', Dashboard);
