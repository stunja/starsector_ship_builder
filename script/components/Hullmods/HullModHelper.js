import HULLMODS_DATA from "../../helper/HullModData";
import { GENERIC_STRING } from "../../helper/MagicStrings";

export const updateInstalledHullMod = (
	hullmodId,
	userShipBuild,
	allHullMods
) => {
	const hullMods = userShipBuild.hullMods;
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
		fluxshunt: {
			id: "fluxshunt",
			name: "Flux Shunt",
			_whyNot: "Flux Shunt is incompatible with Safety Overrides.",
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
					({ type }) => type === WEAPON_SLOT_TYPE.BALLISTIC
				);
				const hasHybridSlots = weaponSlots.some(
					({ type }) => type === WEAPON_SLOT_TYPE.HYBRID
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

				const isAdvancedCoreBuildIn = builtInMods.includes(
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

				const isAdvancedCoreBuildIn = builtInMods.includes(
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
		// Advanced Optics
		advancedoptics: {
			id: "advancedoptics",
			name: "Advanced Optics",
			_whyNot:
				"hullmod that can be installed on any ship. Incompatible with High Scatter Amplifier.",
			reason: {
				highScatterAmplifierReason: "Incompatible with High Scatter Amplifier",
			},
			logic: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const reason = HULLMODS.WEAPONS.advancedoptics.reason;

				const isHighScatterAmplifierInstalled = installedHullMods.includes(
					HULLMODS.WEAPONS.high_scatter_amp.id
				);

				if (isHighScatterAmplifierInstalled) {
					const reasonMap = {
						[isHighScatterAmplifierInstalled]:
							reason.highScatterAmplifierReason,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},
		// High Scatter Amplifier
		high_scatter_amp: {
			id: "high_scatter_amp",
			name: "High Scatter Amplifier",
			_whyNot:
				"hullmod that can be installed on any ship. Incompatible with Advanced Optics.",
			reason: {
				advancedOpticsReason: "Incompatible with Advanced Optics",
			},
			logic: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const reason = HULLMODS.WEAPONS.high_scatter_amp.reason;

				const isAdvancedOpticsInstalled = installedHullMods.includes(
					HULLMODS.WEAPONS.advancedoptics.id
				);

				const isAdvancedOpticsBuildIn = builtInMods.includes(
					HULLMODS.WEAPONS.advancedoptics.id
				);

				if (isAdvancedOpticsInstalled || isAdvancedOpticsBuildIn) {
					const reasonMap = {
						[isAdvancedOpticsInstalled]: reason.advancedOpticsReason,
						[isAdvancedOpticsBuildIn]: reason.advancedOpticsReason,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},
	},
	FIGHTER: {
		// Converted Hangar
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
				const { hullSize, shieldType, fighterBays } = userShipBuild;
				const reason = HULLMODS.FIGHTER.converted_hangar.reason;

				const isFrigate = hullSize === HULL_SIZE.FRIGATE;
				const hasFighterSlots = fighterBays >= 1;

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
		// Defensive Targeting Array
		defensive_targeting_array: {
			id: "defensive_targeting_array",
			name: "Defensive Targeting Array",
			_whyNot: "hullmod that can be installed on any ship with a Fighter Wing.",
			reason: {
				hasNoFighterSlotsReason: "No Fighter Slots",
			},
			logic: function (hullMod, userShipBuild) {
				const { fighterBays } = userShipBuild;

				const reason = HULLMODS.FIGHTER.defensive_targeting_array.reason;

				const hasNoFighterSlots = fighterBays <= 0;

				if (hasNoFighterSlots) {
					const reasonMap = {
						[hasNoFighterSlots]: reason.hasNoFighterSlotsReason,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},
		// Expanded Deck Crew
		expanded_deck_crew: {
			id: "expanded_deck_crew",
			name: "Expanded Deck Crew",
			_whyNot: "hullmod that can be installed on any ship with a Fighter Wing.",
			reason: {
				hasNoFighterSlotsReason: "No Fighter Slots",
			},
			logic: function (hullMod, userShipBuild) {
				const { fighterBays } = userShipBuild;

				const reason = HULLMODS.FIGHTER.expanded_deck_crew.reason;

				const hasNoFighterSlots = fighterBays <= 0;

				if (hasNoFighterSlots) {
					const reasonMap = {
						[hasNoFighterSlots]: reason.hasNoFighterSlotsReason,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},
		// Recovery Shuttles
		recovery_shuttles: {
			id: "recovery_shuttles",
			name: "Recovery Shuttles",
			_whyNot: "hullmod that can be installed on any ship with a Fighter Wing.",
			reason: {
				hasNoFighterSlotsReason: "No Fighter Slots",
			},
			logic: function (hullMod, userShipBuild) {
				const { fighterBays } = userShipBuild;

				const reason = HULLMODS.FIGHTER.recovery_shuttles.reason;

				const hasNoFighterSlots = fighterBays <= 0;

				if (hasNoFighterSlots) {
					const reasonMap = {
						[hasNoFighterSlots]: reason.hasNoFighterSlotsReason,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},
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

				console.log(installedHullMods);
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
			reason: {
				frontShieldReason: "Already Has Front Shield",
				noShieldReason: "Must have a Shield",
			},
			_why: "hullmod that can be installed on any ship that has shields. Incompatible with Front Shield",

			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.frontemitter.reason;

				const isFrontShield = shieldType === SHIELD_TYPE.FRONT;
				const hasNoShield =
					shieldType !== SHIELD_TYPE.OMNI && shieldType !== SHIELD_TYPE.FRONT;

				if (isFrontShield || hasNoShield) {
					const reasonMap = {
						[isFrontShield]: reason.frontShieldReason,
						[hasNoShield]: reason.noShieldReason,
					};

					return [hullMod, reasonMap.true];
				}
				return null;
			},
		},
		// Shield Conversion - Omni
		adaptiveshields: {
			id: "adaptiveshields",
			name: "Shield Conversion - Omni",
			reason: {
				omniShieldReason: "Already Has OMNI Shield",
				noShieldReason: "Must have a Shield",
			},
			_whyNot:
				"hullmod that can be installed on any ship that has shields. Incompatible with OMNI Shield",

			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.adaptiveshields.reason;

				const isOmniShield = shieldType === SHIELD_TYPE.OMNI;
				const hasNoShield =
					shieldType !== SHIELD_TYPE.OMNI && shieldType !== SHIELD_TYPE.FRONT;

				if (isOmniShield || hasNoShield) {
					const reasonMap = {
						[isOmniShield]: reason.omniShieldReason,
						[hasNoShield]: reason.noShieldReason,
					};

					return [hullMod, reasonMap.true];
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
			reason: { noShieldReason: "Must have a Shield" },
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.extendedshieldemitter.reason;

				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) {
					return [hullMod, reason.noShieldReason];
				}
				return null;
			},
		},

		// Makeshift Shield Generator
		frontshield: {
			id: "frontshield",
			name: "Makeshift Shield Generator",
			_whyNot:
				"hullmod that can be installed on any ship that has no native shields other than Phase ships. Incompatible with Shield Shunt.",
			reason: {
				isPhaseShipReason: "Not on Phase Ship",
				hasShieldReason: "Already has a Shield",
				shieldShuntReason: "Incompatible with Shield Shunt",
			},
			logic: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const { installedHullMods } = userShipBuild.hullMods;

				const reason = HULLMODS.SHIELD.frontshield.reason;

				const isPhase = shieldType === SHIELD_TYPE.PHASE;

				const hasShield =
					shieldType === SHIELD_TYPE.FRONT && shieldType === SHIELD_TYPE.OMNI;

				const isShieldShuntInstalled = installedHullMods.includes(
					HULLMODS.SHIELD.shield_shunt.id
				);

				if (isPhase || hasShield || isShieldShuntInstalled) {
					const reasonMap = {
						[isPhase]: reason.isPhaseShipReason,
						[hasShield]: reason.hasShieldReason,
						[isShieldShuntInstalled]: reason.shieldShuntReason,
					};

					return [hullMod, reasonMap.true];
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

				const isMakeShiftGeneratorInstalled = installedHullMods.includes(
					HULLMODS.SHIELD.frontshield.id
				);

				if (noShield || isMakeShiftGeneratorInstalled) {
					const reasonMap = {
						[isMakeShiftGeneratorInstalled]: reason.shieldGenerator,
						[noShield]: reason.noShield,
					};

					return [hullMod, reasonMap.true];
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
		// Safety Overrides
		safetyoverrides: {
			id: "safetyoverrides",
			name: "Safety Overrides",
			_whyNot:
				"hullmod that can be installed on any Frigate-class, Destroyer-class and Cruiser-class ship, except for ships with a Civilian-grade Hull, unless Militarized Subsystems is also present.",
			reason: {
				notOnCapitalShipReason: "Not on Capital Ship",
				notOnCivilianShipReason:
					"Civilian Ships only with Militarized Subsystems",
				fluxShuntReason: "Incompatible with Flux Shunt.",
			},
			logic: function (hullMod, userShipBuild) {
				const { hullSize, hullMods } = userShipBuild;
				const { builtInMods, installedHullMods } = hullMods;

				const reason = HULLMODS.ENGINE.safetyoverrides.reason;

				// Not on Capital Ship
				const isShipCapital = hullSize === HULL_SIZE.CAPITAL_SHIP;

				// Incompatible with Flux Shunt
				const hasFluxShunt = builtInMods.includes(
					HULLMODS.BUILD_IN.fluxshunt.id
				);

				// Civilian Ships only with Militarized Subsystems
				const isShipCivilian = builtInMods.includes(
					HULLMODS.BUILD_IN.civgrade.id
				);
				const isMilitarizedSubsystemsInstalled = installedHullMods.includes(
					HULLMODS.LOGISTICS.militarized_subsystems.id
				);
				// if not Militarized Subsystems installed would set true, if true than make it red
				const isCivilianCheck =
					isShipCivilian && !isMilitarizedSubsystemsInstalled;

				if (isShipCapital || isCivilianCheck || hasFluxShunt) {
					const reasonMap = {
						[isShipCapital]: reason.notOnCapitalShipReason,
						[isCivilianCheck]: reason.notOnCivilianShipReason,
						[hasFluxShunt]: reason.fluxShuntReason,
					};

					return [hullMod, reasonMap.true];
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

			[HULLMODS.WEAPONS.advancedoptics.id]:
				HULLMODS.WEAPONS.advancedoptics.logic,

			[HULLMODS.WEAPONS.high_scatter_amp.id]:
				HULLMODS.WEAPONS.high_scatter_amp.logic,
		};
		const engineHullMods = {
			[HULLMODS.ENGINE.safetyoverrides.id]:
				HULLMODS.ENGINE.safetyoverrides.logic,
		};
		const logisticsHullMods = {
			[HULLMODS.LOGISTICS.militarized_subsystems.id]:
				HULLMODS.LOGISTICS.militarized_subsystems.logic,

			[HULLMODS.LOGISTICS.converted_fighterbay.id]:
				HULLMODS.LOGISTICS.converted_fighterbay.logic,
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

			[HULLMODS.FIGHTER.defensive_targeting_array.id]:
				HULLMODS.FIGHTER.defensive_targeting_array.logic,

			[HULLMODS.FIGHTER.expanded_deck_crew.id]:
				HULLMODS.FIGHTER.expanded_deck_crew.logic,

			[HULLMODS.FIGHTER.recovery_shuttles.id]:
				HULLMODS.FIGHTER.recovery_shuttles.logic,
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
