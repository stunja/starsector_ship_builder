// View
import View from "../view.js";
// helper
import { GENERIC_STRING } from "../../helper/ui/ui_main.js";
import CLASS_NAMES from "../../helper/ui/class_names.js";
import DATASET from "../../helper/ui/datasets.js";

const CATEGORIES = {
	icon: GENERIC_STRING.EMPTY,
	name: "Name",
	role: "Role",
	wing: "Wing",
	range: "Range",
	cost: "Cost",
};

class FighterPopUpTableHeaderView extends View {
	_localParent = `.${CLASS_NAMES.tableHeader}`;

	generateMarkup() {
		const markup = Object.entries(CATEGORIES)
			.map(([key, value]) => {
				return `<li class="${CLASS_NAMES.unselectable} ${CLASS_NAMES.tableHeaderEntry}" ${DATASET.dataCategory}="${key}">
							${value}
						</li>`;
			})
			.join(GENERIC_STRING.EMPTY);
		return markup;
	}
}
export default new FighterPopUpTableHeaderView();
