export const updateInstalledHullMod = (
	hullmodId,
	userShipBuild,
	allHullMods
) => {
	const { hullMods } = userShipBuild;

	const installedHullMods = hullMods.installedHullMods;

	const hullModObject = allHullMods.find(({ id }) => id === hullmodId);

	const isHullModInstalled = installedHullMods.includes(hullModObject);
	// if hullMod is installed create new array, without it
	const updatedInstalledHullMods = isHullModInstalled
		? installedHullMods.filter(({ id }) => id !== hullmodId)
		: [...installedHullMods, hullModObject];

	return {
		...hullMods,
		installedHullMods: updatedInstalledHullMods,
	};
};

export const normalizedHullSize = (currentHullMod, shipSize) => {
	const differentValueBasedOnShipSize = {
		CAPITAL_SHIP: "cost_capital",
		CRUISER: "cost_cruiser",
		DESTROYER: "cost_dest",
		FRIGATE: "cost_frigate",
	};
	const keyToFind = differentValueBasedOnShipSize[shipSize];
	return currentHullMod[keyToFind];
};
