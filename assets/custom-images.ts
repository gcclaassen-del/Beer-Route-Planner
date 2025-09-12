// INSTRUCTIONS:
// The icons below are vector-based (SVG) and designed to be a classic map pin,
// featuring a more detailed and polished look with gradients and a beer glass with foam.
// The default brewery pin is yellow, and the selected pin is green for better visibility.

// Raw SVG strings for the polished teardrop icons.
const yellowPinSVG = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 42'>
  <defs>
    <filter id='shadow' x='-25%' y='-15%' width='150%' height='130%'>
      <feDropShadow dx='1' dy='2' stdDeviation='1.5' flood-color='#000' flood-opacity='0.3'/>
    </filter>
    <radialGradient id='yellow-gradient' cx='50%' cy='40%' r='60%' fx='30%' fy='30%'>
      <stop offset='0%' style='stop-color:#FFD54F'/>
      <stop offset='100%' style='stop-color:#FFC107'/>
    </radialGradient>
  </defs>
  <g filter='url(#shadow)'>
    <path fill='url(#yellow-gradient)' d='M16 42L16 42C16 42 0 26 0 16a16 16 0 1 1 32 0c0 10-16 26-16 26z'/>
    <circle cx='16' cy='16' r='12' fill='white'/>
    <g transform='translate(0, 1)'>
      <path fill='#F59E0B' stroke='#424242' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' d='M10 10 L22 10 L19.5 24 L12.5 24 Z'/>
      <path fill='white' stroke='#424242' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' d='M10 10 Q 16 7, 22 10'/>
    </g>
  </g>
</svg>
`;

const greenPinSVG = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 42'>
  <defs>
    <filter id='shadow' x='-25%' y='-15%' width='150%' height='130%'>
      <feDropShadow dx='1' dy='2' stdDeviation='1.5' flood-color='#000' flood-opacity='0.3'/>
    </filter>
    <radialGradient id='green-gradient' cx='50%' cy='40%' r='60%' fx='30%' fy='30%'>
      <stop offset='0%' style='stop-color:#81C784'/>
      <stop offset='100%' style='stop-color:#4CAF50'/>
    </radialGradient>
  </defs>
  <g filter='url(#shadow)'>
    <path fill='url(#green-gradient)' d='M16 42L16 42C16 42 0 26 0 16a16 16 0 1 1 32 0c0 10-16 26-16 26z'/>
    <circle cx='16' cy='16' r='12' fill='white'/>
    <g transform='translate(0, 1)'>
      <path fill='#F59E0B' stroke='#424242' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' d='M10 10 L22 10 L19.5 24 L12.5 24 Z'/>
      <path fill='white' stroke='#424242' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' d='M10 10 Q 16 7, 22 10'/>
    </g>
  </g>
</svg>
`;

// The default yellow icon for a brewery that is not yet added to the route.
export const customBreweryIconUrl = `data:image/svg+xml;base64,${btoa(yellowPinSVG)}`;

// The green icon for a brewery that has been added to the route.
export const customSelectedBreweryIconUrl = `data:image/svg+xml;base64,${btoa(greenPinSVG)}`;
