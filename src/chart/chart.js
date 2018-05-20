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
import {fromEvent, timer} from 'rxjs';
import {debounce} from 'rxjs/operators';
import '../shared-styles.js';
import {Services} from "../services.js"

class Chart extends PolymerElement {
  _reDrawChart(chartData) {
    // this timeout needed in order to wait till the tab is drawn so the width can be picked up by the chart engine
    setTimeout(() => {
      const data = google.visualization.arrayToDataTable(this.headerData.concat(chartData));
      //
      let options = {
        legend: { position: (document.body.getBoundingClientRect().width > 960 ? 'right' : 'none') },
        chart: { },
        bars: 'horizontal', // Required for Material Bar Charts.
        axes: {
          x: {
            0: { side: 'top', label: this.xLabel} // Top x-axis.
          },
          y: {
            0: { side: 'top', label: ''} // Top x-axis.
          }
        },
        height: (chartData.length + 1) * 100,
      };

      let chart = new google.charts.Bar(this.$.chart);
      chart.draw(data, options);

      this.chartDataResizeCashe = chartData;
    }, 10);
  }

  _activeChanged() {
    if (this.active) {
      if (this.initialData) {
        this._stateListChanged();
      } else {
        this._statesLoaded();
      }
    }
  }

  _stateListChanged() {
    let filteredData;

    if (this.active) {
      if (this.filteredStates && this.filteredStates.length) {
        filteredData = this.initialData.filter((item) => this.filteredStates.some(state => state === item[0]));
      } else {
        filteredData = this.initialData;
      }

      if (filteredData.length) {
        this._reDrawChart(filteredData);
      }
    }
  }

  _prettifyStateNames(rawData) {
    return rawData.map((item) => {
      // assuming each states are in the states list
      item[0] = this.allStates.find(state => item[0] === state.code).name;
      return item;
    });
  }

  _statesLoaded() {
    if (this.allStates.length) {
      (new Services().request(this.dataSrc, true)).then((chartData) => {
        this.headerData = [chartData[0]];
        this.initialData = this._prettifyStateNames(chartData.slice(1, chartData.length));

        google.charts.load('current', { packages: ['bar'] });

        //todo: this can be optimized to not be loaded twice
        google.charts.setOnLoadCallback(() => {
          if (this.active) {
            this._reDrawChart(this.initialData);
          }
        });
      });
    }
  }

  ready() {
    super.ready();

    fromEvent(window, 'resize')
      .pipe(debounce(() => timer(200)))
      .subscribe(() => {
        if (this.chartDataResizeCashe) {
          if (this.active) {
            this._reDrawChart(this.chartDataResizeCashe)
          }
        }
      });
  };


  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
      </style>
     
      <div id="chart"></div>
    `;
  }

  static get properties() {
    return {
      filteredStates: {
        type: Array,
        observer: '_stateListChanged'
      },

      allStates: {
        type: Array,
        observer: '_statesLoaded'
      },

      dataSrc: {
        type: String
      },

      title: {
        type: String
      },

      active: {
        type: Boolean,
        observer: '_activeChanged'
      },

      xLabel: {
        type: String,
      }
    };
  }
}

window.customElements.define('us-chart', Chart);
