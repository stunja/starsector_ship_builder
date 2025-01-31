import classNames from "../../helper/DomClassNames.js";
// View
import View from "../view.js";

class HullModsPopUpView extends View {
	_localParent = `.${classNames.hullModsPopUp}`;

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
                <div class="${classNames.tableContainer}">
					<ul class="${classNames.tableFilter}"></ul>
					<ul class="${classNames.tableEntries} ${classNames.tableHeader}"></ul>
					<div class="${classNames.tableBody}"></div>
				</div>
                `;
		return markup;
	}
}
export default new HullModsPopUpView();
