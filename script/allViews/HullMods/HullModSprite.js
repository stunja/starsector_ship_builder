// Helper Functions
import { GENERIC_STRING } from "../../helper/ui/ui_main";
import { imageLoader } from "../../helper/helper_functions";

//? this type of implementation is necessary. Otherwise incorrectly imports as an image.
class HullModSprite {
	async renderElement(currentHullMod) {
		const markup = await this.#hullModSrpiteMarkup(currentHullMod);
		return markup;
	}

	// Draw sprites equal to number of fighters
	async #hullModSrpiteMarkup(currentHullMod) {
		if (!currentHullMod) return Promise.resolve(GENERIC_STRING.EMPTY);

		try {
			const hullMod = await imageLoader(currentHullMod.sprite);

			const markup = `<img src="${hullMod.src}" alt="Image of a ${currentHullMod.name}">`;
			return markup;
		} catch (err) {
			console.warn(err);
			return GENERIC_STRING.EMPTY;
		}
	}

	spriteMarkup(src, name) {
		return `<img src="${src}" alt="Image of a ${name}">`;
	}
}
export default new HullModSprite();
