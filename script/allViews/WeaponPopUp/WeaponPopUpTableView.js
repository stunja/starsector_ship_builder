import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// View
import View from "../view.js";
import WeaponSpriteView from "../../allViews/Weapons/WeaponSpriteView.js";

class WeaponPopUpTableView extends View {
	_localParent = `.${classNames.tableBody}`;
	#currentWeaponArray;
	#weaponSlot;
	#installedWeapons;
	generateMarkup() {
		this.#processData(this._data);

		const markup = this.#tableBodyRender();
		return markup;
	}
	#processData(data) {
		const [userShipBuild, currentWeaponArray, weaponSlot] = data;
		this.#installedWeapons = userShipBuild.installedWeapons;

		this.#currentWeaponArray = currentWeaponArray;
		this.#weaponSlot = weaponSlot;
	}

	#tableBodyRender() {
		const entryMarkup = (crrWpn) => `
			<ul class="${classNames.tableEntries}${this.#assignActiveClass(crrWpn)}"  
				${DataSet.dataWeaponPopUpId}="${crrWpn.id}">

				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${WeaponSpriteView.renderElement([crrWpn, this.#weaponSlot])}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">${crrWpn.name}</li>
				<li class="${classNames.tableEntry}">
					${this.#weaponTypeStringConversion(crrWpn.type)}
				</li>
				<li class="${classNames.tableEntry}">${crrWpn.range}</li>
				<li class="${classNames.tableEntry}">${crrWpn.oPs}</li>
			</ul>
			`;

		return this.#currentWeaponArray
			.map((crrWpn) => entryMarkup(crrWpn))
			.join("");
	}
	#assignActiveClass = (crrWpn) => {
		if (!crrWpn) return;

		const isActiveClass = this.#installedWeapons.find(
			([slotId, wpnObjId]) =>
				slotId === this.#weaponSlot.id && wpnObjId === crrWpn.id
		);

		// empty space so they are not joined classes
		return isActiveClass ? ` ${classNames.weaponPopUpActive}` : "";
	};

	#weaponTypeStringConversion = (damageType) =>
		damageType
			.split("_")
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(" ");
}
export default new WeaponPopUpTableView();
