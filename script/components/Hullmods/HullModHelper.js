export const removeInstalledHullMod = (hullmodId, hullMods) => {
	const { installedHullMods } = hullMods;
	const isHullModInstalled = installedHullMods.includes(hullmodId);

	// if hullMod is installed create new array, without it
	const updatedInstalledHullMods = isHullModInstalled
		? installedHullMods.filter((mod) => mod !== hullmodId)
		: [...installedHullMods, hullmodId];

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

const SHIELD_TYPE = {
	FRONT: "FRONT",
	OMNI: "OMNI",
	PHASE: "PHASE",
	NONE: "NONE",
};
const HULLMODS = {
	SHIELD: {
		frontemitter: "frontemitter", // Shield Conversion - Front
		adaptiveshields: "adaptiveshields", // Shield Conversion - OMNI
		frontshield: "frontshield", // Makeshift Shield Generator
	},
};
export const hullModLogic = {
	filterBuildInHullMods: (hullModArray, builtInMods) => {
		const reason = "HullMod Already Built In";

		const hullModObject = hullModArray.filter((hullMod) =>
			builtInMods.find((builtHullMod) => builtHullMod === hullMod.id)
		);
		return hullModObject.map((hullMod) => [hullMod, reason]);
	},
	filterByShieldType: (hullModArray, shieldType) => {
		// FRONT SHIELD
		if (shieldType === SHIELD_TYPE.FRONT) {
			const reasonToBeUnavailable = "Already Has Front Shield";

			return hullModLogic.hullModToRejectAndGiveReason(
				hullModArray,
				HULLMODS.SHIELD.frontemitter,
				reasonToBeUnavailable
			);
		}

		// OMNI SHIELD
		if (shieldType === SHIELD_TYPE.OMNI) {
			const reasonToBeUnavailable = "Already Has OMNI Shield";

			return hullModLogic.hullModToRejectAndGiveReason(
				hullModArray,
				HULLMODS.SHIELD.adaptiveshields,
				reasonToBeUnavailable
			);
		}

		// PHASE
		if (shieldType === SHIELD_TYPE.PHASE) {
			const reasonToBeUnavailable = "Ship has No Shields";

			return hullModLogic.hullModToRejectAndGiveReason(
				hullModArray,
				HULLMODS.SHIELD.adaptiveshields,
				reasonToBeUnavailable
			);
		}

		// No Shield Ship
		if (shieldType === SHIELD_TYPE.NONE) {
			const reasonToBeUnavailable = "Ship has No Shields";

			return hullModLogic.hullModToRejectAndGiveReason(
				hullModArray,
				HULLMODS.SHIELD.frontemitter,
				reasonToBeUnavailable
			);
			// return hullModLogic.hullModToRejectAndGiveReason(
			// 	hullModArray,
			// 	HULLMODS.SHIELD.adaptiveshields,
			// 	reason
			// );
		}
	},
	hullModToRejectAndGiveReason: (array, target, string) => {
		const hullModObj = array.find((hullMod) => hullMod.id === target);
		const reasonToBlock = string;
		return [hullModObj, reasonToBlock];
	},
	filterDuplicateHullMods: (greenArray, redArray) => {
		if (!Array.isArray(redArray) || redArray?.length < 1) return greenArray;

		return greenArray.filter((hullModObj) => {
			const duplicate = redArray.find(
				([redObj]) => hullModObj.id === redObj?.id
			);
			if (!duplicate) return hullModObj;
		});
	},
};
