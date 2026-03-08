const CLASS_NAME = "material-symbols-outlined";
const ICON_NAMES = {
	HOME: "home",
	SEARCH: "search",
};

const spanElement = function (className) {
	const iconElementClass = `${className}-icon`;
	return `<span class="${CLASS_NAME} ${iconElementClass}">${className}</span>`;
};

const FONT_ICONS = function () {
	return {
		SEARCH: spanElement(ICON_NAMES.SEARCH),
		HOME: spanElement(ICON_NAMES.HOME),
	};
};
export default FONT_ICONS();
