// import { state } from "../model";

export const renameKeysFromCSVdata = function (obj) {
	const renameObj = {};

	Object.keys(obj).forEach((key) => {
		const camelCase = key
			.replaceAll("%", " ")
			.replaceAll("/", " ")
			.replace(/\s(.)/g, (match, char) => char.toUpperCase()) // Capitalize first letter after space
			.replace(/\s/g, "") // Remove spaces
			.replace(/^(.)/, (match, char) => char.toLowerCase()); // Lowercase first letter

		renameObj[camelCase] = obj[key];
	});

	return renameObj;
};
export const convertStringsIntoNumbersCSVdata = function (dataArray) {
	return dataArray.map((obj) => {
		const convertedObj = {};

		Object.keys(obj).forEach((key) => {
			if (!key) return;

			const value = obj[key];

			// if value is empty string, leave it as empty string, otherwise return a number
			const convertedValue = value !== "" ? Number(value) : "";

			convertedObj[key] = isNaN(convertedValue) ? value : convertedValue;
		});
		return convertedObj;
	});
};

// const applyGeneralRenamingRulesForKeys = function (key) {
// 	// Replace all non alphabetical characters with underscore __
// 	let newKey = key.replace(/[^a-zA-Z0-9]/g, "_");
// 	// remove underscore from the end of the stringas
// 	if (newKey.endsWith("_")) {
// 		newKey.slice(0, -1);
// 	}
// 	return newKey;
// };

// export const capitalizeFirstLetter = (string) => {
// 	return string.charAt(0).toUpperCase() + string.slice(1);
// };

//! I need to remove this
export const calculateHullModCost = (hullMod) =>
	Number(hullMod[state.currentShipBuild.hullModCost]);
