import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";
import { weaponSlotIdIntoWeaponSlotObject } from "../../helper/helperFunction";

import View from "../view";
import FighterSprite from "./FighterSprite";

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

	#allWeapons;
	#processData([userShipBuild, allWeapons]) {
		this.#allWeapons = allWeapons;

		this.#userShipBuild = userShipBuild;
		this.#installedWeapons = userShipBuild.installedWeapons;
		this.#weaponSlots = userShipBuild.weaponSlots;
	}
	generateMarkup() {
		this.#processData(this._data);

		console.log("test");
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
		// ${FighterSprite.renderElement(crrFighter)}
		// ${currentFighter ? FighterSprite.renderElement(currentFighter) : ""}
		//prettier-ignore
		return fighterSlots
			.map(
				(fighterSlot) => {
					const currentFighter = this.#findCurrentFighter(fighterSlot);
				return	`
                        <div class="${classNames.fighterSlotContainer}">
                            <figure class="${classNames.smallImageBox} ${classNames.fighterSlot}"
                                ${DataSet.dataFighterId}="${fighterSlot.id}"
                            >
								<p>${currentFighter}</p>
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

	#findCurrentFighter = (fighterSlot) =>
		this.#installedWeapons.find(([id, weapon]) => {
			if (id === fighterSlot.id) {
				// console.log("test");
				console.log(weapon);
				//! issue here, weapon gives id triden_wing
				const wpnObj = weaponSlotIdIntoWeaponSlotObject(
					this.#allWeapons,
					weapon
				);
				console.log(wpnObj); // this is undefined
				return wpnObj;
			}
		});
}
export default new FightersView();
