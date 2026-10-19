// importing required information from data.js (where the analysis is)
// importing colors for the maps to be displayed
// Claude and ChatGPT explained what needs to be done. Initial coding done by self, with explanations,
//I had to reuse claude to find out how to exactly use grid-column, grid-rows etc
// cleaning and debugging and suggesting what needs to be done is by Claude and ChatGPT both.
import { getCategory } from './data.js';
import { getClasses, getColor, getValue } from './colors.js';

// comes from week 6 code
// builds the map and remembers which business
// type and community area the user has picked
function initMap(el, areas, events) {
  let category = getCategory('all');
  let selectedAreaNumber = null;

  // creating a Leaflet map inside el and allowing zoom levels between whole numbers for a smoother experience
  const map = L.map(el, { zoomSnap: 0 });

  // adding a dark gray background map, setting the maximum zoom to 16 (the
  // deepest zoom this Esri basemap has tiles for) - also got this from Claude
  // for the story maps assignment
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 22,
  opacity: 0.8, // lets the warm gray page color show through so the map matches the panel
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
}).addTo(map);

  // Based on the Week 2 calcFeatureStyle function and the Week 3 choropleth style exercise
  // This function colors each area based on the selected business category, makes the fill
  // 75% opaque, and gives the selected area a thick black border while other areas have thin
  // gray borders.
  function styleArea(feature) {
    const isSelected = feature.properties.area_numbe === selectedAreaNumber;
    return {
      fillColor: getColor(feature.properties, category),
      fillOpacity: 0.75,
      color: isSelected ? '#494440' : '#494440',
      weight: isSelected ? 4 : 1,
    };
  }

  // now bringing all 77 areas of Chicago onto the map
  const areasLayer = L.geoJSON(areas, { style: styleArea }).addTo(map);

  // Shows the area's name and value when you hover over it.
  // Based on the Week 4 and Week 6 bindTooltip examples.
  areasLayer.bindTooltip((layer) => {
    const props = layer.feature.properties;
    const value = getValue(props, category);
    const valueText = category.key === 'all' ?
      `${value.toFixed(1)} licenses per 1,000 residents` :
      `${value.toFixed(2)}x the citywide share`;
    return `<strong>${props.name}</strong><br>${valueText}`;
  });

  // Zooms the map to fit all of Chicago (Week 4 and Week 6 fitBounds).
  map.setView([41.84, -87.65], 10.8);

  // When an area is clicked, tells the rest of the app which one was picked.
  // Based on the Week 6 dom_manipulation CustomEvent and event bus.
  areasLayer.on('click', (evt) => {
    const areaNumber = evt.layer.feature.properties.area_numbe;
    const event = new CustomEvent('areaselected', {
      detail: { areaNumber, fromList: false },
    });
    events.dispatchEvent(event);
  });

  // working on the legend now
  // keeping reference to its div to rewrite with changing category
  const legend = L.control({ position: 'bottomright' });
  let legendDiv = null;

  // Creates the bottom-right map legend with accessibility features,
  // adapted from Week 2 and 3 examples.
  legend.onAdd = () => {
    legendDiv = L.DomUtil.create('div', 'legend');
    legendDiv.id = 'map-legend';
    legendDiv.setAttribute('role', 'region');
    legendDiv.setAttribute('aria-roledescription', 'Legend');
    legendDiv.setAttribute('aria-labelledby', 'legend-title');
    legendDiv.setAttribute('tabindex', '0');
    updateLegend();
    return legendDiv;
  };

  // Adds the legend title, colors and labels and updates them when
  // the dropdown changes, adapted from Week 2 and 4 examples.
  function updateLegend() {
    const title = category.key === 'all' ?
      'Licenses per 1,000 residents' :
      `${category.label}: share vs. citywide`;
    const classes = getClasses(category.key);

    legendDiv.innerHTML = `
      <h2 id="legend-title">${title}</h2>
      <ul class="legend-entries">
        ${classes.map((cls) => `
          <li class="legend-entry">
            <span class="legend-icon" style="background-color: ${cls.color};"></span>
            <span>${cls.label}</span>
          </li>
        `).join('')}
      </ul>
    `;
  }

  // adding the legend to the map
  legend.addTo(map);

  // Updates the selected business type, map colors and legend when
  // the dropdown changes, adapted from Week 2 and 6 examples.
  events.addEventListener('categorychanged', (evt) => {
    category = getCategory(evt.detail.categoryKey);
    areasLayer.resetStyle();
    updateLegend();
  });

  // Highlights the selected area and flies to it if picked from the list,
  // adapted from Week 2, 4 and 6 examples, with maxZoom set to 12 to avoid
  // zooming in too close.
  events.addEventListener('areaselected', (evt) => {
    selectedAreaNumber = evt.detail.areaNumber;
    areasLayer.resetStyle();

    if (evt.detail.fromList) {
      areasLayer.eachLayer((layer) => {
        if (layer.feature.properties.area_numbe === selectedAreaNumber) {
          map.flyToBounds(layer.getBounds(), {
            duration: 0.75,
            maxZoom: 12,
          });
        }
      });
    }
  });

  return map;
}

export { initMap };