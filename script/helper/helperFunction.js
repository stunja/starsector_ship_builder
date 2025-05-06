// Import
import { HULLMODS } from "../components/Hullmods/HullModData";
import {
	SHIELD_TYPE,
	HULL_SIZE,
	SHIP_TYPE,
	WEAPON_SLOT,
} from "../helper/Properties";
import { GENERIC_STRING } from "../helper/MagicStrings";
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
			const convertedValue =
				value !== GENERIC_STRING.EMPTY ? Number(value) : GENERIC_STRING.EMPTY;

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

	const newInstalledWeapons = updateInstalledWeapons(
		installedHullMods,
		installedWeapons
	);

	// baseUserShipBuild to reset userShipBuild // to clean before implementing hullModEffects
	let currentShipBuild = {
		...baseUserShipBuild,
		hullMods,
		installedWeapons: newInstalledWeapons || installedWeapons,
		capacitors,
		vents,
	};

	// Apply each hull mod effect sequentially
	const allHullMods = [...builtInMods, ...installedHullMods];

	if (!allHullMods.length) {
		return currentShipBuild;
	}

	for (const hullMod of allHullMods) {
		const [hullModObject] = findHullModKeyName(HULLMODS, hullMod.id);

		if (!hullModObject) {
			console.warn(`Hull mod not found: ${hullMod.id}`);
			continue;
		}

		if (hullModObject.hullModLogic) {
			currentShipBuild = hullModObject.hullModLogic(currentShipBuild, hullMod);
		}
	}

	return currentShipBuild;
};
// remove duplicateIWS
const updateInstalledWeapons = (installedHullMods, installedWeapons) => {
	const targetClass = "converted_hangar";
	// Converted Hangar
	const isHangarExpansionPresent = installedHullMods.some(
		({ id }) => id === targetClass
	);

	// exit if no additional installedWeapons are needed
	if (!isHangarExpansionPresent) {
		return installedWeapons.filter(
			([weaponSlotId, _weaponId]) =>
				weaponSlotId && !weaponSlotId.includes("IWS")
		);
	}
};
// IWS weapons are speciaal installedWeapons added by a HULLMOD
export const createNewWeaponSlotsAndInstalledWeapons = function (
	howManySlotsToCreate
) {
	const createNewProps = Array.from(
		{
			length: howManySlotsToCreate,
		},
		(_, i) => {
			const currentWeaponId = `IWS-${i + 100}`;
			return {
				newWeaponSlots: {
					id: currentWeaponId,
					mount: WEAPON_SLOT.MOUNT.HIDDEN,
					size: WEAPON_SLOT.SIZE.MEDIUM,
					type: WEAPON_SLOT.TYPE.LAUNCH_BAY,
				},
				newInstalledWeapons: [currentWeaponId, GENERIC_STRING.EMPTY],
			};
		}
	);
	return {
		newInstalledWeapons: createNewProps.map((arr) => arr.newInstalledWeapons),
		newWeaponSlots: createNewProps.map((arr) => arr.newWeaponSlots),
	};
};

// RemoveIwsWeapons
export const toggleAdditionalInstalledWeapons = function (
	installedWeapons,
	newInstalledWeapons
) {
	// Filter IWS weapons directly
	const iwsWeapons = installedWeapons.filter(
		([weaponSlotId, _weaponId]) => weaponSlotId && weaponSlotId.includes("IWS")
	);

	// Return early if no IWS weapons
	if (iwsWeapons.length < 1) {
		return newInstalledWeapons;
	}

	// Remove duplicates
	const seen = new Set();
	return iwsWeapons.filter((item) => {
		const id = item[0];
		if (seen.has(id)) {
			return false;
		}
		seen.add(id);
		return true;
	});
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

// Installed Weapons
export const AddRemoveInstalledWeapon = function (
	installedWeapons,
	weaponPopUpId,
	weaponSlotId
) {
	return installedWeapons.map(([installedSlotId, installedWeaponId]) => {
		// If weapon already exists in slot, remove it
		if (
			installedSlotId === weaponSlotId &&
			installedWeaponId === weaponPopUpId
		) {
			return [installedSlotId, GENERIC_STRING.EMPTY];
		}
		// if weapon dont match, keep the original
		if (installedSlotId !== weaponSlotId) {
			return [installedSlotId, installedWeaponId];
		}
		// Otherwise, add the new weapon
		return [installedSlotId, weaponPopUpId];
	});
};

// Put Installed Weapon On Top of An Array
export const pushTargetWeaponObjectOnTop = function (
	installedWeapons,
	weaponSlot,
	weaponArray
) {
	const installedWeapon = installedWeapons.find(
		([slotId, _wpnId]) => weaponSlot.id === slotId
	);

	// if installed weaponId exists, put it on top
	if (
		installedWeapon &&
		installedWeapon.length > 1 &&
		installedWeapon[1] !== GENERIC_STRING.EMPTY
	) {
		const targetId = installedWeapon[1];

		// Separate the target weapon and other weapons in one pass
		const target = [];
		const arrayWithoutTarget = [];

		weaponArray.forEach((wpnObj) => {
			if (wpnObj.id === targetId) {
				target.push(wpnObj);
			} else {
				arrayWithoutTarget.push(wpnObj);
			}
		});

		return [...target, ...arrayWithoutTarget];
	}

	// no change
	return weaponArray;
};

//
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
