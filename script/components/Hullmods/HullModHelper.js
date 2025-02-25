import HULLMODS_DATA from "../../helper/HullModData";
import { GENERIC_STRING } from "../../helper/MagicStrings";

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

const WEAPON_SLOT_TYPE = {
	LAUNCH_BAY: "LAUNCH_BAY",
};

const HULL_SIZE = {
	FRIGATE: "FRIGATE",
	DESTROYER: "DESTROYER",
	CRUISER: "CRUISER",
	CAPITAL_SHIP: "CAPITAL_SHIP",
};
const SHIP_TYPE = {
	CIVILIAN: "",
	MILITARY: "military",
};
const SLOT_TYPE = {
	BALLISTIC: "BALLISTIC",
};
const HULLMODS = {
	WEAPONS: {
		// Ballistic Rangefinder
		ballistic_rangefinder: {
			id: "ballistic_rangefinder",
			name: "Ballistic Rangefinder",
			_whyNot:
				"hullmod that can be installed on any Destroyer-class, Cruiser-class and Capital-class ship. (Have ballistic slots or hybrid)",
			reason: {
				frigate: "Not on Frigates",
				noBallisticSlots: "Dont have Ballistic or Hybrid Slots",
			},
			logic: function (hullMod, userShipBuild) {
				const { hullSize, weaponSlots } = userShipBuild;
				const reason = HULLMODS.WEAPONS.ballistic_rangefinder.reason;

				// BAL Range Finder
				const isFrigateHull = hullSize === HULL_SIZE.FRIGATE;

				const hasBallisticSlots = weaponSlots.some(
					(hullMod) => hullMod.type === SLOT_TYPE.BALLISTIC
				);
				// console.log(SLOT_TYPE.);
				// const hasHybridSlots = weaponSlots.some(
				// 	(hullMod) => hullMod.type === SLOT_TYPE.BALLISTIC
				// );

				if (isFrigateHull || !hasBallisticSlots) {
					return [
						hullMod,
						!hasBallisticSlots ? reason.noBallisticSlots : reason.isFrigateHull,
					];
				}
				return null;
			},
		},
		advancedcore: "advancedcore", // Advanced Targeting Core [BuildIn]
		targetingunit: "targetingunit", // Integrated Targeting Unit (Not compatible with core and Dedicated)
		// Dedicated Targeting Core is a hullmod that can only be installed on Cruiser-class & Capital-class ship.
		// Incompatible with Distributed Fire Control.
		dedicated_targeting_core: "dedicated_targeting_core", // Dedicated Targeting Core
	},
	CARRIER: {
		converted_hangar: "converted_hangar", // Converted Hangar (Not On phase Ship)
		defensive_targeting_array: "defensive_targeting_array", // Defensive Targeting Array (No Fighter Bays)
		expanded_deck_crew: "expanded_deck_crew", // Expanded Deck Crew (No Standart fighter bays)
		recovery_shuttles: "recovery_shuttles", // Recovery Shuttles (No Fighter Bays)
	},
	SPECIAL: {
		neural_integrator: "neural_integrator", // Neural Integrator (Turn off, only automated Ships)
		escort_package: "escort_package", // Escort Package (hullmod that can only be installed on Destroyer-class & Cruiser-class ships.)
	},
	LOGISTICS: {
		converted_fighterbay: "converted_fighterbay", // Converted Fighter Bay (Build In Fighter Bays Only)
		militarized_subsystems: "militarized_subsystems", // Militarized Subsystems (only CIV grade hulls)
	},
	BUILD_IN: {
		name: "Build In HullMods",
		reason: "HullMod Already Built In",
		_why: "",
		logic: function (hullModArray, userShipBuild) {
			const reason = HULLMODS.BUILD_IN.reason;
			const builtInMods = userShipBuild.hullMods.builtInMods;

			const hullModObject = hullModArray.filter((hullMod) =>
				builtInMods.find((builtHullMod) => builtHullMod === hullMod.id)
			);
			return hullModObject.map((hullMod) => [hullMod, reason]);
		},
	},
	SHIELD: {
		// Shield Conversion - Front
		frontemitter: {
			id: "frontemitter",
			name: "Shield Conversion - Front",
			reason: { front: "Already Has Front Shield", any: "Must have a Shield" },
			_why: "hullmod that can be installed on any ship that has shields",

			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.frontemitter.reason;

				const isNotOmniShield = shieldType !== SHIELD_TYPE.OMNI;
				const isFrontShield = shieldType === SHIELD_TYPE.FRONT;

				if (isNotOmniShield) {
					return [hullMod, isFrontShield ? reason.front : reason.any];
				}
				return null;
			},
		},
		// Shield Conversion - Omni
		adaptiveshields: {
			id: "adaptiveshields",
			name: "Shield Conversion - Omni",
			reason: { omni: "Already Has OMNI Shield", any: "Must have a Shield" },
			_whyNot:
				"hullmod that can be installed on any ship that has shields. (Front Shield)",

			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.adaptiveshields.reason;

				const isNotFrontShield = shieldType !== SHIELD_TYPE.FRONT;
				const isOmniShield = shieldType === SHIELD_TYPE.OMNI;

				if (isNotFrontShield) {
					return [hullMod, isOmniShield ? reason.omni : reason.any];
				}
				return null;
			},
		},
		// Accelerated Shields
		advancedshieldemitter: {
			id: "advancedshieldemitter",
			name: "Accelerated Shields",
			_whyNot: "hullmod that can be installed on any ship that has shields",
			reason: { noShield: "Must have a Shield" },
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.advancedshieldemitter.reason;

				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) {
					return [hullMod, reason.noShield];
				}
				return null;
			},
		},
		// Stabilized Shields
		stabilizedshieldemitter: {
			id: "stabilizedshieldemitter",
			name: "Stabilized Shields",
			_whyNot: "hullmod that can be installed on any ship that has shields",
			reason: { noShield: "Must have a Shield" },
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.stabilizedshieldemitter.reason;

				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) {
					return [hullMod, reason.noShield];
				}
				return null;
			},
		},
		// Hardened Shields
		hardenedshieldemitter: {
			id: "hardenedshieldemitter",
			name: "Hardened Shields",
			_whyNot: "hullmod that can be installed on any ship that has shields",
			reason: { noShield: "Must have a Shield" },
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.hardenedshieldemitter.reason;

				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) {
					return [hullMod, reason.noShield];
				}
				return null;
			},
		},
		// Extended Shields
		extendedshieldemitter: {
			id: "extendedshieldemitter",
			name: "Extended Shields",
			_whyNot: "hullmod that can be installed on any ship that has shields",
			reason: { noShield: "Must have a Shield" },
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.extendedshieldemitter.reason;

				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) {
					return [hullMod, reason.noShield];
				}
				return null;
			},
		},
		//! unfinished
		// Makeshift Shield Generator
		frontshield: {
			id: "frontshield",
			name: "Makeshift Shield Generator",
			_whyNot:
				"hullmod that can be installed on any ship that has no native shields other than Phase ships. Incompatible with Shield Shunt.",
			reason: {
				noShield: "Not on Phase Ships",
				hasShield: "Already has a Shield",
				shieldShunt: "Incompatible with Shield Shunt",
			},
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;

				const reason = HULLMODS.SHIELD.frontshield.reason;

				const isPhase = shieldType === SHIELD_TYPE.PHASE;
				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;
				const isShieldShuntInstalled = "";

				if (isPhase || noShield) {
					return [hullMod, reason.noShield];
				}
				return null;
			},
		},
		// Shield Shunt
		shield_shunt: {
			id: "shield_shunt",
			name: "Shield Shunt",
			_whyNot:
				"hullmod that can be installed on any ship that has shields. Incompatible with Makeshift Shield Generator.",
			reason: {
				noShield: "No Shield",
				shieldGenerator: "Incompatible with Makeshift Shield Generator",
			},
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const installedHullMods = userShipBuild.hullMods.installedHullMods;

				const reason = HULLMODS.SHIELD.shield_shunt.reason;

				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				const isMakeShiftGeneratorInstalled = installedHullMods.find(
					(hullModId) => hullModId === HULLMODS.SHIELD.frontshield.id
				);

				if (noShield || isMakeShiftGeneratorInstalled) {
					return [
						hullMod,
						isMakeShiftGeneratorInstalled
							? reason.shieldGenerator
							: reason.noShield,
					];
				}
				return null;
			},
		},
	},
	// Phase
	PHASE: {
		// Adaptive Phase Coils
		adaptive_coils: {
			id: "adaptive_coils",
			name: "Adaptive Phase Coils",
			_whyNot:
				"hullmod that can be installed on any phase ship. It is incompatible with Phase Anchor.",
			reason: {
				noPhase: "Not a Phase",
				phaseAnchor: "It is incompatible with Phase Anchor",
			},
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const installedHullMods = userShipBuild.hullMods.installedHullMods;
				const reason = HULLMODS.PHASE.adaptive_coils.reason;

				const notPhaseShip = shieldType !== SHIELD_TYPE.PHASE;

				const isPhaseAnchorInstalled = installedHullMods.find(
					(hullModId) => hullModId === HULLMODS.PHASE.phase_anchor.id
				);

				if (notPhaseShip || isPhaseAnchorInstalled) {
					return [
						hullMod,
						isPhaseAnchorInstalled ? reason.phaseAnchor : reason.noPhase,
					];
				}
				return null;
			},
		},
		phase_anchor: {
			id: "phase_anchor",
			name: "Phase Anchor",
			_whyNot:
				"hullmod that can be installed on any phase ship. It is incompatible with Adaptive Phase Coils.",
			reason: {
				noPhase: "Not a Phase",
				phaseCoils: "It is incompatible with Adaptive Phase Coils",
			},
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const installedHullMods = userShipBuild.hullMods.installedHullMods;
				const reason = HULLMODS.PHASE.phase_anchor.reason;

				const notPhaseShip = shieldType !== SHIELD_TYPE.PHASE;

				const isPhaseCoilsInstalled = installedHullMods.find(
					(hullModId) => hullModId === HULLMODS.PHASE.adaptive_coils.id
				);

				if (notPhaseShip || isPhaseCoilsInstalled) {
					return [
						hullMod,
						isPhaseCoilsInstalled ? reason.phaseCoils : reason.noPhase,
					];
				}
				return null;
			},
		},
	},
	ENGINE: {
		// Safety Overrides (not on capital) Not on except for ships with a Civilian-grade Hull, unless Militarized Subsystems is also present.
		safetyoverrides: "safetyoverrides",
	},
};
// const RULES = {
// 	// SHIELD: {
// 	// 	FRONT: {
// 	// 		frontemitter: [HULLMODS.SHIELD.frontemitter, "Already Has Front Shield"],
// 	// 	},
// 	// 	ANY: {
// 	// 		frontshield: [HULLMODS.SHIELD.frontshield, "Has ANY Shield"],
// 	// 	},
// 	// 	OMNI: {
// 	// 		adaptiveshields: [
// 	// 			HULLMODS.SHIELD.adaptiveshields,
// 	// 			"Already Has OMNI Shield",
// 	// 		],
// 	// 	},
// 	// 	PHASE: {
// 	// 		adaptive_coils: [HULLMODS.PHASE.adaptive_coils, "Not a PHASE ship"],
// 	// 		phase_anchor: [HULLMODS.PHASE.phase_anchor, "Not a PHASE ship"],
// 	// 	},
// 	// },
// 	// SPECIAL: {
// 	// 	neural_integrator: [
// 	// 		HULLMODS.SPECIAL.neural_integrator,
// 	// 		"Only Automated Ships",
// 	// 	],
// 	// 	escort_package: [
// 	// 		HULLMODS.SPECIAL.escort_package,
// 	// 		"Not a Destroyer / Cruiser",
// 	// 	],
// 	// },
// 	// FIGHTER: {
// 	// 	NO_BAYS: {
// 	// 		expanded_deck_crew: [
// 	// 			HULLMODS.CARRIER.expanded_deck_crew,
// 	// 			"No Fighter Bays",
// 	// 		],
// 	// 		defensive_targeting_array: [
// 	// 			HULLMODS.CARRIER.defensive_targeting_array,
// 	// 			"No Fighter Bays",
// 	// 		],
// 	// 		recovery_shuttles: [
// 	// 			HULLMODS.CARRIER.recovery_shuttles,
// 	// 			"No Fighter Bays",
// 	// 		],
// 	// 	},
// 	// 	NO_BUILD_IN: {
// 	// 		converted_fighterbay: [
// 	// 			HULLMODS.LOGISTICS.converted_fighterbay,
// 	// 			"No Build In Bays",
// 	// 		],
// 	// 	},
// 	// 	CONVERTED_HANGAR: (buildInFighterSlots, shieldType, hullSize) => {
// 	// 		if (!buildInFighterSlots)
// 	// 			return [HULLMODS.CARRIER.converted_hangar, "No BuildIn Bays"];

