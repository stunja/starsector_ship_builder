import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// View
import View from "../view.js";
import WeaponSpriteView from "../../allViews/Weapons/WeaponSpriteView.js";

class WeaponPopUpTableView extends View {
	_localParent = `.${classNames.tableBody}`;

	generateMarkup() {
		const [userShipBuild, currentWeaponArray, weaponSlot] = this._data;
		const markup = `${this.#tableBodyRender(
			currentWeaponArray,
			userShipBuild.installedWeapons,
			weaponSlot
		)}`;
		return markup;
	}
	#tableBodyRender(currentWeaponArray, installedWeapons, weaponSlot) {
		const assignActiveClass = (crrWpn) => {
			if (!crrWpn) return;

			const isActiveClass = installedWeapons.find(
				([slotId, wpnObjId]) =>
					slotId === weaponSlot.id && wpnObjId === crrWpn.id
			);

			// empty space so they are not joined classes
			return isActiveClass ? ` ${classNames.weaponPopUpActive}` : "";
		};

		const entryMarkup = (crrWpn) => `
			<ul class="${classNames.tableEntries}${assignActiveClass(crrWpn)}"  
				${DataSet.dataWeaponPopUpId}="${crrWpn.id}">

				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${WeaponSpriteView.renderElement([crrWpn, weaponSlot])}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">${crrWpn.name}</li>
				<li class="${classNames.tableEntry}">
					${this.#weaponTypeStringConversion(crrWpn.type)}
				</li>
				<li class="${classNames.tableEntry}">${crrWpn.range}</li>
				<li class="${classNames.tableEntry}">${crrWpn.oPs}</li>
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
export default new WeaponPopUpTableView();
