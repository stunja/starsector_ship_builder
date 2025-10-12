// View
import View from "../view.js";
// helper
import CLASS_NAMES from "../../helper/ui/class_names.js";

class FighterPopUpContainerView extends View {
	_localParent = `.${CLASS_NAMES.fighterPopUp}`;

	generateMarkup() {
		const markup = `
				<div class="${CLASS_NAMES.tableContainer}">
					<ul class="${CLASS_NAMES.tableEntries} ${CLASS_NAMES.tableHeader}"></ul>
					<div class="${CLASS_NAMES.tableBody}"></div>
				</div>
				<div class="${CLASS_NAMES.hoverContainer}"></div>
				`;
		return markup;
	}
}
export default new FighterPopUpContainerView();
