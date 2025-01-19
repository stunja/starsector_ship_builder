// Helper Functions
import classNames from "../../helper/DomClassNames";
import URL from "../../helper/url";

class FighterSprite {
	#maxFighters;
	#currentWeaponSprite;
	#spriteLocation;

	#processData(crrFighter) {
		// console.log(crrFighter);
		this.#maxFighters = crrFighter.num;
		// console.log(crrFighter.additionalData.spriteName);
		this.#currentWeaponSprite = crrFighter.additionalData.spriteName;
		this.#spriteLocation = `./${URL.DATA}/${this.#currentWeaponSprite}`;
	}
	renderElement(crrFighter) {
		this.#processData(crrFighter);

		const markup = `
                    <div class="${classNames.weaponSpriteParent}">
						<div class="${classNames.fighterSpriteContainer}">
                            ${this.#fighterSpritesRender()}
						</div>
					</div>`;
		return markup;
	}

	#fighterSpritesRender() {
		// Draw sprites equal to number of fighters
		return Array.from({ length: this.#maxFighters }, (_, i) =>
			this.#fighterSpriteMarkUp(i + 1)
		).join("");
	}
	// Draw the sprite | Sprites can be drawn up to 6 in the same component
	// I then use CSS to position them correctly.
	#fighterSpriteMarkUp = (fighterNumber) =>
		`<img src="${this.#spriteLocation}" alt="fighter sprite" 
            class="${classNames.fighterSprite} ${
			classNames.fighterSprite
		}--${fighterNumber} ${classNames.fighterSpritesMax}--${this.#maxFighters}" 
        />`;
}
export default new FighterSprite();
