// Helper
import { WEAPON_SLOT } from "../../helper/ship_properties";
import { GENERIC_STRING } from "../../helper/ui/ui_main";
import CLASS_NAMES from "../../helper/ui/class_names";
import DATASET from "../../helper/ui/datasets";
import {
	toggleAdditionalInstalledWeapons,
	weaponSlotIdIntoWeaponSlotObject,
} from "../../helper/helper_functions";
// View
import View from "../view";
import FighterSprite from "./FighterSprite";

const STRING = {
	HEADER: "Fighter Bays",
};

class FightersView extends View {
	_localParent = `.${CLASS_NAMES.fighterContainer}`;

	#installedWeapons;
	#weaponSlots;

	#allFighters;

	#processData([userShipBuild, allFighters]) {
		this.#allFighters = allFighters;

		this.#installedWeapons = userShipBuild.installedWeapons;
		this.#weaponSlots = userShipBuild.weaponSlots;
	}
	generateMarkup() {
		this.#processData(this._data);

		const markup = this.#fighterContainerMarkup();
		return markup;
	}
	async #fighterContainerMarkup() {
		const markup = await this.#fighterSlotsMarkup();

		return `
	        <ul class="${CLASS_NAMES.fighterSlotsContainer}">
	          <li class="${CLASS_NAMES.fighterSlotsContainerHeader}">
                <h5>${STRING.HEADER}</h5>
              </li>
	          <li class="${CLASS_NAMES.fighterSlots}">
	            ${markup}
	          </li>
			  <div class="${CLASS_NAMES.fighterPopUp}"></div>
	        </ul>
	`;
	}

	async #fighterSlotsMarkup() {
		const fighterSlots = this.#createFighterSlotsArray();
		if (fighterSlots.length === 0) return GENERIC_STRING.EMPTY;

		const results = await Promise.all(
			fighterSlots.map(async (fighterSlot) => {
				const currentFighter = this.#findCurrentFighter(fighterSlot);

				const crrFg = currentFighter
					? await FighterSprite.renderElement(currentFighter)
					: GENERIC_STRING.EMPTY;

				return `
						<div class="${CLASS_NAMES.weaponSpriteParent}">
						<div class="${CLASS_NAMES.fighterSlotContainer}">
							<figure class="${CLASS_NAMES.fighterSlot}"
								${DATASET.dataFighterId}="${fighterSlot.id}">
								${crrFg}
							</figure>
						</div>
							${this.#fighterCostMarkup(currentFighter)}
						</div>
      					`;
			})
		);

		return results.join(GENERIC_STRING.EMPTY); // return as a single markup string
	}
	#fighterCostMarkup = (currentFighterObject) => {
		const opCost = currentFighterObject.opCost ?? GENERIC_STRING.EMPTY;
		return `<p class="${CLASS_NAMES.fighterSpriteCost}">${opCost}</p>`;
	};

	#createFighterSlotsArray = () => {
		return this.#weaponSlots.filter(
			(fighterObject) => fighterObject.type === WEAPON_SLOT.TYPE.LAUNCH_BAY
		);
	};

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
		if (currentWeaponId === GENERIC_STRING.EMPTY) return GENERIC_STRING.EMPTY;

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
