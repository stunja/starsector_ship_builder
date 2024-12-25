import classNames from "../../helper/DomClassNames.js";
import * as URL from "../../helper/url.js";

class FighterSprites {
	// Draw the sprite | Sprites can be drawn up to 6 in the same component
	// I then use CSS to position them correctly.
	#fighterSpriteMarkUp = (fighterNumber, fighterMax, currentWeaponSprite) => {
		const spriteLocation = `./${URL.DATA}/${currentWeaponSprite}`;
		return `<img src="${spriteLocation}" alt="fighter sprite" class="${classNames.fighterSprite} ${classNames.fighterSprite}--${fighterNumber} ${classNames.fighterSpritesMax}--${fighterMax}" />`;
	};

	// Draw sprites equal to number of fighters
	#fighterArrayMarkUp = (currentFighterObject) => {
		const currentWeaponSprite =
			currentFighterObject.additionalFighterData.spriteName;
		const maxFighters = currentFighterObject.num;

		// Create an Array from a number, and inject Single fighterSprites equal to fighter Num (wing size)
		return Array.from(
			{ length: maxFighters },
			(_, i) =>
				`${this.#fighterSpriteMarkUp(i + 1, maxFighters, currentWeaponSprite)}`
		).join("");
	};
	#fighterCostMarUp = (currentFighterObject) =>
		`<p class="${classNames.fighterSpriteCost}">${currentFighterObject.op_cost}</p>`;

	render(currentFighterObject) {
		const markup = `
					<div class="${classNames.weaponSpriteParent}">
						<div class="${classNames.fighterSpriteContainer}">
                            ${this.#fighterArrayMarkUp(currentFighterObject)}
						</div>
						${this.#fighterCostMarUp(currentFighterObject)}
					</div>`;
		return markup;
	}
}
export default new FighterSprites();
