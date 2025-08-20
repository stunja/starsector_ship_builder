// Helper Functions
import classNames from "../../helper/DomClassNames";
import URL from "../../helper/url";
import { GENERIC_STRING } from "../../helper/MagicStrings";

class FighterSprite {
	async renderElement(crrFighter) {
		const renderFighterSpriteAsync = await this.#fighterSpriteMarkUpAsync(
			crrFighter
		);
		const markup = `
                    <div class="${classNames.weaponSpriteParent}">
						<div class="${classNames.fighterSpriteContainer}">
                            ${renderFighterSpriteAsync}
						</div>
					</div>`;

		return markup;
	}

	// Draw sprites equal to number of fighters
	async #fighterSpriteMarkUpAsync(crrFighter) {
		if (!crrFighter) return Promise.resolve(GENERIC_STRING.EMPTY);
		const numberOfFighters = crrFighter.num;

		const loadImage = (src) => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				console.log(src.additionalData);
				img.src = `/${URL.DATA}/${src}`;
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
			});
		};

		const { spriteName } = crrFighter.additionalData;

		return Promise.resolve(loadImage(spriteName)).then((fighter) => {
			const joinedSprites = Array.from({ length: numberOfFighters }, (_, i) => {
				return `
								<img src="${fighter.src}" alt="fighter sprite"
								class="${classNames.fighterSprite}
								${classNames.fighterSprite}--${i + 1}
								${classNames.fighterSpritesMax}--${numberOfFighters}"/>
							`;
			});

			return joinedSprites.join(GENERIC_STRING.EMPTY);
		});
	}
}
export default new FighterSprite();
