// Starting point of the app: loads the data, builds the map, and gives
// every part the same event bus so they can talk to each other.
// Based on the Week 6 dom_manipulation main.js. Initial coding done by
// self, with explanations and debugging help from Claude and ChatGPT.
import { loadCcaData } from './data.js';
import { initMap } from './map.js';

// The event bus that parts of the app use to send messages (Week 6).
const events = new EventTarget();

// Loads and cleans the community area data (waits until it's ready).
const { areas, cityTotals } = await loadCcaData();

// Builds the map inside the #map box on the page.
const map = initMap(document.querySelector('#map'), areas, events);

// Lets me inspect these in the browser console while debugging (Week 4/6).
Object.assign(window, { areas, cityTotals, map, events });