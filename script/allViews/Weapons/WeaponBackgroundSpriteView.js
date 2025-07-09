// View
// Helper
import classNames from "../../helper/DomClassNames.js";
import { GENERIC_STRING } from "../../helper/MagicStrings.js";

// Difference between the two, is that Dual Sprite
// has two different sprites for example "circle inside rect".
const SPRITE_GROUP = {
	STANDARD_WEAPONS: ["ballistic", "energy", "missile"],
	DUAL_SPRITE_WEAPONS: ["composite", "hybrid", "synergy", "universal"],
};
const WEAPON_TYPE = {
	DECORATIVE: "decorative",
	SYSTEM: "system",
};
const PROPS = {
	SIZE: {
		SMALL: "small",
		MEDIUM: "medium",
		LARGE: "large",
	},
	OPACITY: {
		LIGHT: "light",
		MEDIUM: "medium",
		FULL: "full",
	},
};
// Three sizes
// if size large, for example three rectangles inside of each others
const SIZE_CONFIG = {
	small: [{ size: PROPS.SIZE.SMALL, opacity: PROPS.OPACITY.FULL }],
	medium: [
		{ size: PROPS.SIZE.SMALL, opacity: PROPS.OPACITY.MEDIUM },
		{ size: PROPS.SIZE.MEDIUM, opacity: PROPS.OPACITY.FULL },
	],
	large: [
		{ size: PROPS.SIZE.SMALL, opacity: PROPS.OPACITY.LIGHT },
		{ size: PROPS.SIZE.MEDIUM, opacity: PROPS.OPACITY.MEDIUM },
		{ size: PROPS.SIZE.LARGE, opacity: PROPS.OPACITY.FULL },
	],
};

// Old implementation
class WeaponBackgroundSpriteView {
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
					${classNames.weaponBackgroundSpriteOppacity}--${opacity}">
				</div>`;
	}

	#getStandardWeaponMarkup(weaponSize, weaponType) {
		const config = SIZE_CONFIG[weaponSize];
		if (!config) {
			console.warn(`Invalid weapon size: ${weaponSize}`);
			return GENERIC_STRING.EMPTY;
		}

		return config
			.map(({ size, opacity }) =>
				this.#initialMarkup(size, weaponType, opacity)
			)
			.join(GENERIC_STRING.EMPTY);
	}

	#getDualSpriteMarkup(weaponSize, weaponType) {
		return Array(2)
			.fill(null)
			.map(() => this.#initialMarkup(weaponSize, weaponType, PROPS.SIZE.LARGE))
			.join(GENERIC_STRING.EMPTY);
	}

	#generateFinalMarkup(weaponType, weaponSize) {
		if (SPRITE_GROUP.STANDARD_WEAPONS.includes(weaponType)) {
			return this.#getStandardWeaponMarkup(weaponSize, weaponType);
		}

		if (SPRITE_GROUP.DUAL_SPRITE_WEAPONS.includes(weaponType)) {
			return this.#getDualSpriteMarkup(weaponSize, weaponType);
		}

		//? I dont remember why decorative is here
		if (
			weaponType === WEAPON_TYPE.DECORATIVE ||
			weaponType === WEAPON_TYPE.SYSTEM
		) {
			return GENERIC_STRING.EMPTY;
		}

		console.warn(`Unknown weapon type: ${weaponType}`);
		return GENERIC_STRING.EMPTY;
	}
}
export default new WeaponBackgroundSpriteView();