// 	// 		if (shieldType === SHIELD_TYPE.PHASE)
// 	// 			return [HULLMODS.CARRIER.converted_hangar, "Not on Phase Ship"];

// 	// 		if (hullSize === HULL_SIZE.FRIGATE)
// 	// 			return [HULLMODS.CARRIER.converted_hangar, "Not on Frigates"];
// 	// 	},
// 	// },
// 	// LOGISTICS: {
// 	// 	NOT_CIVILIAN_SHIP: [
// 	// 		HULLMODS.LOGISTICS.militarized_subsystems,
// 	// 		"Only on Civilian Ships",
// 	// 	],
// 	// },
// 	// WEAPONS: {
// 	// 	ADVANCED_CORE: {
// 	// 		dedicated_targeting_core: [
// 	// 			HULLMODS.WEAPONS.dedicated_targeting_core,
// 	// 			"Incompatible with Advanced Targeting Core",
// 	// 		],
// 	// 		targetingunit: [
// 	// 			HULLMODS.WEAPONS.targetingunit,
// 	// 			"Incompatible with Advanced Targeting Core",
// 	// 		],
// 	// 	},
// 	// 	ballistic_rangefinder: (hullSize) => {
// 	// 		return [
// 	// 			HULLMODS.WEAPONS.ballistic_rangefinder,
// 	// 			hullSize === HULL_SIZE.FRIGATE
// 	// 				? "Not on Frigate"
// 	// 				: "No Ballistic / Hybrid Slots",
// 	// 		];
// 	// 	},
// 	// },
// 	// ENGINE: {
// 	safetyoverrides: [HULLMODS.ENGINE.safetyoverrides, "Not on Capital Ships"],
// },
// 	SHIELD: {
// 		omniShieldCheck: (hullMod) => {
// 			if (hullMod.id === HULLMODS.SHIELD.adaptiveshields) {
// 				if (shieldType === SHIELD_TYPE.OMNI) {
// 					return [hullMod, "Already Has OMNI Shield"];
// 				}
// 			}
// 		},
// 	},
// };

