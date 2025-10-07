// View
import View from "../view.js";
import WeaponSpriteView from "../../allViews/Weapons/WeaponSpriteView.js";
// Helper
import DataSet from "../../helper/DataSet.js";
import classNames from "../../helper/DomClassNames.js";
import { GENERIC_STRING } from "../../helper/MagicStrings.js";

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

	async #tableBodyRender() {
		const entryMarkup = async (crrWpn) => {
			const keepBackgroundSpriteEqualToSizeOfWeaponObject = true;

			const imgSprite = await WeaponSpriteView.renderElement([
				crrWpn,
				this.#weaponSlot,
				keepBackgroundSpriteEqualToSizeOfWeaponObject,
			]);

			return `
			<ul class="${classNames.tableEntries}${this.#assignActiveClass(crrWpn)}"  
				${DataSet.dataWeaponPopUpId}="${crrWpn.id}">

				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${imgSprite}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">${crrWpn.name}</li>
				<li class="${classNames.tableEntry}">
					${this.#weaponTypeStringConversion(crrWpn.type)}
				</li>
				<li class="${classNames.tableEntry}">${crrWpn.range}</li>
				<li class="${classNames.tableEntry}">${crrWpn.oPs}</li>
			</ul>
		`;
		};

		const markupArray = await Promise.all(
			this.#currentWeaponArray.map((currentWeapon) =>
				entryMarkup(currentWeapon)
			)
		);

		return markupArray.join(GENERIC_STRING.EMPTY);
	}

	#assignActiveClass = (crrWpn) => {
		if (!crrWpn) return;

		const isActiveClass = this.#installedWeapons.find(
			([slotId, wpnObjId]) =>
				slotId === this.#weaponSlot.id && wpnObjId === crrWpn.id
		);

		// empty space so they are not joined classes
		return isActiveClass
			? ` ${classNames.weaponPopUpActive}`
			: GENERIC_STRING.EMPTY;
	};

	#weaponTypeStringConversion = (damageType) =>
		damageType
			.split("_")
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(GENERIC_STRING.EMPTY);
}
export default new WeaponPopUpTableView();
