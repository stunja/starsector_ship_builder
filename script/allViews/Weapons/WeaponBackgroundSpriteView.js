import classNames from "../../helper/DomClassNames.js";
import View from "../../allViews/view.js";

// Old implementation
class WeaponBackgroundSpriteView {
	// Difference between the two, is that Dual Sprite
	// has two different sprites for example "circle inside rect".
	static STANDARD_WEAPONS = ["ballistic", "energy", "missile"];
	static DUAL_SPRITE_WEAPONS = ["composite", "hybrid", "synergy"];

	renderElement(weaponType, weaponSize) {
		return `
		<div class="${classNames.weaponBackgroundSpriteParent}">
			${this.#generateFinalMarkup(weaponType, weaponSize)}
		</div>`;
	}

	#initialMarkup(size, type, opacity) {
		// Size is for rem size
		// type is for color / shape
		// oppacity for oppacity. Strong in the outer edges and weak in smallest sprite
		return `<div class="${classNames.weaponBackgroundSprite} 
				${classNames.weaponBackgroundSpriteSize}--${size} 
				${classNames.weaponBackgroundSpriteType}--${type} 
				${classNames.weaponBackgroundSpriteOppacity}--${opacity}"></div>`;
	}

	#getStandardWeaponMarkup(weaponSize, weaponType) {
		// Three sizes
		// if size large, for example three rectangles inside of each others
		const sizeConfigs = {
			small: [{ size: "small", opacity: "full" }],
			medium: [
				{ size: "small", opacity: "medium" },
				{ size: "medium", opacity: "full" },
			],
			large: [
				{ size: "small", opacity: "light" },
				{ size: "medium", opacity: "medium" },
				{ size: "large", opacity: "full" },
			],
		};

		const config = sizeConfigs[weaponSize];
		if (!config) {
			console.warn(`Invalid weapon size: ${weaponSize}`);
			return "";
		}

		return config
			.map(({ size, opacity }) =>
				this.#initialMarkup(size, weaponType, opacity)
			)
			.join("");
	}

	#getDualSpriteMarkup(weaponSize, weaponType) {
		return Array(2)
			.fill(null)
			.map(() => this.#initialMarkup(weaponSize, weaponType, "full"))
			.join("");
	}

	#generateFinalMarkup(weaponType, weaponSize) {
		if (WeaponBackgroundSpriteView.STANDARD_WEAPONS.includes(weaponType)) {
			return this.#getStandardWeaponMarkup(weaponSize, weaponType);
		}

		if (WeaponBackgroundSpriteView.DUAL_SPRITE_WEAPONS.includes(weaponType)) {
			return this.#getDualSpriteMarkup(weaponSize, weaponType);
		}

		//? I dont remember why decorative is here
		if (weaponType === "decorative") {
			return "";
		}

		console.warn(`Unknown weapon type: ${weaponType}`);
		return "";
	}
}
export default new WeaponBackgroundSpriteView();
