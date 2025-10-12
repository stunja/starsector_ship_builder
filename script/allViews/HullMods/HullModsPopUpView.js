// View
import View from "../view.js";

// helper
import CLASS_NAMES from "../../helper/ui/class_names.js";

class HullModsPopUpView extends View {
	_localParent = `.${CLASS_NAMES.hullModsPopUp}`;

	#allHullMods;
	generateMarkup() {
		this.#processData(this._data);

		const markup = `${this.#renderContainer()}`;
		return markup;
	}
	#processData(data) {
		this.#allHullMods = data;
	}
	#renderContainer() {
		const markup = `				
                <div class="${CLASS_NAMES.tableContainer}">
					<ul class="${CLASS_NAMES.tableFilter}"></ul>
					<ul class="${CLASS_NAMES.tableEntries} ${CLASS_NAMES.tableHeader}"></ul>
					<div class="${CLASS_NAMES.tableBody}"></div>
				</div>
                `;
		return markup;
	}
}
export default new HullModsPopUpView();
