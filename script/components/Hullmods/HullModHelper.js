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
	HYBRID: "HYBRID",
	BALLISTIC: "BALLISTIC",
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
const logisticsHullModLimit = 0;
const HULLMODS = {
	BUILD_IN: {
		// Advanced Targeting Core [BuildIn]
		advancedcore: {
			id: "advancedcore",
			name: "Advanced Targeting Core",
			_whyNot:
				"Precludes the installation of a Dedicated Targeting Core or an Integrated Targeting Unit.",
		},
		civgrade: {
			id: "civgrade",
			name: "Civilian-grade Hull",
			_whyNot:
				"This hullmod denotes that the ship isn't designed for combat, such as an Atlas-class superfreighter. If Militarized Subsystems are installed, the sensor penalties will be removed.",
		},
		distributed_fire_control: {
			id: "distributed_fire_control",
			name: "Distributed Fire Control",
			_whyNot:
				"Distributed Fire Control is incompatible with Dedicated Targeting Core and Integrated Targeting Unit, but not the Ballistic Rangefinder.",
		},
		logic: function (hullModArray, userShipBuild) {
			const reason = "Already Build In";
			const builtInMods = userShipBuild.hullMods.builtInMods;

			if (!builtInMods) return [];

			const hullModObject = hullModArray.filter((hullMod) =>
				builtInMods.find((builtHullMod) => builtHullMod === hullMod.id)
			);
			return hullModObject.map((hullMod) => [hullMod, reason]);
		},
	},
	WEAPONS: {
		// Ballistic Rangefinder
		ballistic_rangefinder: {
			id: "ballistic_rangefinder",
			name: "Ballistic Rangefinder",
			_whyNot:
				"hullmod that can be installed on any Destroyer-class, Cruiser-class and Capital-class ship. (Have ballistic slots or hybrid)",
			reason: {
				frigate: "Not on Frigates",
				noCorrectWeaponSlots: "No Ballistic or Hybrid Slots",
			},
			logic: function (hullMod, userShipBuild) {
				const { hullSize, weaponSlots } = userShipBuild;
				const reason = HULLMODS.WEAPONS.ballistic_rangefinder.reason;

				// BAL Range Finder
				const isFrigateHull = hullSize === HULL_SIZE.FRIGATE;

				const hasBallisticSlots = weaponSlots.some(
					(hullMod) => hullMod.type === WEAPON_SLOT_TYPE.BALLISTIC
				);
				const hasHybridSlots = weaponSlots.some(
					(hullMod) => hullMod.type === WEAPON_SLOT_TYPE.HYBRID
				);
				const isNotBallisticOrIsNotHybridSlots =
					!hasBallisticSlots && !hasHybridSlots;

				if (isFrigateHull || isNotBallisticOrIsNotHybridSlots) {
					const reasonMap = {
						[isNotBallisticOrIsNotHybridSlots]: reason.noCorrectWeaponSlots,
						[isFrigateHull]: reason.frigate,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},

		// Integrated Targeting Unit
		targetingunit: {
			id: "targetingunit",
			name: "Integrated Targeting Unit",
			_whyNot:
				"Incompatible with [Dedicated Targeting Core] or [Distributed Fire Control] or [Advanced Targeting Core]",
			reason: {
				dedicated_targeting_core: "Incompatible with Dedicated Targeting Core",
				advancedcore: "Incompatible with Advanced Targeting Core",
				distributed_fire_control: "Incompatible with Distributed Fire Control",
			},
			logic: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const reason = HULLMODS.WEAPONS.targetingunit.reason;

				const isDedicatedCoreInstalled = installedHullMods.includes(
					HULLMODS.WEAPONS.dedicated_targeting_core.id
				);

				const isAdvancedCoreBuildIn = builtInMods?.includes(
					HULLMODS.BUILD_IN.advancedcore.id
				);

				const isDistributedFireControlBuildIn = builtInMods.includes(
					HULLMODS.BUILD_IN.distributed_fire_control.id
				);

				if (
					isDedicatedCoreInstalled ||
					isAdvancedCoreBuildIn ||
					isDistributedFireControlBuildIn
				) {
					const reasonMap = {
						[isAdvancedCoreBuildIn]: reason.advancedcore,
						[isDedicatedCoreInstalled]: reason.dedicated_targeting_core,
						[isDistributedFireControlBuildIn]: reason.distributed_fire_control,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},
		// Dedicated Targeting Core
		dedicated_targeting_core: {
			id: "dedicated_targeting_core",
			name: "Dedicated Targeting Core",
			_whyNot:
				"Dedicated Targeting Core is a hullmod that can only be installed on Cruiser-class & Capital-class ship. incompatible with Dedicated Targeting Core. Incompatible with Distributed Fire Control",
			reason: {
				targetingunit: "Incompatible with Integrated Targeting Unit",
				advancedcore: "Incompatible with Advanced Targeting Core",
				distributed_fire_control: "Incompatible with Distributed Fire Control",
			},
			logic: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const reason = HULLMODS.WEAPONS.dedicated_targeting_core.reason;

				const isIntegratedTargetingUnitInstalled = installedHullMods.includes(
					HULLMODS.WEAPONS.targetingunit.id
				);

				const isAdvancedCoreBuildIn = builtInMods?.includes(
					HULLMODS.BUILD_IN.advancedcore.id
				);

				const isDistributedFireControlBuildIn = builtInMods.includes(
					HULLMODS.BUILD_IN.distributed_fire_control.id
				);

				if (
					isIntegratedTargetingUnitInstalled ||
					isAdvancedCoreBuildIn ||
					isDistributedFireControlBuildIn
				) {
					const reasonMap = {
						[isAdvancedCoreBuildIn]: reason.advancedcore,
						[isIntegratedTargetingUnitInstalled]: reason.targetingunit,
						[isDistributedFireControlBuildIn]: reason.distributed_fire_control,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},
	},
	FIGHTER: {
		// Converted Hangar
		//! add new installable fighterSlot
		converted_hangar: {
			id: "converted_hangar",
			name: "Converted Hangar",
			_whyNot:
				"hullmod that can be installed on any Destroyer-class, Cruiser-class and Capital-class ship, except Phase ships or ships that already have proper fighter bays.",
			reason: {
				isFrigateReason: "Not on Frigate",
				isPhaseReason: "Not on Phase",
				hasFighterSlotsReason: "Already has Fighter Slots",
			},
			logic: function (hullMod, userShipBuild) {
				const { hullSize, shieldType, weaponSlots } = userShipBuild;
				console.log(userShipBuild);
				const reason = HULLMODS.FIGHTER.converted_hangar.reason;

				console.log(hullSize);
				console.log(shieldType);
				console.log(weaponSlots);

				const isFrigate = hullSize === HULL_SIZE.FRIGATE;
				const hasFighterSlots = weaponSlots.some(
					(slot) => slot.type === WEAPON_SLOT_TYPE.LAUNCH_BAY
				);
				const isPhase = shieldType === SHIELD_TYPE.PHASE;

				if (isFrigate || hasFighterSlots || isPhase) {
					const reasonMap = {
						[isFrigate]: reason.isFrigateReason,
						[hasFighterSlots]: reason.hasFighterSlotsReason,
						[isPhase]: reason.isPhaseReason,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},
		defensive_targeting_array: "defensive_targeting_array", // Defensive Targeting Array (No Fighter Bays)
		expanded_deck_crew: "expanded_deck_crew", // Expanded Deck Crew (No Standart fighter bays)
		recovery_shuttles: "recovery_shuttles", // Recovery Shuttles (No Fighter Bays)
	},
	SPECIAL: {
		//! Implement Later
		// Neural Integrator
		neural_integrator: {
			id: "neural_integrator",
			name: "Neural Integrator",
			_whyNot:
				"hullmod that can be installed on any ship with the Automated Ship hullmod.",
			reason: {
				onlyAutomatedShip: "Only on Automated Ships",
			},
			logic: function (hullMod, userShipBuild) {
				const { builtInMods } = userShipBuild.hullMods;

				const reason = HULLMODS.SPECIAL.neural_integrator.reason;
				const automatedCheck = false;
				// const isAdvancedCoreBuildIn = builtInMods.includes(
				// 	HULLMODS.BUILD_IN.advancedcore.id
				// );

				if (!automatedCheck) {
					return [hullMod, reason.onlyAutomatedShip];
				}
				return null;
			},
		},
		// Escort Package
		escort_package: {
			id: "escort_package",
			name: "Escort Package",
			_whyNot:
				"hullmod that can only be installed on Destroyer-class & Cruiser-class ships.",
			reason: {
				hullSizeRule: "Only on Destroyer / Cruiser",
			},
			logic: function (hullMod, userShipBuild) {
				const { hullSize } = userShipBuild;

				const reason = HULLMODS.SPECIAL.escort_package.reason;

				const isNotCruiser = hullSize !== HULL_SIZE.CRUISER;
				const isNotDestroyer = hullSize !== HULL_SIZE.DESTROYER;

				if (isNotCruiser && isNotDestroyer) {
					return [hullMod, reason.hullSizeRule];
				}
				return null;
			},
		},
	},
	LOGISTICS: {
		//! Implement Later
		// Converted Fighter Bay
		converted_fighterbay: {
			id: "converted_fighterbay",
			name: "Converted Fighter Bay",
			_whyNot:
				"It can only be installed on ships which have permanently built-in fighter bays such as Shepherd, Tempest or the stock Venture.",
			reason: {
				targetingunit: "Incompatible with Integrated Targeting Unit",
				tooMuchLogic: "Max",
			},
			logic: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const reason = HULLMODS.LOGISTICS.converted_fighterbay.reason;

				// const isIntegratedTargetingUnitInstalled = installedHullMods.includes(
				// 	HULLMODS.WEAPONS.targetingunit.id
				// );

				// const isAdvancedCoreBuildIn = builtInMods?.includes(
				// 	HULLMODS.BUILD_IN.advancedcore.id
				// );

				// const isDistributedFireControlBuildIn = builtInMods.includes(
				// 	HULLMODS.BUILD_IN.distributed_fire_control.id
				// );

				// if (
				// 	isIntegratedTargetingUnitInstalled ||
				// 	isAdvancedCoreBuildIn ||
				// 	isDistributedFireControlBuildIn
				// ) {
				// 	const reasonMap = {
				// 		[isAdvancedCoreBuildIn]: reason.advancedcore,
				// 		[isIntegratedTargetingUnitInstalled]: reason.targetingunit,
				// 		[isDistributedFireControlBuildIn]: reason.distributed_fire_control,
				// 	};

				// 	return [hullMod, reasonMap.true];
				// }
				return null;
			},
		},
		// Militarized Subsystems
		militarized_subsystems: {
			id: "militarized_subsystems",
			name: "Militarized Subsystems",
			reason: { onlyCivilian: "Only on Civilian Ships" },
			_why: "hullmod that can be installed on any ship with Civilian-grade Hull. Logistics Limit = 2",

			logic: function (hullMod, userShipBuild) {
				const reason = HULLMODS.LOGISTICS.militarized_subsystems.reason;
				const { hullMods } = userShipBuild;

				const isCivilianShip = hullMods.builtInMods.includes(
					HULLMODS.BUILD_IN.civgrade.id
				);
				if (!isCivilianShip) {
					return [hullMod, reason.onlyCivilian];
				}
				return null;
			},
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
				const { shieldType, hullMods } = userShipBuild;
				const installedHullMods = hullMods.installedHullMods;
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
				const { shieldType, hullMods } = userShipBuild;
				const installedHullMods = hullMods.installedHullMods;
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
		safetyoverrides: {
			id: "safetyoverrides",
			name: "Safety Overrides",
			_whyNot:
				"hullmod that can be installed on any Frigate-class, Destroyer-class and Cruiser-class ship, except for ships with a Civilian-grade Hull, unless Militarized Subsystems is also present.",
			reason: {
				notOnCapitalShips: "Not on Capital Ship",
				notOnCivilianShips: "Civilian Ships only with Militarized Subsystems",
			},
			logic: function (hullMod, userShipBuild) {
				const { hullSize, hullMods } = userShipBuild;
				const builtInMods = hullMods.builtInMods;
				const reason = HULLMODS.ENGINE.safetyoverrides.reason;

				const isShipCapital = hullSize === HULL_SIZE.CAPITAL_SHIP;

				const isShipCivilian = builtInMods.find(
					(hullModId) => hullModId === HULLMODS.BUILD_IN.civgrade.id
				);

				if (isShipCivilian || isShipCapital) {
					return [
						hullMod,
						isShipCapital
							? reason.notOnCapitalShips
							: reason.notOnCivilianShips,
					];
				}
				return null;
			},
		},
	},
};

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

			[HULLMODS.WEAPONS.dedicated_targeting_core.id]:
				HULLMODS.WEAPONS.dedicated_targeting_core.logic,

			[HULLMODS.WEAPONS.targetingunit.id]: HULLMODS.WEAPONS.targetingunit.logic,
		};
		const engineHullMods = {
			[HULLMODS.ENGINE.safetyoverrides.id]:
				HULLMODS.ENGINE.safetyoverrides.logic,
		};
		const logisticsHullMods = {
			[HULLMODS.LOGISTICS.militarized_subsystems.id]:
				HULLMODS.LOGISTICS.militarized_subsystems.logic,
		};
		const specialHullMods = {
			[HULLMODS.SPECIAL.neural_integrator.id]:
				HULLMODS.SPECIAL.neural_integrator.logic,
			[HULLMODS.SPECIAL.escort_package.id]:
				HULLMODS.SPECIAL.escort_package.logic,
		};
		const fighterHullMods = {
			[HULLMODS.FIGHTER.converted_hangar.id]:
				HULLMODS.FIGHTER.converted_hangar.logic,
		};
		const allModifiers = {
			...shieldHullMods,
			...phaseHullMods,
			...weaponHullMods,
			...engineHullMods,
			...logisticsHullMods,
			...specialHullMods,
			...fighterHullMods,
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
			(hullMod) => hullMod === HULLMODS.BUILD_IN.advancedcore
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
