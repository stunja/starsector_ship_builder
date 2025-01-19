import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";
import { weaponSlotIdIntoWeaponSlotObject } from "../../helper/helperFunction";

import View from "../view";
import FighterSprite from "./FighterSprite";
import { createWebSocketModuleRunnerTransport } from "vite/module-runner";

const STRING = {
	HEADER: "Fighter Bays",
	EMPTY: "",
};
const WEAPON_SLOT_FIGHTER = "LAUNCH_BAY";
//! Only Render of Container Implemented so far.
class FightersView extends View {
	_localParent = `.${classNames.fighterContainer}`;

	#installedWeapons;
	#weaponSlots;
	#userShipBuild;

	#allFighters;

	#processData([userShipBuild, allFighters]) {
		this.#allFighters = allFighters;

		this.#userShipBuild = userShipBuild;
		this.#installedWeapons = userShipBuild.installedWeapons;
		this.#weaponSlots = userShipBuild.weaponSlots;
	}
	generateMarkup() {
		this.#processData(this._data);

		const markup = `${this.#fighterContainerMarkup()}`;
		return markup;
	}
	#fighterContainerMarkup() {
		return `
	        <ul class="${classNames.fighterSlotsContainer}">
	          <li class="${classNames.fighterSlotsContainerHeader}">
                <h5>${STRING.HEADER}</h5>
              </li>
	          <li class="${classNames.fighterSlots}">
	            ${this.#fighterSlotsMarkup()}
	          </li>
			  <div class="${classNames.fighterPopUp}"></div>
	        </ul>
	`;
	}

	#fighterSlotsMarkup() {
		const fighterSlots = this.#createFighterSlotsArray();
		if (fighterSlots.length === 0) return STRING.EMPTY;
		//prettier-ignore
		return fighterSlots
			.map(
				(fighterSlot) => {
					const currentFighter = this.#findCurrentFighter(fighterSlot);
				return	`
                        <div class="${classNames.fighterSlotContainer}">
                            <figure class="${classNames.fighterSlot}"
                                ${DataSet.dataFighterId}="${fighterSlot.id}"
                            >
								${currentFighter ? FighterSprite.renderElement(currentFighter) : ""}
                            </figure>
                        </div>
                    `
				}
			)
			.join("");
	}

	#createFighterSlotsArray = () =>
		this.#weaponSlots.filter(
			(fighterObject) => fighterObject.type === WEAPON_SLOT_FIGHTER
		);

	#findCurrentFighter = (weaponSlot) => {
		if (!weaponSlot) {
			throw new Error("Fighter slot is undefined or invalid");
		}

		const currentInstalledWeapon = this.#installedWeapons.find(
			([slotId, _weaponId]) => slotId === weaponSlot.id
		);

		if (!currentInstalledWeapon) {
			throw new Error(`No weapon found for fighter slot ID: ${weaponSlot.id}`);
		}
		const [_, currentWeaponId] = currentInstalledWeapon;

		// If weaponId is empty just return empty string
		// If weaponSlots are actually empty
		if (currentWeaponId === STRING.EMPTY) return STRING.EMPTY;

		const currentFighterObject = weaponSlotIdIntoWeaponSlotObject(
			this.#allFighters,
			currentWeaponId
		);

		if (!currentFighterObject) {
			throw new Error(
				`Failed to convert weapon ID ${currentWeaponId} to fighter object`
			);
		}

		return currentFighterObject;
	};
}
export default new FightersView();
