// starts the app: loads the data, then builds the side panel and the map
// set up the same way as the Week 6 dom_manipulation lecture example (main.js):
// one event bus shared by every part, data loaded with await, then each part
// created with document.querySelector and its init function.
import { initControls } from './controls.js';
import { initMap } from './map.js';
import { loadCcaData } from './data.js';

/*
Custom event types:
~~~~~~~~~~~~~~~~~~~
- categorychanged: emitted when a business type button is clicked in the panel.
  Detail: {
    categoryKey (string): key of the business type, e.g. 'all'
  }
- areaselected: emitted when a community area is clicked on the map or in the list.
  Detail: {
    areaNumber: area number of the community area
    fromList (boolean): whether it was picked from the list (the map zooms to it)
  }
*/
const events = new EventTarget();

// Load community area data...
const { areas, cityTotals } = await loadCcaData();

// Create the side panel controls...
const controlsEl = document.querySelector('.controls');
initControls(controlsEl, areas, events);

// Create the map (with its legend, help text and chart boxes)...
const mapEl = document.querySelector('#map');
const map = initMap(mapEl, areas, events);

// Expose the data and map to the global scope for easier debugging
// in the console (Week 6 data_in_js example)...
Object.assign(window, { areas, cityTotals, map, events });