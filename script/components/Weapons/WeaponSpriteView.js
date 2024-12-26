import WeaponArcView from "./WeaponArcView.js";
import WeaponBackgroundSpriteView from "./WeaponBackgroundSpriteView.js";

// Generic
import classNames from "../../helper/DomClassNames.js";
import * as URL from "../../helper/url.js";
import altTextLib from "../../helper/altTextLib.js";

class WeaponSpriteView {
	render(weaponObject, weaponSlot) {
		const markup = `
				<div class="${classNames.weaponSpriteParent}">
					${this.#weaponBackgroundSpriteMarkup(weaponSlot, weaponObject)}
					${this.#weaponSpriteMarkup(weaponObject)}
				</div>
				${WeaponArcView.render(weaponSlot)}`;
		return markup;
	}
	#weaponBackgroundSpriteMarkup = (wpnSlot, wpnObject) => {
		return `${WeaponBackgroundSpriteView.render(
			this.#weaponType(wpnSlot, wpnObject),
			this.#weaponSize(wpnSlot, wpnObject)
		)}`;
	};

	#weaponSpriteMarkup = (wpnObject) => {
		const turretSprite = wpnObject.additionalWeaponData.turretSprite;
		const turretGunSprite = wpnObject.additionalWeaponData.turretGunSprite;

		return `
				<div class="${classNames.weaponSprite}">
					<img src="/${URL.DATA}/${turretSprite}" alt="${altTextLib.weaponBaseSprite}" 
					class="${classNames.weaponSpriteBase}"/>
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
			: weaponObject.additionalWeaponData.type.toLowerCase();

	#weaponSize = (weaponSlot, weaponObject) =>
		weaponSlot
			? weaponSlot.size.toLowerCase()
			: weaponObject.additionalWeaponData.size.toLowerCase();
}
export default new WeaponSpriteView();
