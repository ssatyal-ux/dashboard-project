//importing required information from data.js (where the analysis is)
//importing colors for the maps to be displayed
// Claude and ChatGPT explained what needs to be done. Initial coding done by self, with explanations, cleaning and debugging by Claude and ChatGPT.
import { getCategory } from './data.js';
import { getClasses, getColor, getValue } from './colors.js';

//comes from week 6 code
// builds the map and remembers which business
// type and community area the user has picked
function initMap(el, areas, events) {
    let category = getCategory('all');
    let selectedAreaNumber = null;

    //creating a Leaflet map inside el and allowing zoom levels between whole numbers for a smoother experience
    const map = L.map(el, { zoomSnap: 0 });

    //adding a dark gray background map, setting the maximum zoom to 19 - also got this from Claude for the story maps assignment
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
    }).addTo(map);

    //Based on the Week 2 calcFeatureStyle function and the Week 3 choropleth style exercise
    //This function colors each area based on the selected business category, makes the fill
    //75% opaque, and gives the selected area a thick black border while other areas have thin
    //gray borders.
    function styleArea(feature) {
        const isSelected = feature.properties.area_numbe === selectedAreaNumber;
        return {
            fillColor: getColor(feature.properties, category),
            fillOpacity: 0.75,
            color: isSelected ? '#000000' : '#4d4d4d',
            weight: isSelected ? 4 : 1,
        };
    }

    //now bringing all 77 areas of Chicago onto the map
    const areasLayer = L.geoJSON(areas, { style: styleArea }).addTo(map);

    //Shows the area's name and value when you hover over it.
    //Based on the Week 4 and Week 6 bindTooltip examples.
    areasLayer.bindTooltip((layer) => {
        const props = layer.feature.properties;
        const value = getValue(props, category);
        const valueText = category.key === 'all' ?
            `${value.toFixed(1)} licenses per 1,000 residents` :
            `${value.toFixed(2)}x the citywide share`;
        return `<strong>${props.name}</strong><br>${valueText}`;
    });

    //Zooms the map to fit all of Chicago (Week 4 and Week 6 fitBounds).
    map.fitBounds(areasLayer.getBounds(), { padding: [10, 10] });

    //When an area is clicked, highlights it and tells the rest of the app which one was picked.
    //Based on the Week 6 dom_manipulation CustomEvent and event bus.
    areasLayer.on('click', (evt) => {
        const areaNumber = evt.layer.feature.properties.area_numbe;
        selectedAreaNumber = areaNumber;
        areasLayer.setStyle(styleArea);

        const event = new CustomEvent('areaselected', {
            detail: { areaNumber, fromList: false },
        });
        events.dispatchEvent(event);
    });
}