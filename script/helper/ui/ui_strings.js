// //? Labels and Descriptions for UI only

export const NAV_STRING = {
	LOGO: "Ship Builder",

	// Input
	SEARCH_INPUT_PLACEHOLDER: "Enter the name of the ship...",
	SEARCH_INPUT_LABEL: "Search input field",

	// Buttons
	SEARCH_BUTTON: "Search",
	SAVE_BUILDS_BUTTON: "Saved Builds",
};
export const SEARCH_WARNING_POPUP_STRING = {
	HEADER: (currentShipName) => {
		return `Do you want switch from your current design to ${currentShipName}?`;
	},
	TEXT: "You are trying to select new ship. This action cannot be undone, all previous your progress is going to be lost, and new empty ship frame will be selected. Try saving first.",
	WARNING_TEXT: "Warning: This is irreversible.",
	BUTTONS: {
		CONTINUE: "Design a New Ship",
		RETURN: "Return Back",
	},
};
// Take Ship.hits => string labels

export const SHIP_HINTS_STRINGS = {
	// HIDE: "Special",
	CIVILIAN: "Civilian",
	TRANSPORT: "Transport",
	CARRIER: "Carrier",
	TANKER: "Tanker",
	FREIGHTER: "Freighter",
};
