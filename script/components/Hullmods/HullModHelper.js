import HULLMODS_DATA from "../../helper/HullModData";
import { GENERIC_STRING } from "../../helper/MagicStrings";

const MAGIC_NUMBER = {
	ZERO: 0,
};
const WEAPON_SLOT_TYPE = {
	LAUNCH_BAY: "LAUNCH_BAY",
};
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
const HULL_SIZE = {
	FRIGATE: "FRIGATE",
};
const HULLMODS = {
	WEAPONS: {
		ballistic_rangefinder: "ballistic_rangefinder", // Ballistic Rangefinder (Needs Baliistic Weapon Slots)
	},
	CARRIER: {
		converted_hangar: "converted_hangar", // Converted Hangar (Not On phase Ship)
		defensive_targeting_array: "defensive_targeting_array", // Defensive Targeting Array (No Fighter Bays)
		expanded_deck_crew: "expanded_deck_crew", // Expanded Deck Crew (No Standart fighter bays)
		recovery_shuttles: "recovery_shuttles", // Recovery Shuttles (No Fighter Bays)
	},
	SPECIAL: {
		neural_integrator: "neural_integrator", // Neural Integrator (Turn off, only automated Ships)
	},
	LOGISTICS: {
		converted_fighterbay: "converted_fighterbay", // Converted Fighter Bay (Build In Fighter Bays Only)
		militarized_subsystems: "militarized_subsystems", // Militarized Subsystems (only CIV grade hulls)
	},
	SHIELD: {
		frontemitter: "frontemitter", // Shield Conversion - Front
		adaptiveshields: "adaptiveshields", // Shield Conversion - OMNI
		frontshield: "frontshield", // Makeshift Shield Generator (Not on Phase Ships)

		// Secondary Shield
		stabilizedshieldemitter: "stabilizedshieldemitter", // Stabilized Shields
		hardenedshieldemitter: "hardenedshieldemitter", // Hardened Shields
		extendedshieldemitter: "extendedshieldemitter", // Extended Shields
		advancedshieldemitter: "advancedshieldemitter", // Accelerated Shields
		shield_shunt: "shield_shunt", // Shield Shunt
	},
	// Phase
	PHASE: {
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
		const hidePhase = () => {
			const reason = "Not a PHASE ship";
			const array = [
				HULLMODS.PHASE.adaptive_coils,
				HULLMODS.PHASE.phase_anchor,
			];

			return array.map((hullModId) =>
				hullModLogic.hullModToRejectAndGiveReason(
					hullModArray,
					hullModId,
					reason
				)
			);
		};
		const hideNoShield = () => {
			const reason = "Has a Shield";
			const array = [HULLMODS.SHIELD.frontshield];

			return array.map((hullModId) =>
				hullModLogic.hullModToRejectAndGiveReason(
					hullModArray,
					hullModId,
					reason
				)
			);
		};
		const hideFrontShield = () => {
			const reason = "Already Has Front Shield";
			const array = [HULLMODS.SHIELD.frontemitter];

			return array.map((hullModId) =>
				hullModLogic.hullModToRejectAndGiveReason(
					hullModArray,
					hullModId,
					reason
				)
			);
		};
		const hideAllShields = () => {
			const reason = "Ship has No Shield";
			const array = Object.keys(HULLMODS.SHIELD);

			return array.map((hullModId) =>
				hullModLogic.hullModToRejectAndGiveReason(
					hullModArray,
					hullModId,
					reason
				)
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
			return [...hideAllShields()];
		}

		// No Shield Ship
		if (shieldType === SHIELD_TYPE.NONE) {
			const reason = "Ship has No Shields";

			return hullModToRejectAndGiveReason(HULLMODS.SHIELD.frontemitter, reason);
		}
	},

	filterSpecialRules: (hullModArray, _userShipBuild) => {
		const reason = "Only Automated Ships";
		const array = [HULLMODS.SPECIAL.neural_integrator];

		return array.map((hullModId) =>
			hullModLogic.hullModToRejectAndGiveReason(hullModArray, hullModId, reason)
		);
	},
	filterByFighterSlots: (hullModArray, userShipBuild) => {
		const { fighterBays, weaponSlots, hullSize, shieldType } = userShipBuild;

		const array = [];
		const buildInFighterSlots = weaponSlots.some(
			(hullMod) => hullMod.type === WEAPON_SLOT_TYPE.LAUNCH_BAY
		);

		if (fighterBays === MAGIC_NUMBER.ZERO || !Number.isFinite(fighterBays)) {
			array.push(
				[HULLMODS.CARRIER.expanded_deck_crew, "No Fighter Bays"],
				[HULLMODS.CARRIER.defensive_targeting_array, "No Fighter Bays"],
				[HULLMODS.CARRIER.recovery_shuttles, "No Fighter Bays"]
			);
		}

		if (!buildInFighterSlots) {
			array.push([HULLMODS.LOGISTICS.converted_fighterbay, "No Build In Bays"]);
		}

		if (
			!buildInFighterSlots ||
			shieldType === SHIELD_TYPE.PHASE ||
			hullSize === HULL_SIZE.FRIGATE
		) {
			array.push([
				HULLMODS.CARRIER.converted_hangar,
				!buildInFighterSlots
					? "No BuildIn Bays"
					: SHIELD_TYPE.PHASE
					? "Not on Phase Ship"
					: hullSize === HULL_SIZE.FRIGATE
					? "Not on Frigates"
					: console.warn("filterByFighterSlots"),
			]);
		}

		return array.map(([hullModId, reason]) =>
			hullModLogic.hullModToRejectAndGiveReason(hullModArray, hullModId, reason)
		);
	},

	filterDuplicateHullMods: (greenArray, redArray) => {
		if (!Array.isArray(redArray) || redArray.length < 1) return greenArray;

		return greenArray.filter((hullModObj) => {
			const duplicate = redArray.find((redObj) => hullModObj.id === redObj?.id);
			if (!duplicate) return hullModObj;
		});
	},

	hullModToRejectAndGiveReason: (hullModArray, target, reasonToBlock) => [
		hullModArray.find((hullMod) => hullMod.id === target),
		reasonToBlock,
	],
};

//
