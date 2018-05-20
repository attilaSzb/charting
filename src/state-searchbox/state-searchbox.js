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
import {fromEvent} from 'rxjs';
import {map, filter} from 'rxjs/operators';
import {Services} from "../services.js"
import '../shared-styles.js';

class StateSearchBox extends PolymerElement {
  constructor() {
    super();
  }

  ready() {
    super.ready();

    // get states data
    (new Services().request('data/states.json')).then((data) => {
      this.loading = false;
      this.stateData = Object.keys(data).map((key) => { return { code: key, name: data[key]}});
    });

    // listen to search
    fromEvent(this.$.searchInput, 'keyup')
        .pipe(map(event => this.$.searchInput.$.input.value))
        .pipe(filter(val => val.length > 0))
        .subscribe(val => {
          if(val) {
            this.filteredStatesView = this.stateData.filter((state) => state.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
            this.filteredStates = this.filteredStatesView.map(item => item.code);
            console.log(this.filteredStates);
          } else {
            this.filteredStates = [];
          }
        });
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>
        <div hidden="[[loading]]">  
            <paper-input 
                type="text"
                id="searchInput"
                always-float-label 
                label="Filter by State">
            </paper-input>
        </div>
    `;
  }

  static get properties() {
    return {
      filteredStates: {
        type: Array,
        notify: true
      },

      filteredStatesView: {
        type: Array
      }
    };
  }
}

window.customElements.define('state-searchbox', StateSearchBox);
