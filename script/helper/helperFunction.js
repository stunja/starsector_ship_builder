// Import
import { HULLMODS } from "../components/Hullmods/HullModData";
//
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

export const extractDataFromObject = (propertiesToExtract, data) =>
	propertiesToExtract.reduce(
		(acc, key) => ({
			...acc,
			[key]: data[key],
		}),
		{}
	);

export const updateUserShipBuildWithHullModLogic = function (
	userShipBuild,
	baseUserShipBuild
) {
	const { installedHullMods, builtInMods } = userShipBuild.hullMods;
	const { hullMods, installedWeapons, capacitors, vents } = userShipBuild;

	// baseUserShipBuild to reset userShipBuild // to clean before implementing hullModEffects
	const resetUserShipBuild = {
		...baseUserShipBuild,
		hullMods,
		installedWeapons,
		capacitors,
		vents,
	};

	const updateShipBuild = () => {
		let currentShipBuild = resetUserShipBuild;
		const userShipBuildWithActiveHullModEffect = installedHullMods
			?.map((hullMod) => {
				const [hullModObject] = findHullModKeyName(HULLMODS, hullMod.id);

				if (!hullModObject) {
					console.warn(`Hull mod not found: ${hullMod.id}`);
					return null;
				}

				if (hullModObject.hullModLogic) {
					return (currentShipBuild = hullModObject.hullModLogic(
						currentShipBuild,
						hullMod
					));
				}

				return null;
			})
			.filter(Boolean);

		return userShipBuildWithActiveHullModEffect;
	};

	// Reset UserShipBuild
	if (updateShipBuild().length < 1) {
		return resetUserShipBuild;
	}

	return updateShipBuild().at(-1);
};

export const findHullModKeyName = function (obj, searchKey, matches = []) {
	// Early return if obj is null or not an object
	if (!obj || typeof obj !== "object") return matches;

	// Direct key match
	if (obj[searchKey] !== undefined) {
		matches.push(obj[searchKey]);
	}

	// Recursive search through object properties
	for (const key in obj) {
		if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
			findHullModKeyName(obj[key], searchKey, matches);
		}
	}

	return matches;
};
/////
//! Probably Remove Later
// Why do I even need these? too simple to even keep, just need to rework original
export const weaponSlotIdIntoWeaponSlotObject = (allWeapons, weaponSlotId) =>
	allWeapons.find((slot) => slot.id === weaponSlotId);

// Why do I even need these? too simple to even keep, just need to rework original
export const findCurrentWeaponSlotFromWeaponSlotId = (
	weaponSlots,
	weaponSlotId
) => weaponSlots.find((slot) => slot.id === weaponSlotId);
