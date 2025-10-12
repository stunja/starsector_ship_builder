import CLASS_NAMES from "../../helper/ui/class_names.js";
import DATASET from "../../helper/ui/datasets.js";
// View
import View from "../view.js";

const CATEGORIES = {
	icon: "",
	name: "Name",
	description: "Description",
	type: "Type",
	cost: "Cost",
	installed: "Installed",
};

class HullModsPopUpHeaderView extends View {
	_localParent = `.${CLASS_NAMES.tableHeader}`;

	generateMarkup() {
		const markup = this.#tableHeader();
		return markup;
	}
	#tableHeader() {
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
export default new HullModsPopUpHeaderView();
