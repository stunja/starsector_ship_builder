import WeaponArcView from "./WeaponArcView.js";
import WeaponBackgroundSpriteView from "./WeaponBackgroundSpriteView.js";

// Generic
import classNames from "../../helper/DomClassNames.js";
import URL from "../../helper/url.js";
import altTextLib from "../../helper/altTextLib.js";
import { GENERIC_STRING } from "../../helper/MagicStrings.js";
import { imageLoader } from "../../helper/helperFunction.js";

// Old implementation
// I need to change the name
class WeaponSpriteView {
	async renderElement([weaponObject, weaponSlot]) {
		const spriteMarkup = await this.#weaponSpriteMarkupAsync(weaponObject);

		const markup = `
				<div class="${classNames.weaponSpriteParent}">
					${this.#weaponBackgroundSpriteMarkup(weaponSlot, weaponObject)}
					${spriteMarkup}
				</div>
				${WeaponArcView.renderElement(weaponSlot)}`;
		return markup;
	}

	#weaponBackgroundSpriteMarkup = (wpnSlot, wpnObject) => {
		const markup = `${WeaponBackgroundSpriteView.renderElement(
			this.#weaponType(wpnSlot, wpnObject),
			this.#weaponSize(wpnSlot, wpnObject)
		)}`;

		return markup;
	};

	async #weaponSpriteMarkupAsync(wpnObject) {
		if (!wpnObject) return Promise.resolve(GENERIC_STRING.EMPTY);

		const { turretSprite, turretGunSprite } = wpnObject.additionalData;

		const promises = [
			imageLoader(turretSprite),
			turretGunSprite ? imageLoader(turretGunSprite) : Promise.resolve(null),
		];

		return Promise.all(promises).then(([turretImg, gunImg]) => {
			const turretHTML = turretImg
				? `<img src="${turretImg.src}" alt="${altTextLib.weaponBaseSprite}" class="${classNames.weaponSpriteBase}" />`
				: GENERIC_STRING.EMPTY;

			const gunHTML = gunImg
				? `<img src="${gunImg.src}" alt="${altTextLib.turrentGunSprite}" class="${classNames.weaponSpriteGun}" />`
				: GENERIC_STRING.EMPTY;

			return `
			<div class="${classNames.weaponSprite}">
				${turretHTML}
				${gunHTML}
			</div>
		`;
		});
	}

	#weaponType = (weaponSlot, weaponObject) =>
		weaponSlot
			? weaponSlot.type.toLowerCase()
			: weaponObject.additionalData.type.toLowerCase();

	#weaponSize = (weaponSlot, weaponObject) =>
		weaponSlot
			? weaponSlot.size.toLowerCase()
			: weaponObject.additionalData.size.toLowerCase();
}
export default new WeaponSpriteView();
