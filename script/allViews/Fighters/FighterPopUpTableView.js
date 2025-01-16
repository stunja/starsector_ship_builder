// View
import View from "../view.js";
import FighterSprite from "./FighterSprite.js";
// Helper
import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";

class FighterPopUpTableView extends View {
	_localParent = `.${classNames.tableBody}`;

	#installedWeapons;
	#currentFighterArray;
	#weaponSlot;

	#processData(data) {
		const [installedWeapons, currentFighterArray, weaponSlot] = data;

		this.#installedWeapons = installedWeapons;
		this.#currentFighterArray = currentFighterArray;
		this.#weaponSlot = weaponSlot;
	}
	generateMarkup() {
		this.#processData(this._data);
		const markup = `${this.#tableBodyRender()}`;

		return markup;
	}

	// FighterObject.num is number if fighters in wing
	// fighterObject.number is something else.
	#numberOfFightersInAWing = (crrWpn) => crrWpn.num;
	#fighterRoleString = (crrWpn) => crrWpn.role.toLowerCase();
	// Active class Not working 15/12
	#assignActiveClass = (crrWpn, installedWeapons, weaponSlot) => {
		if (!crrWpn) return;

		const isActiveClass = installedWeapons.find(
			([slotId, wpnObjId]) => slotId === weaponSlot.id && wpnObjId === crrWpn.id
		);

		// empty space so they are not joined classes
		return isActiveClass ? ` ${classNames.weaponPopUpActive}` : "";
	};
	#tableBodyRender() {
		const entryMarkup = (crrFighter) => `
			<ul class="${classNames.tableEntries}${this.#assignActiveClass(
			crrFighter,
			this.#installedWeapons,
			this.#weaponSlot
		)}"  
				${DataSet.dataWeaponPopUpId}="${crrFighter.id}">

				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${FighterSprite.renderElement(crrFighter)}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">${
			crrFighter.additionalData.name
		}</li>
				<li class="${classNames.tableEntry}">
					${this.#fighterRoleString(crrFighter)}
				</li>
				<li class="${classNames.tableEntry}">
					${this.#numberOfFightersInAWing(crrFighter)}
				</li>
				<li class="${classNames.tableEntry}">${crrFighter.range}</li>
				<li class="${classNames.tableEntry}">${crrFighter.opCost}</li>
			</ul>
			`;
		return this.#currentFighterArray
			.map((crrWpn) => entryMarkup(crrWpn))
			.join("");
	}
}
export default new FighterPopUpTableView();
