import WeaponArcView from "./WeaponArcView.js";
import WeaponBackgroundSpriteView from "./WeaponBackgroundSpriteView.js";

// Generic
import classNames from "../../helper/DomClassNames.js";
import * as URL from "../../helper/url.js";
import altTextLib from "../../helper/altTextLib.js";

// Old implementation
// I need to change the name
class WeaponSpriteView {
	renderElement([weaponObject, weaponSlot]) {
		const markup = `
				<div class="${classNames.weaponSpriteParent}">
					${this.#weaponBackgroundSpriteMarkup(weaponSlot, weaponObject)}
					${this.#weaponSpriteMarkup(weaponObject)}
				</div>
				${WeaponArcView.renderElement(weaponSlot)}`;
		return markup;
	}
	#weaponBackgroundSpriteMarkup = (wpnSlot, wpnObject) => {
		return `${WeaponBackgroundSpriteView.renderElement(
			this.#weaponType(wpnSlot, wpnObject),
			this.#weaponSize(wpnSlot, wpnObject)
		)}`;
	};

	#weaponSpriteMarkup = (wpnObject) => {
		if (!wpnObject) return "";

		const turretSprite = wpnObject.additionalData.turretSprite;
		const turretGunSprite = wpnObject.additionalData.turretGunSprite;

		return `
				<div class="${classNames.weaponSprite}">
					<img src="/${URL.DATA}/${turretSprite}" 
						alt="${altTextLib.weaponBaseSprite} class="${classNames.weaponSpriteBase}"
					/>
					${this.#gunSpriteMarkUp(turretGunSprite)}
				</div>
				`;
	};

	#gunSpriteMarkUp = (turretGunSprite) =>
		turretGunSprite
			? `<img src="/${URL.DATA}/${turretGunSprite}" alt="${altTextLib.turrentGunSprite}" class="${classNames.weaponSpriteGun}" />`
			: "";

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
