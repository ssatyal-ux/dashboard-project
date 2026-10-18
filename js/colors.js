//deciding colors for community areas - for both the map and the chart 
// code and content derived from week 2 and 3 examples of using colors and building legend
// again initial code done by self and ran through Claude AI to fix and debug and decipher
// colors are derived from the city of Chicago design guidelines 

const DENSITY_CLASSES = [
    {min: 25, color: '#005b99',label: '25 or more' },
    {min: 16, color: '#0075bb',label: '16 to 25' },
    {min: 12, color: '#0092d1',label: '12 to 16' },
    {min: 8, color: '#a4d5ee',label: '8 to 12' },
    {min: 0, color: '#e1f3f8',label: 'Under 8' },
];
// Color key for the "All businesses" map: more licenses per 1,000 residents = darker blue.

//assigning colors for location quotient 
const LQ_CLASSES = [
    {min: 2, color: '#0075BB',label: 'Much Higher Concentration' },
    {min: 1.1, color: '#a4d5ee',label: 'Higher Concentration (1.1  to 2)'},
    {min: 0.9, color: '#f1f1f1',label: 'Equivalent to the City (0.9-1.1)' },
    {min: 0.5, color: '#e59393',label: 'Lower Concentration (0.5-0.9)' },
    {min: 0.000001, color: '#cc393e',label: 'Much Lower (under 0.5)' },
    {min: 0, color: '#981b1e',label: 'None in this Area' },
];