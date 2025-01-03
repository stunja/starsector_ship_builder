import { state } from "./model.js";

export const renameKeysFromCSVdata = function (obj) {
	const newObj = {};
	for (const key in obj) {
		let newKey =
			specificKeyReplacements[key] || applyGeneralRenamingRulesForKeys(key);
		newObj[newKey] = obj[key];
	}
	return newObj;
};
const specificKeyReplacements = {
	"8/6/5/4%": "unused_8654",
};

const applyGeneralRenamingRulesForKeys = function (key) {
	// Replace all non alphabetical characters with underscore __
	let newKey = key.replace(/[^a-zA-Z0-9]/g, "_");
	// remove underscore from the end of the stringas
	if (newKey.endsWith("_")) {
		newKey.slice(0, -1);
	}
	return newKey;
};

export const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const calculateHullModCost = (hullMod) =>
	Number(hullMod[state.currentShipBuild.hullModCost]);
