import classNames from "../../helper/DomClassNames.js";
import URL from "../../helper/url.js";

class FighterSpritesView {
	// Draw the sprite | Sprites can be drawn up to 6 in the same component
	// I then use CSS to position them correctly.
	#fighterSpriteMarkup = (fighterNumber, fighterMax, currentWeaponSprite) => {
		const spriteLocation = `./${URL.DATA}/${currentWeaponSprite}`;
		return `<img src="${spriteLocation}" alt="fighter sprite" class="${classNames.fighterSprite} ${classNames.fighterSprite}--${fighterNumber} ${classNames.fighterSpritesMax}--${fighterMax}" />`;
	};

	// Draw sprites equal to number of fighters
	#fighterArrayMarkup = (currentFighterObject) =>
		// Create an Array from a number, and inject Single fighterSprites equal to fighter Num (wing size)
		Array.from(
			{ length: currentFighterObject.num },
			(_, i) =>
				`${this.#fighterSpriteMarkup(
					i + 1,
					currentFighterObject.num,
					currentFighterObject.additionalFighterData.spriteName
				)}`
		).join("");

	#fighterCostMarkup = (currentFighterObject) =>
		`<p class="${classNames.fighterSpriteCost}">${currentFighterObject.op_cost}</p>`;

	render(currentFighterObject) {
		const markup = `
					<div class="${classNames.weaponSpriteParent}">
						<div class="${classNames.fighterSpriteContainer}">
                            ${this.#fighterArrayMarkup(currentFighterObject)}
						</div>
						${this.#fighterCostMarkup(currentFighterObject)}
					</div>`;
		return markup;
	}
}
export default new FighterSpritesView();
