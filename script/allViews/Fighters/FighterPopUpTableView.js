// View
import View from "../view.js";
import FighterSprite from "./FighterSprite.js";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names.js";
import DATASET from "../../helper/ui/datasets.js";
import { GENERIC_STRING } from "../../helper/ui/ui_main.js";

class FighterPopUpTableView extends View {
	_localParent = `.${CLASS_NAMES.tableBody}`;

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

		return this.#tableBodyRender();
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
		return isActiveClass
			? ` ${CLASS_NAMES.weaponPopUpActive}`
			: GENERIC_STRING.EMPTY;
	};

	async #tableBodyRender() {
		const entryMarkup = async (currentFighter) => {
			const imgSprite = await FighterSprite.renderElement(currentFighter);

			return `
			<ul class="${CLASS_NAMES.tableEntries}${this.#assignActiveClass(
				currentFighter,
				this.#installedWeapons,
				this.#weaponSlot
			)}" ${DATASET.dataWeaponPopUpId}="${currentFighter.id}">

				<li class="${CLASS_NAMES.tableEntry} ${CLASS_NAMES.tableIcon}">
					${imgSprite}
				</li>

				<li class="${CLASS_NAMES.tableEntry} ${CLASS_NAMES.tableName}">
					${currentFighter.additionalData.name}
				</li>

				<li class="${CLASS_NAMES.tableEntry}">
					${this.#fighterRoleString(currentFighter)}
				</li>

				<li class="${CLASS_NAMES.tableEntry}">
					${this.#numberOfFightersInAWing(currentFighter)}
				</li>
				
				<li class="${CLASS_NAMES.tableEntry}">${currentFighter.range}</li>
				<li class="${CLASS_NAMES.tableEntry}">${currentFighter.opCost}</li>
			</ul>
			`;
		};

		const markupArray = await Promise.all(
			this.#currentFighterArray.map((currentFighter) =>
				entryMarkup(currentFighter)
			)
		);

		return markupArray.join(GENERIC_STRING.EMPTY);
	}
}
export default new FighterPopUpTableView();
