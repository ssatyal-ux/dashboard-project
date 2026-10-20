/*tying to find the categories and then within the categories trying to find the helper key*/
import { CATEGORIES, getCategory } from './data.js';

// gets the panel, data and event bus from main.js, then finds the 4 empty spots to fill (Week 6)
function initControls(el, areas, events) {
  const categoryListEl = el.querySelector('#category-list');
  const helpEl = el.querySelector('#category-help');
  const searchEl = el.querySelector('.search');
  const areaListEl = el.querySelector('#area-list');

// writes a sentence explaining the map colors for the chosen business type (if/else: Week 2 reading, textContent: Week 8, ${...}: Week 6)
  function updateHelpText(categoryKey) {
    if (categoryKey === 'all') {
      helpEl.textContent = 'Showing all businesses. Darker areas have more ' +
        'business licenses per 1,000 residents.';
    } else {
      const category = getCategory(categoryKey);
      helpEl.textContent = `Showing ${category.label.toLowerCase()}. Red ` +
        `areas have a smaller share than the city as a whole; darker gray ` +
        `areas have a larger share.`;
    }
  }
    updateHelpText('all');

  // makes a button for each business type that tells the map to recolor when clicked (loop and event bus: Week 6, buttons and clicks: Week 8)
 for (const category of CATEGORIES) {
    const item = document.createElement('li');
    item.innerHTML = `<button type="button">${category.label}</button>`;
    item.querySelector('button').addEventListener('click', () => {
      updateHelpText(category.key);

      const event = new CustomEvent('categorychanged', {
        detail: { categoryKey: category.key },
      });
      events.dispatchEvent(event);
    });
    categoryListEl.appendChild(item);
  }
// makes a button for each community area that tells the map to zoom to it when clicked, and saves them for searching later (saving list items: Week 6, buttons and clicks: Week 8)
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

// clears the list and shows the community areas in A to Z order (copied from Week 6 populateList)
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

// Handles the search on every keystroke using filter, toLowerCase, and includes, copied from Week 6 hoods_select.js.
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

// export so main.js can use it: Week 6 hoods_select.js
export { initControls };