import { HULLMODS } from "./HullModData";
// ViewModels
import ViewModel from "../../ViewModel";

const HULLMOD_ID = "id";
class HullModFilter extends ViewModel {
	constructor() {
		super();
	}
	controller(hullModArray, userShipBuild) {
		return [
			...this.#filterBuildInHullMods(hullModArray, userShipBuild),
			...this.#filterHullMods(hullModArray, userShipBuild),
		];
	}
	#filterBuildInHullMods(hullModArray, userShipBuild) {
		const reason = "Already Build In";
		const builtInMods = userShipBuild.hullMods.builtInMods;

		if (!builtInMods) return [];

		const hullModObject = hullModArray.filter((hullMod) =>
			builtInMods.find((builtHullMod) => builtHullMod === hullMod.id)
		);
		return hullModObject.map((hullMod) => [hullMod, reason]);
	}

	#filterHullMods(hullModArray, userShipBuild) {
		// grabs keys from hullMods (Categories like FIGHTER / ENGINE)
		const hullModsCategoryKeys = Object.keys(HULLMODS);

		// Create a OBJECT with OBJECTS (key:value)
		const allModifiers = hullModsCategoryKeys.reduce((acc, categoryKey) => {
			// FIND hullMods by their category. For example all fighters
			const [categoryObjectArray] = this.findHullModKeyName(
				HULLMODS,
				categoryKey
			);

			// create an object with [proper Id and filterReason function]
			// (reason to filter the hullMod => if any);
			Object.keys(categoryObjectArray).forEach((hullModId) => {
				const { id: targetId, filterReason: targetFunction = null } =
					HULLMODS[categoryKey][hullModId];

				if (targetFunction) {
					acc[targetId] = targetFunction;
				}
			});

			return acc;
		}, {});

		// find hullMods from all usablehullMods
		return hullModArray
			.map((hullMod) => {
				// if finds modifier calls the function, if not return null
				const modifierFn = allModifiers[hullMod.id];
				return modifierFn ? modifierFn(hullMod, userShipBuild) : null;
			})
			.filter(Boolean); // remove undefined
	}

	filterDuplicateHullMods(greenArray, redArray) {
		if (!Array.isArray(redArray) || redArray.length < 1) return greenArray;

		return greenArray.filter((hullModObj) => {
			const duplicate = redArray.find((redObj) => hullModObj.id === redObj?.id);
			if (!duplicate) return hullModObj;
		});
	}
}
export default new HullModFilter();
