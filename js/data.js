/*I built this file mainly from the Week 4 and Week 6 bikeshare examples, plus JavaScript basics from the Week 2 and 3 readings.
  The I pasted it on Claude and asked it to edit if anything were missing*/

  
//key: count of number of businesses
//lqkey: location quotient for the businesses
//label: what the thing is called

const CATEGORIES = [
  { key: 'all', lqKey: null, label: 'All businesses (density)' },
  { key: 'Food_and_Beverage', lqKey: 'LQ_Food', label: 'Food & beverage' },
  { key: 'Retail_and_General_Business', lqKey: 'LQ_Retail', label: 'Retail & general business' },
  { key: 'Alcohol_and_Entertainment', lqKey: 'LQ_Alcohol', label: 'Alcohol & entertainment' },
  { key: 'Health_and_Professional_Services', lqKey: 'LQ_Health', label: 'Health & professional services' },
  { key: 'Transportation_and_Automotive', lqKey: 'LQ_Transport', label: 'Transportation & automotive' },
  { key: 'Industrial_and_Manufacturing', lqKey: 'LQ_Industrial', label: 'Industrial & manufacturing' },
  { key: 'Housing_and_Property', lqKey: 'LQ_Housing', label: 'Housing & property' },
  { key: 'Events_and_Recreation', lqKey: 'LQ_Events', label: 'Events & recreation' },
];

const LOW_COUNT =5; //only because some businesses may have very little to be a generalizable concept

// Finds and returns the category with the matching key
function getCategory(key) {
  for (const category of CATEGORIES) {
    if (category.key === key) {
      return category;
    }
  }
}

