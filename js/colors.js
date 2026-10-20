//deciding colors for community areas - for both the map and the chart 
// code and content derived from week 2 and 3 examples of using colors and building legend
// again initial code done by self and ran through Claude AI to fix and debug and decipher
// Claude also helped with logical reasoning as to what needs to be done and explained and taught the code to me
// colors are derived from the city of Chicago design guidelines 

const DENSITY_CLASSES = [
    {min: 25, color: '#000000',label: '25 or more' },
    {min: 16, color: '#4d4d4d',label: '16 to 25' },
    {min: 12, color: '#b3b3b3',label: '12 to 16' },
    {min: 8, color: '#d9d9d9',label: '8 to 12' },
    {min: 0, color: '#ffffff',label: 'Under 8' },
];
// Color key for the "All businesses" map: more licenses per 1,000 residents = darker blue.

//assigning colors for location quotient 
const LQ_CLASSES = [
    {min: 2, color: '#000000',label: 'Much Higher Concentration' },
    {min: 1.1, color: '#4d4d4d',label: 'Higher Concentration (1.1  to 2)'},
    {min: 0.9, color: '#b3b3b3',label: 'Equivalent to the City (0.9-1.1)' },
    {min: 0.5, color: '#d9d9d9',label: 'Lower Concentration (0.5-0.9)' },
    {min: 0.000001, color: '#ffffff',label: 'Much Lower (under 0.5)' },
    {min: 0, color: '#41b6e6',label: 'None in this Area' },
];

// If the user selects "All businesses", use the density color scale.
// For any specific business type, use the location quotient color scale.
function getClasses(categoryKey) {
  if (categoryKey === 'all') {
    return DENSITY_CLASSES;
  }
  return LQ_CLASSES;
}

// Gets the area's business density if "All businesses" is selected.
// Otherwise, gets the area's LQ for the selected business type.
function getValue(props, category) {
  if (category.key === 'all') {
    return props.density;
  }
  // Square brackets because the property name is stored in a variable.
  return props[category.lqKey];
}

// Gets the area's number, then goes down the color key from top to
// bottom and returns the color of the first line the number reaches.
function getColor(props, category) {
  const value = getValue(props, category);
  const classes = getClasses(category.key);
  for (const cls of classes) {
    if (value >= cls.min) {
      return cls.color;
    }
  }
  
}

// Lets other files (like map.js) use these.
export { getClasses, getValue, getColor };