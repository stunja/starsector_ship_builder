import { HULL_SIZE } from "../ship_properties";
import CLASS_NAMES from "./class_names";

const spanElement = function (className) {
	const iconElementClass = `${className}-icon`;
	const markup = `<div class="${CLASS_NAMES._FONT_ICONS.ICON_CONTAINER}">
						<span class="${CLASS_NAMES._FONT_ICONS._BASE} ${iconElementClass}">${className}</span>
					</div>`;
	return markup;
};

const HULL_SIZE_ICONS = Object.fromEntries(
	// Object.values(HULL_SIZE).map((size) => [size, spanElement(ICON_NAMES[size])]),
	Object.values(HULL_SIZE).map((size) => [
		size,
		spanElement(CLASS_NAMES._FONT_ICONS.HULL_SIZES[size]),
	]),
);
const FONT_ICONS_MARKUP = {
	SEARCH: spanElement(CLASS_NAMES._FONT_ICONS.SEARCH),
	HOME: spanElement(CLASS_NAMES._FONT_ICONS.HOME),
	...HULL_SIZE_ICONS,
};
export default FONT_ICONS_MARKUP;
