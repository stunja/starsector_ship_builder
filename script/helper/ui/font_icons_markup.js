import { HULL_SIZE } from "../ship_properties";
// class names
import CLASS_NAMES from "./class_names";

const iconMarkup = function (className) {
	const iconElementClass = `${className}-icon`;
	const markup = `<div class="${CLASS_NAMES.FONT_ICONS.ICON_CONTAINER}">
						<span class="${CLASS_NAMES.FONT_ICONS._BASE} ${iconElementClass}">${className}</span>
					</div>`;
	return markup;
};

const HULL_SIZE_ICONS = Object.fromEntries(
	Object.values(HULL_SIZE).map((size) => [
		size,
		iconMarkup(CLASS_NAMES.FONT_ICONS.HULL_SIZES[size]),
	]),
);
const FONT_ICONS_MARKUP = {
	SEARCH: iconMarkup(CLASS_NAMES.FONT_ICONS.SEARCH),
	HOME: iconMarkup(CLASS_NAMES.FONT_ICONS.HOME),
	SWAP_ICON: iconMarkup(CLASS_NAMES.FONT_ICONS.SWAP_ICON),
	WARNING: iconMarkup(CLASS_NAMES.FONT_ICONS.WARNING),

	...HULL_SIZE_ICONS,
};
export default FONT_ICONS_MARKUP;
