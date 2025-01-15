import DataSet from "../../helper/DataSet";
import classNames from "../../helper/DomClassNames";
import View from "../view";
import WeaponSpriteView from "./WeaponSpriteView";
import { weaponSlotIdIntoWeaponSlotObject } from "../../helper/helperFunction";

class WeaponSlotsView extends View {
	_localParent = `.${classNames.weaponSlots}`;
	#allWeapons;
	generateMarkup() {
		const [userShipBuild, allWeapons] = this._data;
		this.#allWeapons = allWeapons;

		const installedWeapons = userShipBuild.installedWeapons.filter(
			([_slotId, weaponId]) => weaponId !== ""
		);
		const markup = userShipBuild.weaponSlots
			.map((slot) => this.#weaponSlotMarkUp(slot, installedWeapons))
			.join("");

		return markup;
	}

	#weaponSlotMatchesInstalledWeapon = (currentWeaponSlot, installedWeapons) =>
		installedWeapons.find(([slot, _wpn]) => slot === currentWeaponSlot.id);

	#addWeaponSpriteToWeaponSlot = (currentWeaponSlot, installedWeapons) => {
		try {
			const currentInstalledWeapon = this.#weaponSlotMatchesInstalledWeapon(
				currentWeaponSlot,
				installedWeapons
			);
			if (!currentInstalledWeapon)
				throw new Error("currentInstalledWeapon is undefined");

			const [_installedSlotId, installedWpnId] = currentInstalledWeapon;

			return weaponSlotIdIntoWeaponSlotObject(this.#allWeapons, installedWpnId);
		} catch (err) {
			// return empty string, for markup
			// console.log(err);
			return "";
		}
	};
	#weaponSlotMarkUp(weaponSlot, installedWeapons) {
		if (weaponSlot.mount.toLowerCase() === "hidden") return;

		const weaponSize = weaponSlot.size.toLowerCase();
		const weaponType = weaponSlot.type.toLowerCase();

		const weaponObject = this.#addWeaponSpriteToWeaponSlot(
			weaponSlot,
			installedWeapons
		);
		const markup = `
				<button class="${classNames.weaponSlot} ${
			classNames.weaponSize
		}--${weaponSize} ${classNames.weaponType}--${weaponType}" ${
			DataSet.dataWeaponSlotId
		}="${weaponSlot.id}">
					${WeaponSpriteView.renderElement([weaponObject, weaponSlot])}
				</button>`;
		return markup;
	}
}

export default new WeaponSlotsView();
