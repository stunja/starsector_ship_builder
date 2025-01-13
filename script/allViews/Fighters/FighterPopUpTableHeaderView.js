import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// View
import View from "../view.js";

const CATEGORIES = {
	icon: "",
	name: "Name",
	role: "Role",
	wing: "Wing",
	range: "Range",
	cost: "Cost",
};

class FighterPopUpTableHeaderView extends View {
	_localParent = `.${classNames.tableHeader}`;

	generateMarkup() {
		const markup = Object.entries(CATEGORIES)
			.map(([key, value]) => {
				return `<li class="${classNames.unselectable} ${classNames.tableHeaderEntry}" ${DataSet.dataCategory}="${key}">
							${value}
						</li>`;
			})
			.join("");
		return markup;
	}
}
export default new FighterPopUpTableHeaderView();
