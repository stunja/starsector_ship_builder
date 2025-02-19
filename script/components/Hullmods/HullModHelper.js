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
		// Phase
		adaptive_coils: "adaptive_coils", // Adaptive Phase Coils
		phase_anchor: "phase_anchor", // Phase Anchor
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
		console.log(shieldType);
		const hidePhase = () => {
			const reason = "Not a PHASE ship";
			const array = [
				HULLMODS.SHIELD.adaptive_coils,
				HULLMODS.SHIELD.phase_anchor,
			];

			return array.map((hullModId) =>
				hullModToRejectAndGiveReason(hullModId, reason)
			);
		};
		const hideNoShield = () => {
			const reason = "Has a Shield";
			const array = [HULLMODS.SHIELD.frontshield];

			return array.map((hullModId) =>
				hullModToRejectAndGiveReason(hullModId, reason)
			);
		};
		const hideFrontShield = () => {
			const reason = "Already Has Front Shield";
			const array = [HULLMODS.SHIELD.frontemitter];

			return array.map((hullModId) =>
				hullModToRejectAndGiveReason(hullModId, reason)
			);
		};
		// WHAT HULLMODS TO FILTER
		// FRONT SHIELD
		if (shieldType === SHIELD_TYPE.FRONT) {
			return [...hideFrontShield(), ...hidePhase(), ...hideNoShield()];
		}
		// OMNI SHIELD
		if (shieldType === SHIELD_TYPE.OMNI) {
			const reason = "Already Has OMNI Shield";

			return hullModToRejectAndGiveReason(
				HULLMODS.SHIELD.adaptiveshields,
				reason
			);
		}

		// PHASE
		if (shieldType === SHIELD_TYPE.PHASE) {
			// const reason = "Ship has No Shields";

			// const test = hullModToRejectAndGiveReason(
			// 	HULLMODS.SHIELD.adaptiveshields,
			// 	reason
			// );

			// return test;
			console.log("test");
			return [...hideFrontShield()];
		}

		// No Shield Ship
		if (shieldType === SHIELD_TYPE.NONE) {
			const reason = "Ship has No Shields";

			return hullModToRejectAndGiveReason(HULLMODS.SHIELD.frontemitter, reason);
		}

		function hullModToRejectAndGiveReason(target, string) {
			const hullModObj = hullModArray.find((hullMod) => hullMod.id === target);
			const reasonToBlock = string;
			return [hullModObj, reasonToBlock];
		}
	},

	filterDuplicateHullMods: (greenArray, redArray) => {
		if (!Array.isArray(redArray) || redArray.length < 1) return greenArray;

		return greenArray.filter((hullModObj) => {
			const duplicate = redArray.find((redObj) => hullModObj.id === redObj?.id);
			if (!duplicate) return hullModObj;
		});
	},
};
