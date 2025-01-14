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

//! I need to remove this
export const calculateHullModCost = (hullMod) =>
	Number(hullMod[state.currentShipBuild.hullModCost]);

export const weaponSlotIdIntoWeaponSlotObject = (allWeapons, weaponSlotId) =>
	allWeapons.find((slot) => slot.id === weaponSlotId);

export const findCurrentWeaponSlotFromWeaponSlotId = (
	weaponSlots,
	weaponSlotId
) => weaponSlots.find((slot) => slot.id === weaponSlotId);

export const extractDataFromObject = (propertiesToExtract, data) =>
	propertiesToExtract.reduce(
		(acc, key) => ({
			...acc,
			[key]: data[key],
		}),
		{}
	);
