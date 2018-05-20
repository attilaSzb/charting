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
import '../shared-styles.js';
import {Services} from "../services.js"

class DemographyChart extends PolymerElement {
  _reDrawChart(rawData) {
    const data = google.visualization.arrayToDataTable(rawData);
    //
    let options = {
      title: 'Age demography',
      hAxis: {title: '', titleTextStyle: {color: 'red'}}
    };

    let chart = new google.visualization.BarChart(this.$.chart);
    chart.draw(data, options);
  }

  _stateListChanged() {
    let rawData = this.initialData.slice(1, this.initialData.length).filter((item) => this.filteredStates.some(state => state === item[0]));
    rawData.unshift(this.initialData[0]);
    this._reDrawChart(rawData);
  }

  ready() {
    super.ready();

    (new Services().request('data/population.csv')).then((rawData) => {
      this.loading = false;
      this.initialData = rawData;

      google.charts.load('current', {packages: ['corechart']});

      google.charts.setOnLoadCallback(() => {
        this._reDrawChart(rawData);
      });
    });

    // $(window).resize(function(){
    //   drawChart1();
    // });
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div class="cart">
        <div id="chart" hidden="[[loading]]"></div>
      </div>
     
    </google-chart>
    `;
  }

  static get properties() {
    return {
      filteredStates: {
        type: Array,
        observer: '_stateListChanged'
      }
    };
  }
}

window.customElements.define('demography-chart', DemographyChart);
