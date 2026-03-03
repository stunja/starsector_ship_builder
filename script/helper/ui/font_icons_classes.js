const CLASS_NAME = "material-symbols-outlined";
const ICON_NAMES = {
	HOME: "home",
	SEARCH: "search",
};

const spanElement = function (className) {
	return `<span class="${CLASS_NAME}">${className}</span>`;
};

const FONT_ICONS = function () {
	return {
		SEARCH: spanElement(ICON_NAMES.SEARCH),
		HOME: spanElement(ICON_NAMES.HOME),
	};
};
export default FONT_ICONS();
