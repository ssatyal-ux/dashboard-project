/* getting the list of business categories to make a button for each one */
import { CATEGORIES } from './data.js';

// gets the panel, data and event bus from main.js, then finds the 3 empty spots
// to fill (Week 6 dom_manipulation hoods_select.js)
function initControls(el, areas, events) {
  const categoryListEl = el.querySelector('#category-list');
  const searchEl = el.querySelector('.search');
  const areaListEl = el.querySelector('#area-list');

  // makes a button for each business type that tells the map to recolor when clicked
  // (createElement, innerHTML, CustomEvent and event bus: Week 6 hoods_select.js;
  // buttons and 'click' listeners: Week 6 user_events; arrow-function listeners: Week 2)
  // the map, legend, help text and chart on the map all update from this one event
  for (const category of CATEGORIES) {
    const item = document.createElement('li');
    item.innerHTML = `<button type="button">${category.label}</button>`;
    item.querySelector('button').addEventListener('click', () => {
      const event = new CustomEvent('categorychanged', {
        detail: { categoryKey: category.key },
      });
      events.dispatchEvent(event);
    });
    categoryListEl.append(item);
  }

  // makes a button for each community area that tells the map to zoom to it when
  // clicked, and saves them for searching later (saving list items in an object:
  // Week 6 hoods_select.js; buttons and clicks: Week 6 user_events)
  const areaListItems = {};
  for (const area of areas) {
    const props = area.properties;
    const item = document.createElement('li');
    item.innerHTML = `<button type="button">${props.name}</button>`;
    item.querySelector('button').addEventListener('click', () => {
      const event = new CustomEvent('areaselected', {
        detail: { areaNumber: props.area_numbe, fromList: true },
      });
      events.dispatchEvent(event);
    });
    areaListItems[props.area_numbe] = item;
  }

  // clears the list and shows the community areas in A to Z order
  // (copied from Week 6 hoods_select.js populateList)
  function populateList(areasToShow) {
    areaListEl.innerHTML = '';

    areasToShow = areasToShow.sort((a, b) => {
      return a.properties.name.localeCompare(b.properties.name);
    });

    for (const area of areasToShow) {
      areaListEl.append(areaListItems[area.properties.area_numbe]);
    }
  }
  populateList(areas);

  // handles the search on every keystroke using filter, toLowerCase and includes
  // (copied from Week 6 hoods_select.js handleSearchInput)
  function handleSearchInput() {
    const filteredAreas = areas.filter((area) => {
      const searchValue = searchEl.value.toLowerCase();
      const areaName = area.properties.name.toLowerCase();
      return areaName.includes(searchValue);
    });

    populateList(filteredAreas);
  }
  searchEl.addEventListener('input', handleSearchInput);
}

// export so main.js can use it (Week 6 hoods_select.js)
export { initControls };