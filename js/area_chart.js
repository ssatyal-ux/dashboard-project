// bar chart of the 5 lowest community areas for the business type picked on the map
// based on the Week 6 data_in_js-chartjs lecture example (stations_chart.js):
// same Chart.js import, filter/sort/map to build the bars, indexAxis,
// aspectRatio, beginAtZero and borderWidth. Setting my own bar color follows the
// Week 6 ApexCharts (color) and D3 (fill, stroke) versions of the same chart.
// slice is from the Week 2 accessibility example, innerHTML and querySelector
// from Weeks 2 and 6. Adapted to this data with help from Claude.
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/auto/+esm';
import { getValue } from './colors.js';

// draws (or redraws) the chart inside the box on the map for one business type
function drawChart(el, areas, category) {
  // keeping areas that have a value, sorted from lowest to highest, and keeping
  // the lowest 5 so the bars and names stay readable in a small box
  // (filter makes a new array, so sorting it does not reorder the original areas)
  const lowestAreas = areas
    .filter((area) => getValue(area.properties, category) > 0)
    .sort((a, b) => getValue(a.properties, category) - getValue(b.properties, category))
    .slice(0, 5);

  const areaNames = lowestAreas.map((area) => area.properties.name);
  const areaValues = lowestAreas.map((area) => getValue(area.properties, category));

  const title = category.key === 'all' ?
    'Lowest 5 areas: business licenses per 1,000 residents' :
    `Lowest 5 areas: ${category.label}`;

  // replacing the old chart with a fresh title and canvas each time the
  // business type changes, then drawing a new chart on the new canvas
  el.innerHTML = `
    <h2 id="chart-title">${title}</h2>
    <canvas></canvas>
  `;
  const canvas = el.querySelector('canvas');

  const data = {
    labels: areaNames,
    datasets: [
      {
        label: category.key === 'all' ? 'Licenses per 1,000 residents' : 'Share vs. citywide (1 = same)',
        data: areaValues,
        backgroundColor: '#4d4d4d', // bar fill - CDS gray dark, same gray as the map
        borderColor: '#000000', // bar outline - black from the map colors
        borderWidth: 1,
      },
    ],
  };
  const options = {
    indexAxis: 'y', // horizontal bars so the area names fit
    aspectRatio: 1.4, // a slightly wide box: big, easy-to-read bars for 5 areas
    scales: {
      x: { beginAtZero: true },
    },
  };
  const chart = new Chart(canvas, { type: 'bar', data, options });

  return chart;
}

export { drawChart };