// INSTRUCTIONS:
// The icons below are vector-based (SVG) and designed to be a classic map pin,
// inspired by the user's provided reference image.
// The default brewery pin is yellow, and the selected pin is green for better visibility.

// Raw SVG strings for the new teardrop icons with an amber-filled pint glass inside.
const yellowPinSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42"><defs><filter id="shadow" x="-25%" y="-15%" width="150%" height="130%"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.3"/></filter></defs><g filter="url(#shadow)"><path fill="#FFC107" d="M16 42L16 42C16 42 0 26 0 16a16 16 0 1 1 32 0c0 10-16 26-16 26z"/><circle cx="16" cy="16" r="12" fill="white"/><path fill="#F59E0B" stroke="#424242" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M9 8 L23 8 L20 24 L12 24 L9 8 Z"/></g></svg>`;
const greenPinSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42"><defs><filter id="shadow" x="-25%" y="-15%" width="150%" height="130%"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.3"/></filter></defs><g filter="url(#shadow)"><path fill="#4CAF50" d="M16 42L16 42C16 42 0 26 0 16a16 16 0 1 1 32 0c0 10-16 26-16 26z"/><circle cx="16" cy="16" r="12" fill="white"/><path fill="#F59E0B" stroke="#424242" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M9 8 L23 8 L20 24 L12 24 L9 8 Z"/></g></svg>`;

// The default yellow icon for a brewery that is not yet added to the route.
export const customBreweryIconUrl = `data:image/svg+xml;base64,${btoa(yellowPinSVG)}`;

// The green icon for a brewery that has been added to the route.
export const customSelectedBreweryIconUrl = `data:image/svg+xml;base64,${btoa(greenPinSVG)}`;