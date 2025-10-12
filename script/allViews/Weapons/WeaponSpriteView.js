import WeaponArcView from "./WeaponArcView.js";
import WeaponBackgroundSpriteView from "./WeaponBackgroundSpriteView.js";

// Generic
import CLASS_NAMES from "../../helper/ui/class_names.js";
import altTextLib from "../../helper/alt_text_lib.js";
import { GENERIC_STRING } from "../../helper/ui/ui_main.js";
import { imageLoader } from "../../helper/helper_functions.js";

// Old implementation
// I need to change the name
class WeaponSpriteView {
	async renderElement([
		weaponObject,
		weaponSlot,
		backgroundSpriteEqualToWeaponSize,
	]) {
		const spriteMarkup = await this.#weaponSpriteMarkupAsync(weaponObject);

		const markup = `
				<div class="${CLASS_NAMES.weaponSpriteParent}">
					${WeaponBackgroundSpriteView.renderElement(
						weaponObject,
						weaponSlot,
						backgroundSpriteEqualToWeaponSize
					)}
					${spriteMarkup}
				</div>
				${WeaponArcView.renderElement(weaponSlot)}`;
		return markup;
	}

	async #weaponSpriteMarkupAsync(wpnObject) {
		if (!wpnObject) return GENERIC_STRING.EMPTY;

		const { turretSprite, turretGunSprite } = wpnObject.additionalData;

		try {
			const promises = [
				imageLoader(turretSprite),
				turretGunSprite ? imageLoader(turretGunSprite) : null,
			];

			const [turretImg, gunImg] = await Promise.all(promises);

			const turretHTML = turretImg
				? `<img src="${turretImg.src}" alt="${altTextLib.weaponBaseSprite}" class="${CLASS_NAMES.weaponSpriteBase}" />`
				: GENERIC_STRING.EMPTY;

			const gunHTML = gunImg
				? `<img src="${gunImg.src}" alt="${altTextLib.turrentGunSprite}" class="${CLASS_NAMES.weaponSpriteGun}" />`
				: GENERIC_STRING.EMPTY;

			return `
            <div class="${CLASS_NAMES.weaponSprite}">
                ${turretHTML}
                ${gunHTML}
            </div>
        `;
		} catch (error) {
			console.error("Failed to load weapon sprites:", error);
			return GENERIC_STRING.EMPTY;
		}
	}
}
export default new WeaponSpriteView();
