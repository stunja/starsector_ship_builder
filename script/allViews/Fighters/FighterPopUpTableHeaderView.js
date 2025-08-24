import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// View
import View from "../view.js";
import { GENERIC_STRING } from "../../helper/MagicStrings.js";

const CATEGORIES = {
	icon: GENERIC_STRING.EMPTY,
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
			.join(GENERIC_STRING.EMPTY);
		return markup;
	}
}
export default new FighterPopUpTableHeaderView();