export const hullModLogic = {
	filterController(hullModArray, userShipBuild) {
		return [
			...hullModLogic.filterBuildInHullMods(hullModArray, userShipBuild),
			...hullModLogic.filterShieldHullMods(hullModArray, userShipBuild),
		];
	},
	filterBuildInHullMods(hullModArray, userShipBuild) {
		return HULLMODS.BUILD_IN.logic(hullModArray, userShipBuild);
	},

	filterShieldHullMods(hullModArray, userShipBuild) {
		const shieldHullMods = {
			[HULLMODS.SHIELD.adaptiveshields.id]:
				HULLMODS.SHIELD.adaptiveshields.logic,

			[HULLMODS.SHIELD.advancedshieldemitter.id]:
				HULLMODS.SHIELD.advancedshieldemitter.logic,

			[HULLMODS.SHIELD.frontemitter.id]: HULLMODS.SHIELD.frontemitter.logic,

			[HULLMODS.SHIELD.frontshield.id]: HULLMODS.SHIELD.frontshield.logic,

			[HULLMODS.SHIELD.shield_shunt.id]: HULLMODS.SHIELD.shield_shunt.logic,

			[HULLMODS.SHIELD.stabilizedshieldemitter.id]:
				HULLMODS.SHIELD.stabilizedshieldemitter.logic,

			[HULLMODS.SHIELD.hardenedshieldemitter.id]:
				HULLMODS.SHIELD.hardenedshieldemitter.logic,

			[HULLMODS.SHIELD.extendedshieldemitter.id]:
				HULLMODS.SHIELD.extendedshieldemitter.logic,
		};

		const phaseHullMods = {
			[HULLMODS.PHASE.adaptive_coils.id]: HULLMODS.PHASE.adaptive_coils.logic,
			[HULLMODS.PHASE.phase_anchor.id]: HULLMODS.PHASE.phase_anchor.logic,
		};

		const weaponHullMods = {
			[HULLMODS.WEAPONS.ballistic_rangefinder.id]:
				HULLMODS.WEAPONS.ballistic_rangefinder.logic,
		};

		const allModifiers = {
			...shieldHullMods,
			...phaseHullMods,
			...weaponHullMods,
		};

		return hullModArray
			.map((hullMod) => {
				// if finds modifier calls the function, if not return null
				const modifierFn = allModifiers[hullMod.id];
				return modifierFn ? modifierFn(hullMod, userShipBuild) : null;
			})
			.filter(Boolean); // remove undefined
	},

	filterSpecialType: (hullModArray, hullSize) => {
		const array = [];
		const shipAutomated = true;

		// Rules
		const isNotCruiserOrDestroyer =
			hullSize !== HULL_SIZE.CRUISER && hullSize !== HULL_SIZE.DESTROYER;

		// HullMods
		// Neural Integrator on AUTO ships
		if (shipAutomated) array.push(RULES.SPECIAL.neural_integrator);

		// Escord Package
		if (isNotCruiserOrDestroyer) array.push(RULES.SPECIAL.escort_package);

		return array.map(([hullModId, reason]) =>
			hullModLogic.hullModToRejectAndGiveReason(hullModArray, hullModId, reason)
		);
	},

	filterByFighterSlots: (hullModArray, userShipBuild) => {
		const { fighterBays, weaponSlots, hullSize, shieldType } = userShipBuild;

		const array = [];

		const buildInFighterSlots = weaponSlots.some(
			(hullMod) => hullMod.type === WEAPON_SLOT_TYPE.LAUNCH_BAY
		);

		// No Fighter Slots
		if (fighterBays === 0 || !Number.isFinite(fighterBays)) {
			array.push(
				RULES.FIGHTER.NO_BAYS.defensive_targeting_array,
				RULES.FIGHTER.NO_BAYS.expanded_deck_crew,
				RULES.FIGHTER.NO_BAYS.recovery_shuttles
			);
		}

		// No Build In Fighter Slots
		if (!buildInFighterSlots) {
			array.push(RULES.FIGHTER.NO_BUILD_IN.converted_fighterbay);
		}

		// Converted Hangar
		if (
			!buildInFighterSlots ||
			shieldType === SHIELD_TYPE.PHASE ||
			hullSize === HULL_SIZE.FRIGATE
		) {
			array.push(
				RULES.FIGHTER.CONVERTED_HANGAR(
					buildInFighterSlots,
					shieldType,
					hullSize
				)
			);
		}

		return array.map(([hullModId, reason]) =>
			hullModLogic.hullModToRejectAndGiveReason(hullModArray, hullModId, reason)
		);
	},

	filterByCivilianShipType: (hullModArray, shipIsCivilian) => {
		const array = [];

		const shipIsNotCivilian = shipIsCivilian === SHIP_TYPE.MILITARY;
		if (shipIsNotCivilian) array.push(RULES.LOGISTICS.NOT_CIVILIAN_SHIP);

		// return empty array
		if (array.length === 0) return array;

		return array.map(([hullModId, reason]) =>
			hullModLogic.hullModToRejectAndGiveReason(hullModArray, hullModId, reason)
		);
	},

	filterWeaponHullMods: (hullModArray, hullSize, weaponSlots, hullMods) => {
		const results = [];
		const isAdvancedCoreBuildIn = hullMods.builtInMods.some(
			(hullMod) => hullMod === HULLMODS.WEAPONS.advancedcore
		);

		// BAL Range Finder
		const ballisticRangeFinderNotAllowed =
			!hasBallisticSlots || hullSize === HULL_SIZE.FRIGATE;
		const hasBallisticSlots = weaponSlots.some(
			(hullMod) => hullMod.type === SLOT_TYPE.BALLISTIC
		);
		if (ballisticRangeFinderNotAllowed) {
			results.push(RULES.WEAPONS.ballistic_rangefinder(hullSize));
		}
		// Advanced Core
		if (isAdvancedCoreBuildIn) {
			results.push(
				RULES.WEAPONS.ADVANCED_CORE.dedicated_targeting_core,
				RULES.WEAPONS.ADVANCED_CORE.targetingunit
			);
		}

		// Guard and Return
		if (results.length === 0) return results;

		return results.map(([hullModId, reason]) =>
			hullModLogic.hullModToRejectAndGiveReason(hullModArray, hullModId, reason)
		);
	},
	filterEngineHullMods(hullModArray, hullSize) {
		const results = [];
		if (hullSize === HULL_SIZE.CAPITAL_SHIP) {
			results.push(RULES.ENGINE.safetyoverrides);
		}

		// Guard and Return
		if (results.length === 0) return results;

		return results.map(([hullModId, reason]) =>
			hullModLogic.hullModToRejectAndGiveReason(hullModArray, hullModId, reason)
		);
	},
	// Generic
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
