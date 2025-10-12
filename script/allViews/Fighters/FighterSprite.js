// Helper Functions
import CLASS_NAMES from "../../helper/ui/class_names";
import { GENERIC_STRING } from "../../helper/ui/ui_main";
import { imageLoader } from "../../helper/helper_functions";

class FighterSprite {
	async renderElement(crrFighter) {
		const renderFighterSpriteAsync = await this.#fighterSpriteMarkUpAsync(
			crrFighter
		);
		const markup = `
                    <div class="${CLASS_NAMES.weaponSpriteParent}">
						<div class="${CLASS_NAMES.fighterSpriteContainer}">
                            ${renderFighterSpriteAsync}
						</div>
					</div>`;

		return markup;
	}

	// Draw sprites equal to number of fighters
	async #fighterSpriteMarkUpAsync(crrFighter) {
		if (!crrFighter) return Promise.resolve(GENERIC_STRING.EMPTY);

		const numberOfFighters = crrFighter.num;
		const { spriteName } = crrFighter.additionalData;

		try {
			const fighter = await imageLoader(spriteName);
			const joinedSprites = Array.from({ length: numberOfFighters }, (_, i) => {
				return `
                <img src="${fighter.src}" alt="fighter sprite"
                class="${CLASS_NAMES.fighterSprite}
                ${CLASS_NAMES.fighterSprite}--${i + 1}
                ${CLASS_NAMES.fighterSpritesMax}--${numberOfFighters}"/>
            `;
			});
			return joinedSprites.join(GENERIC_STRING.EMPTY);
		} catch (err) {
			console.err(err);
			return GENERIC_STRING.EMPTY;
		}
	}
}
export default new FighterSprite();
