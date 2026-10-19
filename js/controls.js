// business type choices and searchable community area list, adapted from Week 6 dom_manipulation with help from ChatGPT and other AI tools

import { CATEGORIES, getCategory } from './data.js';


// setting up business choices and the area list, adapted from Week 6 initHoodsSelect with help from ChatGPT
function initControls(el, areas, events) {
  // finding each part inside the controls panel - from Week 6
  const categoryListEl = el.querySelector('#category-list');
  const helpEl = el.querySelector('#category-help');
  const searchEl = el.querySelector('.search');
  const areaListEl = el.querySelector('#area-list');

    // adding a radio button for each business type using map and join - adapted from Week 2 with help from ChatGPT
  categoryListEl.innerHTML = CATEGORIES.map((category) => `
    <li>
      <label>
        <input name="category" type="radio" value="${category.key}">
        ${category.label}
      </label>
    </li>
  `).join('');

  // selecting all businesses by default
  categoryListEl.querySelector('input[value="all"]').checked = true;

  // updating the explanation to match the selected business type
  function updateHelpText(categoryKey) {
    if (categoryKey === 'all') {
      helpEl.textContent = 'Darker areas have more business licenses per ' +
        '1,000 residents. Areas with many workers but few residents, ' +
        'such as the Loop, score very high.';
    } else {
      const category = getCategory(categoryKey);
      helpEl.textContent = `Red areas have a smaller share of ` +
        `${category.label.toLowerCase()} businesses than the city as a ` +
        `whole; darker gray areas have a larger share.`;
    }
  }
  updateHelpText('all');

  // updating the text and telling the map when a business type is selected - adapted from Week 6 with help from ChatGPT
  function handleCategoryChange(evt) {
    const categoryKey = evt.target.value;
    updateHelpText(categoryKey);

    const event = new CustomEvent('categorychanged', {
      detail: { categoryKey },
    });
    events.dispatchEvent(event);
  }

  // listening for changes to each radio button
  for (const radio of categoryListEl.querySelectorAll('input')) {
    radio.addEventListener('change', handleCategoryChange);
  }

    // creating and saving a list item for each area to reuse when searching - adapted from Week 6 with help from ChatGPT
  const areaListItems = {};
  for (const area of areas) {
    const props = area.properties;
    const item = document.createElement('li');
    item.innerHTML = `
      <label>
        <input name="area" type="radio" value="${props.area_numbe}">
        ${props.name}
      </label>
    `;
    areaListItems[props.area_numbe] = item;
  }

  // showing areas alphabetically - from Week 6, using slice to keep the original order unchanged as explained in Week 3
  function populateList(areasToShow) {
    areaListEl.innerHTML = '';

    const sorted = areasToShow.slice().sort((a, b) => {
      return a.properties.name.localeCompare(b.properties.name);
    });

    for (const area of sorted) {
      areaListEl.append(areaListItems[area.properties.area_numbe]);
    }
  }
  populateList(areas);

  // filtering community areas as the user types - adapted from Week 6
  function handleSearchInput() {
    const searchValue = searchEl.value.toLowerCase();
    const matches = areas.filter((area) => {
      return area.properties.name.toLowerCase().includes(searchValue);
    });
    populateList(matches);
  }
  searchEl.addEventListener('input', handleSearchInput);

    // When an area is picked in the list, tells the map to highlight and
  // zoom to it. Radio values are text, so Number() turns it back into a
  // number (Week 2 reading: type conversions).
  function handleAreaChange(evt) {
    const event = new CustomEvent('areaselected', {
      detail: { areaNumber: Number(evt.target.value), fromList: true },
    });
    events.dispatchEvent(event);
  }
  for (const item of Object.values(areaListItems)) {
    const radio = item.querySelector('input');
    radio.addEventListener('change', handleAreaChange);
  }

  // When an area is clicked on the map instead, ticks it in the list too,
  // so the list and the map always match.
  events.addEventListener('areaselected', (evt) => {
    const item = areaListItems[evt.detail.areaNumber];
    item.querySelector('input').checked = true;
  });
}

// Lets main.js use initControls.
export { initControls };