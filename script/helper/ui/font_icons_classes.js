import { HULL_SIZE } from "../ship_properties";
const CLASS_NAME = "material-symbols-outlined";
const ICON_NAMES = {
	HOME: "home",
	SEARCH: "search",
	// HullSize Icons
	[HULL_SIZE.FRIGATE]: "stat_1",
	[HULL_SIZE.DESTROYER]: "stat_2",
	[HULL_SIZE.CRUISER]: "stat_3",
	[HULL_SIZE.CAPITAL_SHIP]: "stat_0",
};

const spanElement = function (className) {
	const iconElementClass = `${className}-icon`;
	return `<span class="${CLASS_NAME} ${iconElementClass}">${className}</span>`;
};

const HULL_SIZE_ICONS = Object.fromEntries(
	Object.values(HULL_SIZE).map((size) => [size, spanElement(ICON_NAMES[size])]),
);
const FONT_ICONS = {
	SEARCH: spanElement(ICON_NAMES.SEARCH),
	HOME: spanElement(ICON_NAMES.HOME),
	...HULL_SIZE_ICONS,
};
export default FONT_ICONS;
