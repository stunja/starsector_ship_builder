import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// View
import View from "../view.js";

const CATEGORIES = {
	icon: "",
	name: "Name",
	description: "Description",
	type: "Type",
	cost: "Cost",
};

class HullModsPopUpHeaderView extends View {
	_localParent = `.${classNames.tableHeader}`;

	generateMarkup() {
		const markup = Object.entries(CATEGORIES)
			.map(([key, value]) => {
				return `<li class="${classNames.unselectable} ${classNames.tableHeaderEntry}" 
						${DataSet.dataCategory}="${key}"
						>
							${value}
						</li>`;
			})
			.join("");
		return markup;
	}
}
export default new HullModsPopUpHeaderView();
