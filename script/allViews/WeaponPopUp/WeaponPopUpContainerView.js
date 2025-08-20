import classNames from "../../helper/DomClassNames.js";
// View
import View from "../view.js";

class WeaponPopUpView extends View {
	_localParent = `.${classNames.weaponPopUp}`;

	generateMarkup() {
		const markup = `
				<div class="${classNames.tableContainer}">
					<ul class="${classNames.tableEntries} ${classNames.tableHeader}"></ul>
					<div class="${classNames.tableBody}"></div>
				</div>
				<div class="${classNames.hoverContainer}"></div>
				`;
		return markup;
	}
}
export default new WeaponPopUpView();
