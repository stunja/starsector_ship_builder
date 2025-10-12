// View
import View from "../view.js";
import WeaponSpriteView from "../../allViews/Weapons/WeaponSpriteView.js";
// Helper
import DATASET from "../../helper/ui/datasets.js";
import CLASS_NAMES from "../../helper/ui/class_names.js";
import { GENERIC_STRING } from "../../helper/ui/ui_main.js";

class WeaponPopUpTableView extends View {
	_localParent = `.${CLASS_NAMES.tableBody}`;

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
			<ul class="${CLASS_NAMES.tableEntries}${this.#assignActiveClass(crrWpn)}"  
				${DATASET.dataWeaponPopUpId}="${crrWpn.id}">

				<li class="${CLASS_NAMES.tableEntry} ${CLASS_NAMES.tableIcon}">
					${imgSprite}
				</li>
				<li class="${CLASS_NAMES.tableEntry} ${CLASS_NAMES.tableName}">${
				crrWpn.name
			}</li>
				<li class="${CLASS_NAMES.tableEntry}">
					${this.#weaponTypeStringConversion(crrWpn.type)}
				</li>
				<li class="${CLASS_NAMES.tableEntry}">${crrWpn.range}</li>
				<li class="${CLASS_NAMES.tableEntry}">${crrWpn.oPs}</li>
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
			? ` ${CLASS_NAMES.weaponPopUpActive}`
			: GENERIC_STRING.EMPTY;
	};

	#weaponTypeStringConversion = (damageType) =>
		damageType
			.split("_")
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(GENERIC_STRING.EMPTY);
}
export default new WeaponPopUpTableView();
