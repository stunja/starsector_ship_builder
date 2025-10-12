// View
import View from "../view.js";

// Helper
import CLASS_NAMES from "../../helper/ui/class_names.js";
import DATASET from "../../helper/ui/datasets.js";

const CATEGORIES = {
	icon: "",
	name: "Name",
	type: "Type",
	range: "Range",
	cost: "Cost",
};

class WeaponPopUpTableHeaderView extends View {
	_localParent = `.${CLASS_NAMES.tableHeader}`;

	generateMarkup() {
		const markup = Object.entries(CATEGORIES)
			.map(([key, value]) => {
				return `<li class="${CLASS_NAMES.unselectable} ${CLASS_NAMES.tableHeaderEntry}" 
						${DATASET.dataCategory}="${key}"
						>
							${value}
						</li>`;
			})
			.join("");
		return markup;
	}
}
export default new WeaponPopUpTableHeaderView();
