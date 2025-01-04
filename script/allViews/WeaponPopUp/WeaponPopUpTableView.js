import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// View
import View from "../view.js";

const CATEGORIES = {
	icon: "",
	name: "Name",
	type: "Type",
	range: "Range",
	cost: "Cost",
};

class WeaponPopUpTableHeaderView extends View {
	_localParent = `.${classNames.tableBody}`;

	generateMarkup() {
		const data = this._data;
		// const markup = `${this.#tableBodyRender}`;
		const markup = "<p>Test</p>";
		return markup;
	}
	#tableBodyRender(
		currentWeaponArray,
		currentInstalledWeapons,
		currentWeaponSlot
	) {
		const assignActiveClass = (crrWpn) => {
			if (!crrWpn) return;

			const isActiveClass = currentInstalledWeapons.find(
				([slotId, wpnObjId]) =>
					slotId === currentWeaponSlot.id && wpnObjId === crrWpn.id
			);

			return isActiveClass ? `${classNames.weaponPopUpActive}` : "";
		};

		const entryMarkup = (crrWpn) => `
			<ul class="${classNames.tableEntries} ${assignActiveClass(crrWpn)}"  
				${DataSet.dataWeaponPopUpId}="${crrWpn.id}">

				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${WeaponSpriteView.render(crrWpn)}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">${crrWpn.name}</li>
				<li class="${classNames.tableEntry}">
					${this.#weaponTypeStringConversion(crrWpn.type)}
				</li>
				<li class="${classNames.tableEntry}">${crrWpn.range}</li>
				<li class="${classNames.tableEntry}">${crrWpn.OPs}</li>
			</ul>
			`;

		return currentWeaponArray.map((crrWpn) => entryMarkup(crrWpn)).join("");
	}
	#weaponTypeStringConversion = (damageType) =>
		damageType
			.split("_")
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(" ");
}
export default new WeaponPopUpTableHeaderView();
