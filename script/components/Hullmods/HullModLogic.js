import {
	SHIELD_TYPE,
	WEAPON_SLOT_TYPE,
	HULL_SIZE,
	SHIP_TYPE,
} from "../../helper/Properties";

import { HULLMODS } from "./HullModData";
// frontshield
class HullModLogic {
	controller(userShipBuild) {
		const newUserShipBuild = this.#installedHullModLogic(userShipBuild);
		console.log(newUserShipBuild);
		// return newUserShipBuild;
	}
	#buildInLogic(userShipBuild) {
		const { builtInMods } = userShipBuild.hullMods;
	}
	#installedHullModLogic(userShipBuild) {
		const shieldType = userShipBuild.shieldType;
		const { installedHullMods } = userShipBuild.hullMods;

		if (!installedHullMods || installedHullMods.length < 1)
			return userShipBuild;

		console.log(installedHullMods);
		// frontshield
		// HULLMODS
		// additional_berthing
		// const test = installedHullMods.find((hullModId) => hullModId);
		// frontshield
		console.log(HULLMODS);
		function findKeyValues(obj, searchKey, matches = []) {
			for (const key in obj) {
				if (key === searchKey) {
					matches.push({ key, value: obj[key] });
				}
				if (typeof obj[key] === "object" && obj[key] !== null) {
					findKeyValues(obj[key], searchKey, matches);
				}
			}
			return matches;
		}
		console.log(findKeyValues(HULLMODS, "frontshield"));
	}
}
export default new HullModLogic();
