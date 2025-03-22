import {
	SHIELD_TYPE,
	WEAPON_SLOT_TYPE,
	HULL_SIZE,
	SHIP_TYPE,
} from "../../helper/Properties";

import HullModHelper from "./HullModHelper";
import { VALUE_CHANGE } from "../../helper/MagicStrings";

const UI_TAGS = {
	LOGISTICS: "Logistics",
};

//
export const HULLMODS = {
	// BUILD-IN
	// NO FILTER REASON => ONLY LOGIC
	BUILD_IN: {
		// Advanced Targeting Core
		advancedcore: {
			id: "advancedcore",
			name: "Advanced Targeting Core",
			_whyNot:
				"Precludes the installation of a Dedicated Targeting Core or an Integrated Targeting Unit.",
		},
		// Civilian-grade Hull
		civgrade: {
			id: "civgrade",
			name: "Civilian-grade Hull",
			_whyNot:
				"This hullmod denotes that the ship isn't designed for combat, such as an Atlas-class superfreighter. If Militarized Subsystems are installed, the sensor penalties will be removed.",
		},
		// Distributed Fire Control
		distributed_fire_control: {
			id: "distributed_fire_control",
			name: "Distributed Fire Control",
			_whyNot:
				"Distributed Fire Control is incompatible with Dedicated Targeting Core and Integrated Targeting Unit, but not the Ballistic Rangefinder.",
		},
		// Flux Shunt
		fluxshunt: {
			id: "fluxshunt",
			name: "Flux Shunt",
			_whyNot: "Flux Shunt is incompatible with Safety Overrides.",
		},
	},
	WEAPONS: {
		// Armored Weapon Mounts
		armoredweapons: {
			id: "armoredweapons",
			name: "Armored Weapon Mounts",
			_whyNot: "hullmod that can be installed on any ship.",

			// Increases the durability of all weapons by 100% and reduces recoil by 25%,
			//  but decreases their turn rate by 25%.
			// Also increases the ship's armor by 10%.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, armor, hullSize } = userShipBuild;

				const [
					_weaponDurability,
					_reduceWeaponRecoil,
					_decreaseWeaponTurnRate,
					addArmorPercent,
				] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					// New Armor Value
					armor: HullModHelper.convertStringPercentIntoNumber(
						addArmorPercent,
						VALUE_CHANGE.INCREASE,
						armor
					),
					// Add OP cost
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
			// S-mod bonus: Increases the rate of fire of all non-missile weapons by 10%.
			sModsLogic: function () {},
		},
		// Ballistic Rangefinder
		ballistic_rangefinder: {
			id: "ballistic_rangefinder",
			name: "Ballistic Rangefinder",
			_whyNot:
				"hullmod that can be installed on any Destroyer-class, Cruiser-class and Capital-class ship. (Have ballistic slots or hybrid)",
			reason: {
				isFrigateReason: "Not on Frigates",
				noCorrectWeaponSlotsReason: "No Ballistic or Hybrid Slots",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { hullSize, weaponSlots } = userShipBuild;

				const { reason } = HULLMODS.WEAPONS.ballistic_rangefinder;

				// Not a Frigate
				const isFrigateHull = hullSize === HULL_SIZE.FRIGATE;

				if (isFrigateHull) return [hullMod, reason.isFrigateReason];

				// Only with Hybrid or Ballistic Slots
				const noBallisticOrHybridSlots = weaponSlots.some(
					({ type }) =>
						type === WEAPON_SLOT_TYPE.BALLISTIC ||
						type === WEAPON_SLOT_TYPE.HYBRID
				);

				if (!noBallisticOrHybridSlots)
					return [hullMod, reason.noCorrectWeaponSlotsReason];

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
				hasDedicatedTargetingCoreReason:
					"Incompatible with Dedicated Targeting Core",
				hasAdvancedCoreReason: "Incompatible with Advanced Targeting Core",
				hasDistributedFireControlReason:
					"Incompatible with Distributed Fire Control",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const { reason } = HULLMODS.WEAPONS.targetingunit;

				// Incompatible with Dedicated Targeting Core
				const hasDedicatedCoreInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.WEAPONS.dedicated_targeting_core.id
				);

				if (hasDedicatedCoreInstalled)
					return [hullMod, reason.hasDedicatedTargetingCoreReason];

				// Incompatible with Advanced Targeting Core
				const hasAdvancedCoreBuildIn = builtInMods.some(
					({ id }) => id === HULLMODS.BUILD_IN.advancedcore.id
				);

				if (hasAdvancedCoreBuildIn)
					return [hullMod, reason.hasAdvancedCoreReason];

				// Incompatible with Distributed Fire Control
				const isDistributedFireControlBuildIn = builtInMods.some(
					({ id }) => id === HULLMODS.BUILD_IN.distributed_fire_control.id
				);

				if (isDistributedFireControlBuildIn)
					return [hullMod, reason.hasDistributedFireControlReason];

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
				hasIntegratedTargetingUnitReason:
					"Incompatible with Integrated Targeting Unit",
				hasAdvancedTargetingCoreReason:
					"Incompatible with Advanced Targeting Core",
				hasDistributedFireControlReason:
					"Incompatible with Distributed Fire Control",
				isFrigateOrDestroyerReason: "Not on Frigate / Destroyer",
			},

			// Not frigate or destoyer
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;
				const { hullSize } = userShipBuild;

				const { reason } = HULLMODS.WEAPONS.dedicated_targeting_core;

				// Not on Frigate / Destroyer
				const isFrigateOrDestroyer =
					hullSize === HULL_SIZE.FRIGATE || hullSize === HULL_SIZE.DESTROYER;

				if (isFrigateOrDestroyer)
					return [hullMod, reason.isFrigateOrDestroyerReason];

				// Incompatible with Integrated Targeting Unit
				const hasIntegratedTargetingUnitInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.WEAPONS.targetingunit.id
				);

				if (hasIntegratedTargetingUnitInstalled)
					return [hullMod, reason.hasIntegratedTargetingUnitReason];

				// Incompatible with Advanced Targeting Core
				const hasAdvancedCoreBuildIn = builtInMods.some(
					({ id }) => id === HULLMODS.BUILD_IN.advancedcore.id
				);

				if (hasAdvancedCoreBuildIn)
					return [hullMod, reason.hasAdvancedTargetingCoreReason];

				// Incompatible with Distributed Fire Control
				const hasDistributedFireControlBuildIn = builtInMods.some(
					({ id }) => id === HULLMODS.BUILD_IN.distributed_fire_control.id
				);

				if (hasDistributedFireControlBuildIn)
					return [hullMod, reason.hasDistributedFireControlReason];

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
				hasHighScatterAmplifierReason:
					"Incompatible with High Scatter Amplifier",
				hasAdvancedOpticsBuildInReason: "Already Build-In",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const { id: currentId, reason } = HULLMODS.WEAPONS.advancedoptics;

				// Incompatible with High Scatter Amplifier
				const hasHighScatterAmplifierInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.WEAPONS.high_scatter_amp.id
				);

				if (hasHighScatterAmplifierInstalled)
					return [hullMod, reason.hasHighScatterAmplifierReason];

				// Advanced Optics BuildIn
				const hasAdvancedOpticsBuildIn = builtInMods.some(
					({ id }) => id === currentId
				);
				if (hasAdvancedOpticsBuildIn)
					return [hullMod, reason.hasAdvancedOpticsBuildInReason];

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
				hasAdvancedOpticsReason: "Incompatible with Advanced Optics",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const { reason } = HULLMODS.WEAPONS.high_scatter_amp;

				// Incompatible with Advanced Optics
				const hasAdvancedOpticsInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.WEAPONS.advancedoptics.id
				);

				// Incompatible with Advanced Optics
				const hasAdvancedOpticsBuildIn = builtInMods.some(
					({ id }) => id === HULLMODS.WEAPONS.advancedoptics.id
				);

				if (hasAdvancedOpticsInstalled || hasAdvancedOpticsBuildIn)
					return [hullMod, reason.hasAdvancedOpticsReason];

				return null;
			},
		},
	},
	DEFENSES: {
		// Blast Doors
		blast_doors: {
			id: "blast_doors",
			name: "Blast Doors",
			_whyNot: "hullmod that can be installed on any ship.",

			// Installs additional hermetic and heavily reinforced doors at critical junctures throughout the ship.
			// Increases hull integrity by 20%.
			//
			// IGNORE // Ship takes 60% fewer crew casualties from hull damage sustained in combat.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hitPoints, hullSize } = userShipBuild;

				const [increaseHullIntegrity, _crewCasulties] =
					hullMod.effectValues.regularValues;

				return {
					...userShipBuild,

					// Add OP cost
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),

					// New Armor Value
					hitPoints: HullModHelper.convertStringPercentIntoNumber(
						increaseHullIntegrity,
						VALUE_CHANGE.INCREASE,
						hitPoints
					),
				};
			},
			// S-mod bonus: Increases the crew casualty reduction to 85%.
			sModsLogic: function () {},
		},

		// Heavy Armor
		heavyarmor: {
			id: "heavyarmor",
			name: "Heavy Armor",
			_whyNot: "hullmod that can be installed on any ship.",

			// Increases the ship's armor by 150/300/400/500 points, depending on hull size.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, armor } = userShipBuild;

				const [frigateFlux, destroyerFlux, cruiserFlux, capitalFlux] =
					hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					armor:
						armor +
						HullModHelper.hullModHullSizeConverter(
							hullSize,
							frigateFlux,
							destroyerFlux,
							cruiserFlux,
							capitalFlux
						),
				};
			},

			// S-mod penalty: Reduces the ship's maneuverability by 25%.
			sModsLogic: function () {},
		},

		// Reinforced Bulkheads
		reinforcedhull: {
			id: "reinforcedhull",
			name: "Reinforced Bulkheads",
			_whyNot: "hullmod that can be installed on any ship.",

			// Increases the ship's hull integrity by 40%. If disabled,
			// the ship will not break apart and is almost always recoverable after the battle.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, hitPoints } = userShipBuild;

				const [newHullIntegrity] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					hitPoints: HullModHelper.convertStringPercentIntoNumber(
						newHullIntegrity,
						VALUE_CHANGE.INCREASE,
						hitPoints
					),
				};
			},
		},
	},
	FIGHTER: {
		// Converted Hangar
		//! add Logic later, sounds very complicated
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
			filterReason: function (hullMod, userShipBuild) {
				const { hullSize, shieldType, fighterBays } = userShipBuild;
				const { reason } = HULLMODS.FIGHTER.converted_hangar;

				// Not on Frigate
				const isFrigate = hullSize === HULL_SIZE.FRIGATE;

				if (isFrigate) return [hullMod, reason.isFrigateReason];

				// Already has Fighter Slots

				const hasFighterSlots = fighterBays >= 1;
				if (hasFighterSlots) return [hullMod, reason.hasFighterSlotsReason];

				// Not on PhaseAlready has Fighter Slots

				const isPhase = shieldType === SHIELD_TYPE.PHASE;
				if (isPhase) return [hullMod, reason.isPhaseReason];

				return null;
			},
		},
		// Defensive Targeting Array
		defensive_targeting_array: {
			id: "defensive_targeting_array",
			name: "Defensive Targeting Array",
			_whyNot: "hullmod that can be installed on any ship with a Fighter Wing.",
			reason: {
				noFighterSlotsReason: "No Fighter Slots",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { fighterBays } = userShipBuild;

				const { reason } = HULLMODS.FIGHTER.defensive_targeting_array;

				// No Fighter Slots
				const hasNoFighterSlots = fighterBays <= 0;
				if (hasNoFighterSlots) return [hullMod, reason.noFighterSlotsReason];

				return null;
			},
		},
		// Expanded Deck Crew
		expanded_deck_crew: {
			id: "expanded_deck_crew",
			name: "Expanded Deck Crew",
			_whyNot: "hullmod that can be installed on any ship with a Fighter Wing.",
			reason: {
				noFighterSlotsReason: "No Fighter Slots",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { fighterBays } = userShipBuild;

				const { reason } = HULLMODS.FIGHTER.expanded_deck_crew;

				// No Fighter Slots
				const hasNoFighterSlots = fighterBays <= 0;
				if (hasNoFighterSlots) return [hullMod, reason.noFighterSlotsReason];

				return null;
			},

			// IGNORE // Reduces the rate at which the fighter replacement rate decreases due to fighter losses by 10%,
			// IGNORE // and increases the rate at which it recovers by 20%.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, fighterBays, minCrew } =
					userShipBuild;

				const [
					_descreasesFighterLosses,
					_increaseFighterLossRecovery,
					increaseCrewRequirement,
				] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					// Add OP cost
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					// Increases the crew required by 20 per fighter bay.
					minCrew: HullModHelper.increaseMinCrewByFighterBay(
						minCrew,
						increaseCrewRequirement,
						fighterBays
					),
				};
			},
		},
		// Recovery Shuttles
		recovery_shuttles: {
			id: "recovery_shuttles",
			name: "Recovery Shuttles",
			_whyNot: "hullmod that can be installed on any ship with a Fighter Wing.",
			reason: {
				noFighterSlotsReason: "No Fighter Slots",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { fighterBays } = userShipBuild;

				const { reason } = HULLMODS.FIGHTER.recovery_shuttles;

				// No Fighter Slots
				const hasNoFighterSlots = fighterBays <= 0;
				if (hasNoFighterSlots) return [hullMod, reason.noFighterSlotsReason];

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
				notAutomatedShip: "Only on Automated Ships",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { reason } = HULLMODS.SPECIAL.neural_integrator;

				// Only on Automated Ships
				const automatedCheck = false;
				if (!automatedCheck) return [hullMod, reason.notAutomatedShip];

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
				notCorrectHullSizeReason: "Only on Destroyer / Cruiser",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { hullSize } = userShipBuild;

				const { reason } = HULLMODS.SPECIAL.escort_package;

				// Only on Destroyer / Cruiser
				const isNotCruiser = hullSize !== HULL_SIZE.CRUISER;
				const isNotDestroyer = hullSize !== HULL_SIZE.DESTROYER;

				if (isNotCruiser && isNotDestroyer)
					return [hullMod, reason.notCorrectHullSizeReason];

				return null;
			},
		},
		// Hardened Subsystems
		hardened_subsystems: {
			id: "hardened_subsystems",
			name: "Hardened Subsystems",
			_whyNot: "hullmod that can be installed on any ship.",

			// Increases peak operating time for ships that suffer degraded performance from extended deployment by 50%.
			// Also reduces the rate at which combat readiness degrades by 25%.
			hullModLogic: function (userShipBuild, hullMod) {
				const {
					ordinancePoints,
					hullSize,
					peakPerformanceSec,
					crLossPerSecond,
				} = userShipBuild;

				const [increasePeakOperatingTime, reduceDegradationOfCombatReasiness] =
					hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					peakPerformanceSec: HullModHelper.convertStringPercentIntoNumber(
						increasePeakOperatingTime,
						VALUE_CHANGE.INCREASE,
						peakPerformanceSec
					),
					crLossPerSecond: HullModHelper.convertStringPercentIntoNumber(
						reduceDegradationOfCombatReasiness,
						VALUE_CHANGE.INCREASE,
						crLossPerSecond
					),
				};
			},

			// S-mod bonus: Increases 0-flux speed boost by 10, and doubles the 0-flux turn rate bonus.
			sModsLogic: function () {},
		},
		// Flux Coil Adjunct
		fluxcoil: {
			id: "fluxcoil",
			name: "Flux Coil Adjunct",
			_whyNot: "hullmod that can be installed on any ship.",

			// Increases the ship's flux capacity by 600/1200/1800/3000, depending on hull size.
			// Not as efficient as flux capacitors - most useful when added to a design that already
			// carries the maximum possible number of capacitors.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, fluxCapacity } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					fluxCapacity: HullModHelper.updateFluxCapacityOrDissipation(
						fluxCapacity,
						hullSize,
						hullMod.effectValues.regularValues
					),
				};
			},

			// S-mod bonus: Increases flux capacity by a further 200/400/600/1000, making the coil as efficient as adding capacitors.
			sModsLogic: function () {},
		},

		// Flux Distributor
		fluxdistributor: {
			id: "fluxdistributor",
			name: "Flux Distributor",
			_whyNot: "hullmod that can be installed on any ship.",

			// Increases the ship's flux dissipation by 30/60/90/150, depending on hull size.
			// Not as efficient as flux vents - most useful when added to a design that already carries
			// the maximum possible number of vents.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, fluxDissipation } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					fluxDissipation: HullModHelper.updateFluxCapacityOrDissipation(
						fluxDissipation,
						hullSize,
						hullMod.effectValues.regularValues
					),
				};
			},

			// S-mod bonus: Increases flux dissipation by a further 10/20/30/50, making the distributor as efficient as adding vents.
			sModsLogic: function () {},
		},
	},
	LOGISTICS: {
		// Additional Berthing
		additional_berthing: {
			id: "additional_berthing",
			name: "Additional Berthing",
			_whyNot:
				"hullmod that can be installed on any ship. Ships are limited to 2 such logistics hullmods at any one time.",
			reason: {
				maxLogisticsReason: "Only 2 Logistics Mods Per Ship",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods } = userShipBuild.hullMods;

				const { id: currentId, reason } =
					HULLMODS.LOGISTICS.additional_berthing;

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},

			// Increases maximum crew capacity by 30/60/100/200, depending on hull size, or by 30%, whichever is higher.
			// For civilian-grade hulls, also increases maintenance supply use by 100%.

			hullModLogic: function (userShipBuild, hullMod) {
				const {
					ordinancePoints,
					hullSize,
					maxCrew,
					hullMods,
					suppliesPerMonth,
				} = userShipBuild;

				// Extract Values
				const [
					frigateFlux,
					destroyerFlux,
					cruiserFlux,
					capitalFlux,
					increaseByPercentValue,
					increaseOfSupplyUseIfCivilian,
				] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					suppliesPerMonth: HullModHelper.isCivilianInreaseSuppliesPerMonth(
						hullMods,
						increaseOfSupplyUseIfCivilian,
						suppliesPerMonth,
						HULLMODS.BUILD_IN.civgrade.id
					),
					maxCrew: HullModHelper.updateMaxCrewCargoFuel(
						hullSize,
						frigateFlux,
						destroyerFlux,
						cruiserFlux,
						capitalFlux,
						increaseByPercentValue,
						maxCrew
					),
				};
			},
			// S-mod bonus: Doubles the crew capacity increase and, for civilian hulls, negates the maintenance cost increase.
		},
		// Auxiliary Fuel Tanks
		auxiliary_fuel_tanks: {
			id: "auxiliary_fuel_tanks",
			name: "Auxiliary Fuel Tanks",
			_whyNot:
				"hullmod that can be installed on any ship. Ships are limited to 2 such logistics hullmods at any one time.",
			reason: {
				maxLogisticsReason: "Max 2 Logistics Mods Per Ship",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods } = userShipBuild.hullMods;

				const { id: currentId, reason } =
					HULLMODS.LOGISTICS.auxiliary_fuel_tanks;

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},
			// "Increases maximum fuel capacity by 30/60/100/200, depending on hull size,
			// or by 30%, whichever is higher. For civilian-grade hulls, also increases maintenance
			// supply use by 100%.",
			hullModLogic: function (userShipBuild, hullMod) {
				const {
					ordinancePoints,
					hullSize,
					fuelCap,
					hullMods,
					suppliesPerMonth,
				} = userShipBuild;

				// Extract Values
				const [
					frigateFlux,
					destroyerFlux,
					cruiserFlux,
					capitalFlux,
					increaseByPercentValue,
					increaseOfSupplyUseIfCivilian,
				] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					suppliesPerMonth: HullModHelper.isCivilianInreaseSuppliesPerMonth(
						hullMods,
						increaseOfSupplyUseIfCivilian,
						suppliesPerMonth,
						HULLMODS.BUILD_IN.civgrade.id
					),
					fuelCap: HullModHelper.updateMaxCrewCargoFuel(
						hullSize,
						frigateFlux,
						destroyerFlux,
						cruiserFlux,
						capitalFlux,
						increaseByPercentValue,
						fuelCap
					),
				};
			},

			// S-mod bonus: Doubles the fuel capacity increase and, for civilian hulls,
			// negates the maintenance cost increase.
		},

		// Efficiency Overhaul
		efficiency_overhaul: {
			id: "efficiency_overhaul",
			name: "Efficiency Overhaul",
			_whyNot:
				"hullmod that can be installed on any ship. Ships are limited to 2 such logistics hullmods at any one time.",
			reason: {
				maxLogisticsReason: "Max 2 Logistics Mods Per Ship",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods } = userShipBuild.hullMods;

				const { id: currentId, reason } =
					HULLMODS.LOGISTICS.efficiency_overhaul;

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},
			// Reduces supply use for maintenance, fuel use, and minimum crew required by 20%.
			// Increases the combat readiness recovery and repair rates by 50%.
			// The per-day supply consumption for CR recovery is increased to account for the
			// increased recovery rate, but the total supply cost remains the same.",
			hullModLogic: function (userShipBuild, hullMod) {
				const {
					ordinancePoints,
					hullSize,
					minCrew,
					fuelPerLY,
					suppliesPerMonth,
					crRecoveryPerDay,
				} = userShipBuild;

				// Extract Values
				const [
					supplyPerMonthFuelMinCrew,
					increasesCombatReadinessRecoveryRepairRates,
				] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					minCrew: HullModHelper.decreaseValue(
						minCrew,
						supplyPerMonthFuelMinCrew
					),
					fuelPerLY: HullModHelper.decreaseValue(
						fuelPerLY,
						supplyPerMonthFuelMinCrew
					),
					suppliesPerMonth: HullModHelper.decreaseValue(
						suppliesPerMonth,
						supplyPerMonthFuelMinCrew
					),
					crRecoveryPerDay: HullModHelper.increaseValue(
						crRecoveryPerDay,
						increasesCombatReadinessRecoveryRepairRates
					),
				};
			},
			// S-mod bonus: Reduces maintenance cost, fuel use, and minimum crew requirement by a further 10%.
		},
		// Expanded Cargo Holds
		expanded_cargo_holds: {
			id: "expanded_cargo_holds",
			name: "Expanded Cargo Holds",
			_whyNot:
				"hullmod that can be installed on any ship. Ships are limited to 2 such logistics hullmods at any one time.",
			reason: {
				maxLogisticsReason: "Max 2 Logistics Mods Per Ship",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods } = userShipBuild.hullMods;

				const { id: currentId, reason } =
					HULLMODS.LOGISTICS.expanded_cargo_holds;

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},

			// Increases maximum cargo capacity by 30/60/100/200, depending on hull size, or by 30%, whichever is higher.
			// For civilian-grade hulls, also increases maintenance supply use by 50%.

			hullModLogic: function (userShipBuild, hullMod) {
				const {
					ordinancePoints,
					hullSize,
					cargoCap,
					hullMods,
					suppliesPerMonth,
				} = userShipBuild;
				// Extract Values
				const [
					frigateFlux,
					destroyerFlux,
					cruiserFlux,
					capitalFlux,
					increaseByPercentValue,
					increaseOfSupplyUseIfCivilian,
				] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					suppliesPerMonth: HullModHelper.isCivilianInreaseSuppliesPerMonth(
						hullMods,
						increaseOfSupplyUseIfCivilian,
						suppliesPerMonth,
						HULLMODS.BUILD_IN.civgrade.id
					),
					cargoCap: HullModHelper.updateMaxCrewCargoFuel(
						hullSize,
						frigateFlux,
						destroyerFlux,
						cruiserFlux,
						capitalFlux,
						increaseByPercentValue,
						cargoCap
					),
				};
			},

			// S-mod bonus: Doubles the cargo capacity increase and, for civilian hulls,
			// negates the maintenance cost increase.
			sModsLogic: function () {},
		},
		// High Resolution Sensors
		hiressensors: {
			id: "hiressensors",
			name: "High Resolution Sensors",
			_whyNot:
				"hullmod that can be installed on any ship. Ships are limited to 2 such logistics hullmods at any one time.",
			reason: {
				maxLogisticsReason: "Max 2 Logistics Mods Per Ship",
				isAlreadyBuildInReason: "Already Build-In",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const { id: currentId, reason } = HULLMODS.LOGISTICS.hiressensors;

				// High Resolution Sensors Build-In
				const isAlreadyInstalled = builtInMods.some(
					({ id }) => id === currentId
				);

				if (isAlreadyInstalled) return [hullMod, reason.isAlreadyBuildInReason];

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},

			// A ship with high resolution sensors increases the fleet's sensors by 50/75/100/150,
			//  depending on the hull size. Each additional ship with high resolution
			//  sensors provides diminishing returns. The higher the highest sensor
			//  range increase from a single ship in the fleet, the later diminishing returns kick in.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, sensorStrength } = userShipBuild;

				// Extract Values
				const [frigateFlux, destroyerFlux, cruiserFlux, capitalFlux] =
					hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					sensorStrength:
						sensorStrength +
						HullModHelper.hullModHullSizeConverter(
							hullSize,
							frigateFlux,
							destroyerFlux,
							cruiserFlux,
							capitalFlux
						),
				};
			},

			// S-mod bonus: Increases the ship's in-combat vision range by 1000/1500/2000/2500, based on hull size.
			sModsLogic: function () {},
		},

		// Converted Fighter Bay
		converted_fighterbay: {
			id: "converted_fighterbay",
			name: "Converted Fighter Bay",
			_whyNot:
				"It can only be installed on ships which have permanently built-in fighter bays such as Shepherd, Tempest or the stock Venture.",
			reason: {
				maxLogisticsReason: "Max 2 Logistics Mods Per Ship",
				noBuildInFighterBaysReason: "Needs Build-In Fighter Bays",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods } = userShipBuild.hullMods;
				const { builtInWings } = userShipBuild.secondaryData;

				const { id: currentId, reason } =
					HULLMODS.LOGISTICS.converted_fighterbay;

				// Needs Build-In Fighter Bays
				if (!builtInWings) return [hullMod, reason.noBuildInFighterBaysReason];

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},

			// Converts the ship's fighter bays housing built-in wings into improvised cargo holds, giving it an additional 50 cargo
			// and reducing it's crew requirements by 20% per fighter bay.
			// The crew reduction is limited to a maximum of 80%.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, secondaryData, cargoCap, minCrew } =
					userShipBuild;

				const { builtInWings } = secondaryData;
				const countBuiltInWings = builtInWings.length;

				// Extract Values
				const [
					increaseCargoBy,
					reduceMinCrewPerFighterBay,
					crewReductionLimit,
				] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					minCrew: HullModHelper.decreaseMinCrewReq(
						minCrew,
						reduceMinCrewPerFighterBay,
						crewReductionLimit,
						countBuiltInWings
					),
					cargoCap: HullModHelper.increaseCargo(
						cargoCap,
						increaseCargoBy,
						countBuiltInWings
					),
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
			// S-mod bonus: Monthly maintenance cost reduced by 15% per fighter bay.
			sModsLogic: function () {},
		},
		// Militarized Subsystems
		militarized_subsystems: {
			id: "militarized_subsystems",
			name: "Militarized Subsystems",
			reason: {
				notCivilianReason: "Only on Civilian Ships",
				maxLogisticsReason: "Max 2 Logistics Mods Per Ship",
			},
			_why: "hullmod that can be installed on any ship with Civilian-grade Hull. Logistics Limit = 2",

			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const { id: currentId, reason } =
					HULLMODS.LOGISTICS.militarized_subsystems;

				// Only on Civilian Ships

				const notCivilianShip = builtInMods.some(
					({ id }) => id !== HULLMODS.BUILD_IN.civgrade.id
				);

				if (notCivilianShip) return [hullMod, reason.notCivilianReason];

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},

			// Removes the penalties from a civilian-grade hull, and increases maximum burn level by 1.
			// Increases minimum crew required by 100%.

			hullModLogic: function (userShipBuild, hullMod) {},
			// S-mod bonus: Negates the increased crew requirements.
			sModsLogic: function () {},
		},

		// Insulated Engine Assembly
		insulatedengine: {
			id: "insulatedengine",
			name: "Insulated Engine Assembly",
			_whyNot:
				"hullmod that can be installed on any ship. Ships are limited to 2 such logistics hullmods at any one time.",
			reason: {
				maxLogisticsReason: "Only 2 Logistics Mods Per Ship",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods } = userShipBuild.hullMods;

				const { id: currentId, reason } = HULLMODS.LOGISTICS.insulatedengine;

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},

			// Increases the durability of the ship's engines by 100%, and the ship's hull integrity by 10%.
			// The ship's sensor profile is also reduced by 50%.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, hitPoints, sensorProfile } =
					userShipBuild;

				// Extract Values
				const [_engineDurability, newHullIntegrity, newSensorProfile] =
					hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					hitPoints: HullModHelper.increaseValue(hitPoints, newHullIntegrity),
					sensorProfile: HullModHelper.decreaseValue(
						sensorProfile,
						newSensorProfile
					),
				};
			},
			// S-mod bonus: Increases engine durability by a further 100%, and Increases the sensor profile reduction to 90%.
			sModsLogic: function () {},
		},

		// Solar Shielding
		solar_shielding: {
			id: "solar_shielding",
			name: "Solar Shielding",
			_whyNot:
				"hullmod that can be installed on any ship. Ships are limited to 2 such logistics hullmods at any one time.",
			reason: {
				maxLogisticsReason: "Only 2 Logistics Mods Per Ship",
				isAlreadyBuildInReason: "Already Build-In",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const { id: currentId, reason } = HULLMODS.LOGISTICS.solar_shielding;

				// Already Installed
				const isAlreadyBuildIn = builtInMods.some(({ id }) => id === currentId);

				if (isAlreadyBuildIn) return [hullMod, reason.isAlreadyBuildInReason];

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},

			// Originally developed by Diktat engineers after spending cycles dealing with the unique
			// conditions of the inner Askonia system. Decreases the effect operating in a solar corona
			//  has on combat readiness by 75%; also has the same effect against storms in deep hyperspace.

			// In combat situations, reduces energy damage taken by 10%.

			hullModLogic: function (userShipBuild, hullMod) {},
			// S-mod bonus: Increases the protection from solar coronae and similar hazards to 100%.
			sModsLogic: function () {},
		},
		// Surveying Equipment
		surveying_equipment: {
			id: "surveying_equipment",
			name: "Surveying Equipment",
			_whyNot:
				"hullmod that can be installed on any ship to provide surveying costs reductions.",
			reason: {
				maxLogisticsReason: "Only 2 Logistics Mods Per Ship",
				isAlreadyBuildInReason: "Already Build-In",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const { id: currentId, reason } =
					HULLMODS.LOGISTICS.surveying_equipment;

				// Already Installed
				const isAlreadyBuildIn = builtInMods.some(({ id }) => id === currentId);

				if (isAlreadyBuildIn) return [hullMod, reason.isAlreadyBuildInReason];

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},

			// Reduces the heavy machinery and supplies required to perform surveys by 5/10/20/40 depending on hull size, down to a minimum of 5 for each.

			hullModLogic: function (userShipBuild, hullMod) {},
			// S-mod bonus: Increases the survey cost reduction by 100%.
			sModsLogic: function () {},
		},

		// Augmented Drive Field
		augmentedengines: {
			id: "augmentedengines",
			name: "Augmented Drive Field",
			_whyNot:
				"hullmod that can be installed on any ship to provide surveying costs reductions.",
			reason: {
				maxLogisticsReason: "Only 2 Logistics Mods Per Ship",
				isAlreadyBuildInReason: "Already Build-In",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { installedHullMods, builtInMods } = userShipBuild.hullMods;

				const { id: currentId, reason } = HULLMODS.LOGISTICS.augmentedengines;

				const isAlreadyInstalled = builtInMods.some(
					({ id }) => id === currentId
				);

				if (isAlreadyInstalled) return [hullMod, reason.isAlreadyBuildInReason];

				// Max 2 Logistics Mods Per Ship
				const maxLogisticsLimit = installedHullMods.filter(
					({ id, uiTags }) =>
						id !== currentId && uiTags.includes(UI_TAGS.LOGISTICS)
				).length;

				if (maxLogisticsLimit >= 2) return [hullMod, reason.maxLogisticsReason];

				return null;
			},

			// Increases the maximum burn level by 2.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, shipBurn } = userShipBuild;

				// Extract Values

				const [increaseMaxBurn] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					shipBurn: HullModHelper.updateMaxShipBurn(shipBurn, increaseMaxBurn),
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullSize,
						hullMod
					),
				};
			},
			// S-mod bonus: Increases maximum burn level by a further +1.
			sModsLogic: function () {},
		},
	},

	SHIELD: {
		// Shield Conversion - Front
		frontemitter: {
			id: "frontemitter",
			name: "Shield Conversion - Front",
			reason: {
				hasFrontShieldReason: "Already Has Front Shield",
				noShieldReason: "Must have a Shield",
			},
			_why: "hullmod that can be installed on any ship that has shields. Incompatible with Front Shield",

			filterReason: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.frontemitter.reason;

				// Already Has Front Shield
				const isFrontShield = shieldType === SHIELD_TYPE.FRONT;

				if (isFrontShield) return [hullMod, reason.hasFrontShieldReason];

				// Must have a Shield
				const hasNoShield =
					shieldType !== SHIELD_TYPE.OMNI && shieldType !== SHIELD_TYPE.FRONT;

				if (hasNoShield) return [hullMod, reason.noShieldReason];

				return null;
			},
		},
		// Shield Conversion - Omni
		adaptiveshields: {
			id: "adaptiveshields",
			name: "Shield Conversion - Omni",
			reason: {
				hasOmniShieldReason: "Already Has OMNI Shield",
				noShieldReason: "Must have a Shield",
			},
			_whyNot:
				"hullmod that can be installed on any ship that has shields. Incompatible with OMNI Shield",

			filterReason: function (hullMod, userShipBuild) {
				const { reason } = HULLMODS.SHIELD.adaptiveshields;
				const { shieldType } = userShipBuild;

				// Already Has OMNI Shield
				const hasOmniShield = shieldType === SHIELD_TYPE.OMNI;

				if (hasOmniShield) return [hullMod, reason.hasOmniShieldReason];

				// Must have a Shield
				const hasNoShield =
					shieldType !== SHIELD_TYPE.OMNI && shieldType !== SHIELD_TYPE.FRONT;

				if (hasNoShield) return [hullMod, reason.noShieldReason];

				return null;
			},
		},
		//! unfinished
		// Accelerated Shields
		advancedshieldemitter: {
			id: "advancedshieldemitter",
			name: "Accelerated Shields",
			_whyNot: "hullmod that can be installed on any ship that has shields",
			reason: { noShieldReason: "Must have a Shield" },
			filterReason: function (hullMod, userShipBuild) {
				const { shieldType } = userShipBuild;
				const { reason } = HULLMODS.SHIELD.advancedshieldemitter;

				// Must have a Shield
				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) return [hullMod, reason.noShieldReason];

				return null;
			},

			// Increases the turn rate of the ship's shields by 100% and the rate at which they are raised by 100%
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				// Add OP cost
				const newOrdinancePoints =
					ordinancePoints + normalizedHullSize(hullMod, hullSize);

				return {
					...userShipBuild,
					ordinancePoints: newOrdinancePoints,
				};
			},
			// S-mod bonus: Increases the shield's turn rate and raise rate by an additional 100%
		},
		// Stabilized Shields
		stabilizedshieldemitter: {
			id: "stabilizedshieldemitter",
			name: "Stabilized Shields",
			_whyNot: "hullmod that can be installed on any ship that has shields",
			reason: { noShieldReason: "Must have a Shield" },
			filterReason: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.stabilizedshieldemitter.reason;

				// Must have a Shield
				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) return [hullMod, reason.noShieldReason];

				return null;
			},
		},
		// Hardened Shields
		hardenedshieldemitter: {
			id: "hardenedshieldemitter",
			name: "Hardened Shields",
			_whyNot: "hullmod that can be installed on any ship that has shields",
			reason: { noShieldReason: "Must have a Shield" },
			filterReason: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.hardenedshieldemitter.reason;

				// Must have a Shield
				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) return [hullMod, reason.noShieldReason];

				return null;
			},
			// Reduces the amount of damage taken by shields by 20%.
			// Also reduces the chance that shields will be pierced by EMP arcs from weapons like the Ion Beam.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, shieldEfficiency } = userShipBuild;

				const [reduceShieldDamage] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					shieldEfficiency: HullModHelper.decreaseValue(
						shieldEfficiency,
						reduceShieldDamage
					),
				};
			},
		},
		// Extended Shields
		extendedshieldemitter: {
			id: "extendedshieldemitter",
			name: "Extended Shields",
			_whyNot: "hullmod that can be installed on any ship that has shields",
			reason: { noShieldReason: "Must have a Shield" },
			filterReason: function (hullMod, userShipBuild) {
				const shieldType = userShipBuild.shieldType;
				const reason = HULLMODS.SHIELD.extendedshieldemitter.reason;

				// Must have a Shield
				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) return [hullMod, reason.noShieldReason];

				return null;
			},

			// Increases the shield's coverage by 60 degrees.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, shieldArc } = userShipBuild;

				const [increaseShieldArc] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					shieldArc: HullModHelper.updateShieldArc(
						shieldArc,
						increaseShieldArc
					),
				};
			},
			// S-mod bonus: Increases the shield's coverage by an additional 60 degrees.
		},

		// Makeshift Shield Generator
		//! unfinished, I need // shieldUpkeep // shieldEfficiency from the game
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
			filterReason: function (hullMod, userShipBuild) {
				const { reason } = HULLMODS.SHIELD.frontshield;
				const { shieldType } = userShipBuild;
				const { installedHullMods } = userShipBuild.hullMods;

				// Not on Phase Ship
				const isPhase = shieldType === SHIELD_TYPE.PHASE;
				if (isPhase) return [hullMod, reason.isPhaseShipReason];

				// Already has a Shield
				const hasShield =
					shieldType === SHIELD_TYPE.FRONT || shieldType === SHIELD_TYPE.OMNI;

				if (hasShield) return [hullMod, reason.hasShieldReason];

				// Incompatible with Shield Shunt
				const isShieldShuntInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.SHIELD.shield_shunt.id
				);

				if (isShieldShuntInstalled) return [hullMod, reason.shieldShuntReason];

				return null;
			},
			// "Shield => FRONT and has a 90 degree arc. Top speed decrease by 20%",
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, speed, hullSize } = userShipBuild;
				const [newShieldArc, decreaseSpeedByPercent] =
					hullMod.effectValues.regularValues;

				// Shield Front
				const updateShieldType = SHIELD_TYPE.FRONT;
				// New Speed
				const newTopSpeed = convertStringPercentIntoNumber(
					decreaseSpeedByPercent,
					VALUE_CHANGE.DECREASE,
					speed
				);
				// Add OP cost
				const newOrdinancePoints =
					ordinancePoints + normalizedHullSize(hullMod, hullSize);
				// shieldUpkeep

				// shieldEfficiency

				return {
					...userShipBuild,
					shieldType: updateShieldType,
					shieldArc: newShieldArc,
					speed: newTopSpeed,
					ordinancePoints: newOrdinancePoints,
				};
			},
		},
		// Shield Shunt
		shield_shunt: {
			id: "shield_shunt",
			name: "Shield Shunt",
			_whyNot:
				"hullmod that can be installed on any ship that has shields. Incompatible with Makeshift Shield Generator.",
			reason: {
				noShieldReason: "Must have a Shield",
				hasShieldGeneratorReason:
					"Incompatible with Makeshift Shield Generator",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { reason } = HULLMODS.SHIELD.shield_shunt;

				const { shieldType } = userShipBuild;
				const { installedHullMods } = userShipBuild.hullMods;

				// Must have a shield
				const noShield =
					shieldType !== SHIELD_TYPE.FRONT && shieldType !== SHIELD_TYPE.OMNI;

				if (noShield) return [hullMod, reason.noShieldReason];

				// Incompatible with Makeshift Shield Generator
				const hasShieldGeneratorInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.SHIELD.frontshield.id
				);
				if (hasShieldGeneratorInstalled)
					return [hullMod, reason.hasShieldGeneratorReason];

				return null;
			},
			// Removes the ship's shields. The external emitter nodes are replaced with reinforced plating,
			// increasing the ship's armor by 15%.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, armor, hullSize } = userShipBuild;

				const [addArmorPercent] = hullMod.effectValues.regularValues;

				// Remove Shield
				const updateShieldType = SHIELD_TYPE.NONE;

				// New Armor Value
				const newArmorValue = convertStringPercentIntoNumber(
					addArmorPercent,
					VALUE_CHANGE.INCREASE,
					armor
				);
				// Add OP cost
				const newOrdinancePoints =
					ordinancePoints + normalizedHullSize(hullMod, hullSize);

				// Remove Shield Upkeep
				const newShieldUpkeep = 0;

				// Remove Shield Efficiency
				const newShieldEfficiency = 0;

				// Remove Shield Arc
				const newShieldArc = 0;

				return {
					...userShipBuild,
					shieldType: updateShieldType,
					shieldArc: newShieldArc,
					armor: newArmorValue,
					ordinancePoints: newOrdinancePoints,
					shieldUpkeep: newShieldUpkeep,
					shieldEfficiency: newShieldEfficiency,
				};
			},
			// S-mod bonus: Increases the ship's armor by an additional 15%.
			sModsLogic: function () {},
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
				notPhaseReason: "Not a Phase Ship",
				hasPhaseAnchorReason: "It is incompatible with Phase Anchor",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { shieldType, hullMods } = userShipBuild;
				const { installedHullMods } = hullMods;
				const { reason } = HULLMODS.PHASE.adaptive_coils;

				// Not a Phase Ship
				const notPhaseShip = shieldType !== SHIELD_TYPE.PHASE;
				if (notPhaseShip) return [hullMod, reason.notPhaseReason];

				// It is incompatible with Phase Anchor
				const isPhaseAnchorInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.PHASE.phase_anchor.id
				);

				if (isPhaseAnchorInstalled)
					return [hullMod, reason.hasPhaseAnchorReason];

				return null;
			},
		},
		phase_anchor: {
			id: "phase_anchor",
			name: "Phase Anchor",
			_whyNot:
				"hullmod that can be installed on any phase ship. It is incompatible with Adaptive Phase Coils.",
			reason: {
				notPhaseReason: "Not a Phase Ship",
				hasPhaseCoilsReason: "It is incompatible with Adaptive Phase Coils",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { reason } = HULLMODS.PHASE.phase_anchor;
				const { shieldType, hullMods } = userShipBuild;
				const { installedHullMods } = hullMods;

				// Not a Phase Ship
				const notPhaseShip = shieldType !== SHIELD_TYPE.PHASE;
				if (notPhaseShip) return [hullMod, reason.notPhaseReason];

				// It is incompatible with Adaptive Phase Coils
				const isPhaseCoilsInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.PHASE.adaptive_coils.id
				);
				if (isPhaseCoilsInstalled) return [hullMod, reason.hasPhaseCoilsReason];

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
				onlyCivilianShipWithMilReason:
					"Civilian Ships only with Militarized Subsystems",
				hasFluxShuntReason: "Incompatible with Flux Shunt.",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { hullSize, hullMods } = userShipBuild;
				const { builtInMods, installedHullMods } = hullMods;

				const { reason } = HULLMODS.ENGINE.safetyoverrides;

				// Not on Capital Ship
				const isShipCapital = hullSize === HULL_SIZE.CAPITAL_SHIP;
				if (isShipCapital) return [hullMod, reason.notOnCapitalShipReason];

				// Incompatible with Flux Shunt
				const hasFluxShunt = builtInMods.some(
					({ id }) => id === HULLMODS.BUILD_IN.fluxshunt.id
				);
				if (hasFluxShunt) return [hullMod, reason.hasFluxShuntReason];

				// Civilian Ships only with Militarized Subsystems
				const isShipCivilian = builtInMods.some(
					({ id }) => id === HULLMODS.BUILD_IN.civgrade.id
				);
				const isMilitarizedSubsystemsInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.LOGISTICS.militarized_subsystems.id
				);
				// if not Militarized Subsystems installed would set true, if true than make it red
				const isCivilianCheck =
					isShipCivilian && !isMilitarizedSubsystemsInstalled;

				if (isCivilianCheck)
					return [hullMod, reason.onlyCivilianShipWithMilReason];

				return null;
			},
		},
		// Auxiliary Thrusters
		auxiliarythrusters: {
			id: "auxiliarythrusters",
			name: "Auxiliary Thrusters",
			_whyNot: "hullmod that can be installed on any ship.",

			// Increases the ship's maneuverability by 50%.
			hullModLogic: function (userShipBuild, hullMod) {
				const {
					ordinancePoints,
					hullSize,
					acceleration,
					turnAcceleration,
					deceleration,
				} = userShipBuild;
				const [increaseManeuverability] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					// Add OP cost
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),

					// Increase in acceleration
					acceleration: HullModHelper.convertStringPercentIntoNumber(
						increaseManeuverability,
						VALUE_CHANGE.INCREASE,
						acceleration
					),

					// Increase in deceleration
					deceleration: HullModHelper.convertStringPercentIntoNumber(
						increaseManeuverability,
						VALUE_CHANGE.INCREASE,
						deceleration
					),

					// Increase in turnAcceleration
					turnAcceleration: HullModHelper.convertStringPercentIntoNumber(
						increaseManeuverability,
						VALUE_CHANGE.INCREASE,
						turnAcceleration
					),
				};
			},

			// S-mod bonus: Increases 0-flux speed boost by 10, and doubles the 0-flux turn rate bonus.
			sModsLogic: function () {},
		},
		// Nav Relay
		nav_relay: {
			id: "nav_relay",
			name: "Nav Relay",
			_whyNot: "hullmod that can be installed on any ship.",

			// When deployed in combat, increases the nav rating of your fleet by 2%/3%/4%/5%,
			// depending on this ship's hull size.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, speed } = userShipBuild;

				// Extract Values
				const [frigateFlux, destroyerFlux, cruiserFlux, capitalFlux] =
					hullMod.effectValues.regularValues;

				console.log(userShipBuild);
				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					speed: HullModHelper.increaseValue(
						speed,
						HullModHelper.hullModHullSizeConverter(
							hullSize,
							frigateFlux,
							destroyerFlux,
							cruiserFlux,
							capitalFlux
						)
					),
				};
			},
		},
	},
};
// The Data was manually collected by Me.
// First array is regular data, second array is sMods
export const HULLMODS_DATA = {
	"Accelerated Shields": [["100%", "100%"], ["100%"]],
	"Adaptive Phase Coils": [["50%", "50%", "75%"], []],
	"Automated Repair Unit": [["50%"], ["25%", "33%"]],
	"Armored Weapon Mounts": [["100%", "25%", "25%", "10%"], ["10%"]],
	"Advanced Turret Gyros": [["75%"], ["25%", "5%"]],
	"Additional Berthing": [[30, 60, 100, 200, "30%", "100%"], []],
	"Auxiliary Fuel Tanks": [[30, 60, 100, 200, "30%", "50%"], []],
	"Augmented Drive Field": [[2], [1]],
	"Extended Shields": [[60], [60]],
	"Hardened Shields": [["20%"], []],
	"Stabilized Shields": [["50%"], ["10%"]],
	"Shield Conversion - Front": [["100%"], ["5%"]],
	"Shield Conversion - Omni": [["30%"], []],
	"Shield Shunt": [["15%"], ["15%"]],
	"Makeshift Shield Generator": [[90, "20%"], []],
	"Flux Shunt": [["50%"], []],
	"Blast Doors": [["20%", "60%"], ["85%"]],
	"Heavy Armor": [[150, 300, 400, 500], ["25%"]],
	"Reinforced Bulkheads": [["40%"], []],
	"Resistant Flux Conduits": [["50%", "25%"], ["10%"]],
	"Integrated Point Defense AI": [["50%"], []],
	"Solar Shielding": [["75%", "10%"], ["100%"]],
	"Advanced Optics": [[200, "30%"], []],
	"Ballistic Rangefinder": [[200, 100, 900, 100, 800, 100], []],
	"Dedicated Targeting Core": [
		["35%", "50%"],
		["40%", "60%"],
	],
	"ECCM Package": [["50%", "25%", "50%", "25%"], []],
	"Escort Package": [[1000, "25%", "10%", "20%", "doubled"], ["10%"]],
	"Expanded Magazines": [["50%"], ["50%"]],
	"Expanded Missile Racks": [["100%"], ["20%"]],
	"Missile Autoloader": [[], []],
	"High Scatter Amplifier": [["10%", 200, "50%"], ["5%"]],
	"Integrated Targeting Unit": [["10%", "20%", "40%", "60%"], []],
	"ECM Package": [["1%", "2%", "3%", "4%"], []],
	"Missile Autoforge": [[], []],
	"Energy Bolt Coherer": [[100, "50%"], []],
	"Auxiliary Thrusters": [["50%"], [10]],
	"Unstable Injector": [[25, 20, 15, 15, "15%", "25%"], []],
	"Safety Overrides": [[50, 30, 20, 2, 3, 450], []],
	"Nav Relay": [["2%", "3%", "4%", "5%"], []],
	"Insulated Engine Assembly": [
		["100%", "10%", "50%"],
		["100%", "90%"],
	],
	"Converted Hangar": [
		[1.5, 1.5, 40, 20, 1, 5, 1],
		["10%", "25%"],
	],
	"Defensive Targeting Array": [["50%"], [100]],
	"Expanded Deck Crew": [["15%", "25%", 20], []],
	"Recovery Shuttles": [["75%"], ["95%"]],
	"Converted Fighter Bay": [[50, "20%", "80%"], ["15%"]],
	"B-Deck": [["40%", "100%"], []],
	"Fighter Chassis Storage": [[], []],
	"Flux Coil Adjunct": [
		[600, 1200, 1800, 3000],
		[200, 400, 600, 1000],
	],
	"Flux Distributor": [
		[30, 60, 90, 150],
		[10, 20, 30, 50],
	],
	"Hardened Subsystems": [["50%", "25%"], []],
	"Neural Interface": [[50], []],
	"Neural Integrator": [[50, "10%"], []],
	"Operations Center": [["250%"], []],
	"Militarized Subsystems": [[1, "100%"], []],
	"Phase Anchor": [[0, "2x", "1x"], []],
	"Phase Field": [["50%", 5, 5], []],

	"Expanded Cargo Holds": [[30, 60, 100, 200, "30%", "50%"], []],
	"High Resolution Sensors": [
		[50, 75, 100, 150, "10%"],
		[1000, 1500, 2000, 2500],
	],
	"Efficiency Overhaul": [["20%", "50%"], ["10%"]],
	"Surveying Equipment": [[5, 10, 20, 40, 5], ["100%"]],
	"Shielded Cargo Holds": [[], []],
	"Salvage Gantry": [["10%", "25%", "30%", "40%", "20%"], []],
	"Civilian-grade Hull": [[100, 50], []],
	"High Maintenance": [[100], []],
};
// hullModEffectData: {
// 		// % number are calculated from ship base numbers.
// 		// base armor is 1000. increase armor by 10%, means base (1000) * 0.1 = 100. Than add the number to currentValueName
// 		// Stacking goes similiar, adding numbers from base values. 20% + 30% both are from base and just sum via addition.
// 		//
// 		//! each effectFunction must return array, empty or not. If empty, controller will ignore it.
// 		// dont put random garbage in return, return only currentValueName
// 		// this is to tell resetData function to target specific values
// 		acceleratedShields() {
// 			console.log("acceleratedShields");
// 			console.log("DOES NOTHING");
// 		},
// 		adaptivePhaseCoils() {
// 			console.log("adaptivePhaseCoils");
// 			console.log("DOES NOTHING");
// 		},

// 		additionalBerthing() {
// 			console.log("additionalBerthing");
// 			const target = "currentMaxCrew";
// 			const base = "_baseMaxCrew";

// 			return [
// 				hullModsHolder.cargoFuelCrewGenericCalc(target, base),
// 				hullModsHolder.supplyIncreaseIfCivilianShip(),
// 			];
// 		},
// 		advancedOptics() {
// 			console.log("advancedOptics");
// 			console.log("DOES NOTHING");
// 			// Extends the range of beam weapons by 200, but reduces their turn rate by 30%. Cumulative with Integrated Targeting Unit.
// 		},
// 		advancedTurretGyros() {
// 			console.log("advancedTurretGyros");
// 			console.log("DOES NOTHING");
// 		},

// 		armoredWeaponMounts() {
// 			console.log("armoredWeaponMounts");
// 			const target = "currentArmor";
// 			const base = "_baseArmor";
// 			const percentValue = 0.1;

// 			state.currentShipBuild[target] +=
// 				state.currentShipBuild[base] * percentValue;
// 			return [target];
// 		},

// 		augmentedDriveField() {
// 			console.log("augmentedDriveField");
// 			const { currentShipBuild } = state;
// 			const target = "currentShipBurn";
// 			const base = "_baseShipBurn";
// 			const value = 2;

// 			state.currentShipBuild[target] += currentShipBuild[base] + value;
// 			return [target];
// 		},
// 		automatedRepairUnit() {
// 			console.log("automatedRepairUnit");
// 			console.log("DOES NOTHING");
// 		},
// 		auxiliaryFuelTanks() {
// 			console.log("auxiliaryFuelTanks");
// 			const target = "currentFuelCap";
// 			const base = "_baseFuelCap";

// 			return [
// 				hullModsHolder.cargoFuelCrewGenericCalc(target, base),
// 				hullModsHolder.supplyIncreaseIfCivilianShip(),
// 			];
// 		},
// 		auxiliaryThrusters() {
// 			console.log("auxiliaryThrusters");
// 			console.log("DOES NOTHING");
// 		},
// 		ballisticRangefinder() {
// 			console.log("ballisticRangefinder");
// 			console.log("DOES NOTHING");
// 		},
// 		bDeck() {
// 			console.log("bDeck");
// 			console.log("DOES NOTHING");
// 			console.log("Build In Mod");
// 		},
// 		blastDoors() {
// 			console.log("blastDoors");
// 			// Increases hull integrity by 20%.
// 			const target = "currentHitPoints";
// 			const base = "_baseHitPoints";
// 			const percentValue = 0.2;

// 			state.currentShipBuild[target] +=
// 				state.currentShipBuild[base] * percentValue;
// 			return [target];
// 		},
// 		civilianGradeHull() {
// 			console.log("civilianGradeHull");
// 			console.log("DOES NOTHING");
// 			console.log("Build In Mod");
// 		},
// 		convertedFighterBay() {
// 			console.log("convertedFighterBay");
// 			const baseFighterBayProperty = "_baseFighterBays";

// 			const removeFighterBays = () => {
// 				const targetProperty = "currentFighterBays";
// 				const value = 0;
// 				state.currentShipBuild[targetProperty] = value;
// 				return targetProperty;
// 			};
// 			const increaseCargoSize = () => {
// 				const targetProperty = "currentCargoCap";
// 				const value = 50;
// 				state.currentShipBuild[targetProperty] +=
// 					state.currentShipBuild[baseFighterBayProperty] * value;
// 				return targetProperty;
// 			};
// 			const decreaseMinCrewReq = () => {
// 				const targetProperty = "currentMinCrew";
// 				const baseProperty = "_baseMinCrew";
// 				const fighterBayLimit =
// 					state.currentShipBuild[baseFighterBayProperty] > 4
// 						? 4
// 						: state.currentShipBuild[baseFighterBayProperty];

// 				const percentValue = 0.2;
// 				const calc =
// 					state.currentShipBuild[baseProperty] *
// 					(fighterBayLimit * percentValue);

// 				state.currentShipBuild[targetProperty] -= calc;
// 				//
// 				return targetProperty;
// 			};
// 			return [removeFighterBays(), increaseCargoSize(), decreaseMinCrewReq()];
// 		},
// 		convertedHangar() {
// 			// TODO I need to check the cost of all active fighter wings

// 			console.log("convertedHangar");
// 			console.log("DOES NOTHING");

// 			//  Increases the minimum crew by 20
// 			const increaseMinCrewReq = () => {
// 				const target = "currentMinCrew";
// 				const value = 20;

// 				state.currentShipBuild[target] += value;
// 				return target;
// 			};
// 			// Add Single Fighter Bay
// 			const addSingleFighterBay = () => {
// 				const target = "currentFighterBays";
// 				const value = 1;
// 				state.currentShipBuild[target] += value;

// 				return target;
// 			};
// 			//  Increases the ship's deployment points and supply cost to recover
// 			//  from deployment by 1 for every 5 ordnance points spent on fighters, or by at least 1 point.

// 			const increaseDeploymentCost = () => {};
// 			const increaseSupplyCost = () => {};

// 			return [increaseMinCrewReq(), addSingleFighterBay()];
// 		},
// 		dedicatedTargetingCore() {
// 			console.log("dedicatedTargetingCore");
// 			console.log("DOES NOTHING");
// 		},
// 		defensiveTargetingArray() {
// 			console.log("defensiveTargetingArray");
// 			console.log("DOES NOTHING");
// 		},
// 		eCCMPackage() {
// 			console.log("eCCMPackage");
// 			console.log("DOES NOTHING");
// 		},
// 		eCMPackage() {
// 			console.log("eCMPackage");
// 			console.log("DOES NOTHING");
// 		},
// 		efficiencyOverhaul() {
// 			console.log("efficiencyOverhaul");
// 			const supplies = ["currentSuppliesPerMonth", "_baseSuppliesPerMonth"];
// 			const crew = ["currentMinCrew", "_baseMinCrew"];
// 			const fuelCost = ["currentFuelPerLY", "_basyFuelPerLY"];
// 			const reduceMaintenanceFuelUseMinimumCrew = ([target, base]) => {
// 				// Reduces supply use for maintenance, fuel use, and minimum crew required by 20%.
// 				// 20%
// 				const value = 0.2;
// 				state.currentShipBuild[target] -= state.currentShipBuild[base] * value;
// 				return target;
// 			};
// 			const increaseReadinessRecovery = () => {
// 				// Increases the combat readiness recovery and repair rates by 50%.
// 				// recovery per day
// 				const target = "currentCrRecoveryPerDay";
// 				const base = "_baseCrRecoveryPerDay";
// 				const value = 0.5;
// 				state.currentShipBuild[target] += state.currentShipBuild[base] * value;
// 				return target;
// 			};

// 			// The per-day supply consumption for CR recovery is increased to account for the increased recovery rate,
// 			// but the total supply cost remains the same.
// 			return [
// 				reduceMaintenanceFuelUseMinimumCrew(supplies),
// 				reduceMaintenanceFuelUseMinimumCrew(crew),
// 				reduceMaintenanceFuelUseMinimumCrew(fuelCost),
// 				increaseReadinessRecovery(),
// 			];
// 		},
// 		energyBoltCoherer() {
// 			console.log("energyBoltCoherer");
// 			console.log("DOES NOTHING");
// 			console.log("Build In Mod");
// 		},
// 		escortPackage() {
// 			console.log("eCMPackage");
// 			console.log("DOES NOTHING");
// 		},
// 		expandedCargoHolds() {
// 			console.log("expandedCargoHolds");
// 			const target = "currentCargoCap";
// 			const base = "_baseCargoCap";
// 			return [
// 				hullModsHolder.cargoFuelCrewGenericCalc(target, base),
// 				hullModsHolder.supplyIncreaseIfCivilianShip(),
// 			];
// 		},
// 		expandedDeckCrew() {
// 			console.log("expandedDeckCrew");
// 			const target = "currentMinCrew";
// 			// const base = "_baseMinCrew";
// 			const currentfighterBays = "currentFighterBays";
// 			if (state.currentShipBuild[currentfighterBays] < 1) return;
// 			//Increases the crew required by 20 per fighter bay.
// 			const value = 20;
// 			state.currentShipBuild[target] +=
// 				state.currentShipBuild[currentfighterBays] * value;

// 			return [target];
// 		},
// 		expandedMagazines() {
// 			console.log("expandedMagazines");
// 			console.log("DOES NOTHING");
// 		},
// 		expandedMissileRacks() {
// 			console.log("expandedMissileRacks");
// 			console.log("DOES NOTHING");
// 		},
// 		extendedShields() {
// 			console.log("extendedShields");
// 			// const base = "_baseShieldArc";
// 			const target = "currentShieldArc";
// 			const value = 60;
// 			state.currentShipBuild[target] += value;
// 			return [target];
// 		},
// 		fighterChassisStorage() {
// 			console.log("fighterChassisStorage");
// 			console.log("DOES NOTHING");
// 			console.log("build In");
// 		},
// 		fluxCoilAdjunct() {
// 			console.log("fluxCoilAdjunct");
// 			const target = "currentFluxCapacity";
// 			const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(
// 				state.currentShipBuild.shipSize,
// 				3000,
// 				1800,
// 				1200,
// 				600
// 			);
// 			// Increases the ship's flux capacity by 600/1200/1800/3000, depending on hull size.
// 			state.currentShipBuild[target] += value;

// 			return [target];
// 		},
// 		fluxDistributor() {
// 			console.log("fluxDistributor");
// 			const target = "currentFluxDissipation";
// 			const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(
// 				state.currentShipBuild.shipSize,
// 				150,
// 				90,
// 				60,
// 				30
// 			);
// 			state.currentShipBuild[target] += value;

// 			return [target];
// 		},
// 		fluxShunt() {
// 			console.log("fluxShunt");
// 			console.log("DOES NOTHING");
// 			console.log("Build In??");
// 		},
// 		hardenedShields() {
// 			console.log("hardenedShields");
// 			const target = "currentShieldEfficiency";
// 			const base = "_baseShieldEfficiency";
// 			// Reduces the amount of damage taken by shields by 20%.
// 			const percentValue = 0.2;

// 			// if (state.currentShipBuild[base] > 0) {
// 			//   state.currentShipBuild[target] -=
// 			//     state.currentShipBuild[base] * percentValue;
// 			// } else {
// 			//   state.currentShipBuild[target] -=
// 			//     state.currentShipBuild[target] * percentValue;
// 			// }
// 			state.currentShipBuild[target] -=
// 				state.currentShipBuild[base] * percentValue;

// 			return [target];
// 		},
// 		hardenedSubsystems() {
// 			console.log("hardenedSubsystems");
// 			const target = "currentPeakPerformanceSec";
// 			const base = "_basePeakPerformanceSec";
// 			const percentValue = 0.5;

// 			state.currentShipBuild[target] +=
// 				state.currentShipBuild[base] * percentValue;

// 			return [target];
// 		},
// 		heavyArmor() {
// 			console.log("heavyArmor");
// 			const target = "currentArmor";
// 			// const base = "_baseArmor";
// 			// Increases the ship's armor by 150/300/400/500 points, depending on hull size.
// 			const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(
// 				state.currentShipBuild.shipSize,
// 				500,
// 				400,
// 				300,
// 				150
// 			);

// 			state.currentShipBuild[target] += value;
// 			return [target];
// 		},
// 		highMaintenance() {
// 			console.log("highMaintenance");
// 			console.log("DOES NOTHING");
// 			console.log("Build In??");
// 		},
// 		highResolutionSensors() {
// 			console.log("highResolutionSensors");
// 			console.log("DOES NOTHING");
// 		},
// 		highScatterAmplifier() {
// 			console.log("highScatterAmplifier");
// 			console.log("DOES NOTHING");
// 		},
// 		insulatedEngineAssembly() {
// 			console.log("insulatedEngineAssembly");
// 			// the ship's hull integrity by 10%. The ship's sensor profile is also reduced by 50%.
// 			const target = "currentHitPoints";
// 			const base = "_baseHitPoints";
// 			const percentValue = 0.1;

// 			state.currentShipBuild[target] +=
// 				state.currentShipBuild[base] * percentValue;
// 			return [target];
// 		},
// 		integratedPointDefenseAI() {
// 			console.log("highScatterAmplifier");
// 			console.log("DOES NOTHING");
// 		},
// 		integratedTargetingUnit() {
// 			console.log("highScatterAmplifier");
// 			console.log("DOES NOTHING");
// 		},
// 		makeshiftShieldGenerator() {
// 			console.log("makeshiftShieldGenerator");

// 			const assignShieldData = () => {
// 				const shieldArcTarget = "currentShieldArc";
// 				const shieldTypeTarget = "currentShieldType";
// 				const shipTypeTarget = "currentShipType";
// 				const shipShieldEfficiency = "currentShieldEfficiency";
// 				const shipCurrentShieldUpkeep = "currentShieldUpkeep";

// 				// The shield emitter is locked in a forward-facing position and has a 90 degree arc.

// 				state.currentShipBuild[shieldArcTarget] = 90;
// 				state.currentShipBuild[shieldTypeTarget] = "FRONT"; //
// 				state.currentShipBuild[shipTypeTarget] = "shieldShip";
// 				state.currentShipBuild[shipShieldEfficiency] = 1.2;
// 				state.currentShipBuild[shipCurrentShieldUpkeep] = 0.5; // upkeep is half your flux.

// 				return [
// 					shieldArcTarget,
// 					shieldTypeTarget,
// 					shipTypeTarget,
// 					shipShieldEfficiency,
// 					shipCurrentShieldUpkeep,
// 				];
// 			};
// 			//  The shield generator draws much of its power from engines and reduces the ship's top speed by 20%.
// 			const decreaseCurrentSpeed = () => {
// 				const base = "_baseSpeed";
// 				const target = "currentSpeed";
// 				const percentValue = 0.2;

// 				state.currentShipBuild[target] -=
// 					state.currentShipBuild[base] * percentValue;

// 				return target;
// 			};

// 			return [...assignShieldData(), decreaseCurrentSpeed()];
// 		},
// 		militarizedSubsystems() {
// 			//TODO here is a bug
// 			// it does change to mil, but to see change user must click a button, to reset all effects.
// 			// I don`t now if it is a serious issue, as it is only influences civ grade logi information, which can be reset in a different way.
// 			console.log("militarizedSubsystems");
// 			// Removes the penalties from a civilian-grade hull, and increases maximum burn level by 1.
// 			const increaseBurnRate = () => {
// 				const target = "currentShipBurn";

// 				const value = 1;
// 				state.currentShipBuild[target] += value;
// 				return target;
// 			};
// 			// Increases minimum crew required by 100%.
// 			const increaseMinCrewRequirment = () => {
// 				const target = "currentMinCrew";
// 				const base = "_baseMinCrew";
// 				// const percentValue = 2; // 100%

// 				state.currentShipBuild[target] += state.currentShipBuild[base]; // same as doubling
// 				return target;
// 			};
// 			const changeCurrentShipToMil = () => {
// 				const target = "currentShipIsCivilian";
// 				const base = "_baseShipIsCivilian";

// 				state.currentShipBuild[target] = "military";
// 				return target;
// 			};
// 			return [
// 				increaseBurnRate(),
// 				increaseMinCrewRequirment(),
// 				changeCurrentShipToMil(),
// 			];
// 		},
// 		missileAutoforge() {
// 			console.log("missileAutoforge");
// 			console.log("DOES NOTHING");
// 			console.log("Removed from GAME??");
// 		},
// 		missileAutoloader() {
// 			console.log("missileAutoloader");
// 			console.log("DOES NOTHING");
// 		},
// 		navRelay() {
// 			console.log("navRelay");
// 			console.log("DOES NOTHING");
// 		},
// 		neuralIntegrator() {
// 			console.log("neuralIntegrator");
// 			console.log("DOES NOTHING");
// 		},

// 		neuralInterface() {
// 			console.log("neuralInterface");
// 			console.log("DOES NOTHING");
// 		},
// 		operationsCenter() {
// 			console.log("operationsCenter");
// 			console.log("DOES NOTHING");
// 		},
// 		phaseAnchor() {
// 			console.log("phaseAnchor");
// 			console.log("DOES NOTHING");
// 		},
// 		phaseField() {
// 			console.log("phaseField");
// 			console.log("DOES NOTHING");
// 			console.log("Build IN?");
// 		},
// 		recoveryShuttles() {
// 			console.log("recoveryShuttles");
// 			console.log("DOES NOTHING");
// 		},
// 		reinforcedBulkheads() {
// 			console.log("reinforcedBulkheads");
// 			// Increases the ship's hull integrity by 40%.
// 			const target = "currentHitPoints";
// 			const base = "_baseHitPoints";
// 			const percentValue = 0.4;

// 			state.currentShipBuild[target] +=
// 				state.currentShipBuild[base] * percentValue;
// 			return [target];
// 		},
// 		resistantFluxConduits() {
// 			console.log("resistantFluxConduits");
// 			console.log("DOES NOTHING");
// 		},
// 		safetyOverrides() {
// 			console.log("safetyOverrides");

// 			// Disabling safety protocols increases the ship's top speed in combat by null/50/30/20
// 			const increaseSpeed = () => {
// 				const target = "currentSpeed";
// 				const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(
// 					state.currentShipBuild.shipSize,
// 					null,
// 					20,
// 					30,
// 					50
// 				);
// 				state.currentShipBuild[target] += value;
// 				return target;
// 			};
// 			// (depending on ship size, with a corresponding increase in acceleration) and allows the
// 			// The flux dissipation rate, including that of additional vents, is increased by a factor of 2.

// 			const increaseAcceleration = () => {
// 				const target = "currentAcceleration";
// 				const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(
// 					state.currentShipBuild.shipSize,
// 					null,
// 					20,
// 					30,
// 					50
// 				);
// 				state.currentShipBuild[target] += value;
// 				return target;
// 			};
// 			// + 100% base dissipation
// 			const doubleBaseDissipation = () => {
// 				const target = "currentFluxDissipation";
// 				const base = "_baseFluxDissipation";
// 				const { activeVents } = state.currentShipBuild;
// 				const ventsValue = activeVents > 0 ? activeVents : 1;
// 				state.currentShipBuild[target] =
// 					state.currentShipBuild[base] * 2 + ventsValue * 20;
// 				return target;
// 			};
// 			// active vents dissipation from 10 to 20 per vetn
// 			const doubleActiveVentDissipation = () => {
// 				const target = "currentFluxDissipationPerSingleActiveVent";
// 				const base = "_baseFluxDissipationPerSingleActiveVent";
// 				state.currentShipBuild[target] = state.currentShipBuild[base] * 2;
// 				return target;
// 			};
// 			// Reduces the peak performance time by a factor of 3
// 			// peak performance from 240 to 79

// 			const reducePeakPerformance = () => {
// 				const target = "currentPeakPerformanceSec";
// 				const base = "_basePeakPerformanceSec";
// 				const percentValue = 3;
// 				state.currentShipBuild[target] -=
// 					(state.currentShipBuild[base] / percentValue) * 2;
// 				return target;
// 			};
// 			return [
// 				increaseSpeed(),
// 				increaseAcceleration(),
// 				doubleBaseDissipation(),
// 				doubleActiveVentDissipation(),
// 				reducePeakPerformance(),
// 			];
// 			// Can not be installed on civilian or capital ships.
// 		},
// 		salvageGantry() {
// 			console.log("salvageGantry");
// 			console.log("DOES NOTHING");
// 			console.log("Build In");
// 		},
// 		shieldConversionFront() {
// 			console.log("shieldConversionFront");
// 			// Locks the ship's omni-directional shield emitter to a
// 			const changeFrontToOmni = () => {
// 				const target = "currentShieldType";
// 				state.currentShipBuild[target] = "FRONT"; //
// 				return target;
// 			};
// 			//  front-facing position and extends its arc by 100%.
// 			const increaseArc = () => {
// 				const target = "currentShieldArc";
// 				const base = "_baseShieldArc";
// 				const fullCircle = 360;

// 				state.currentShipBuild[target] += state.currentShipBuild[base];
// 				if (state.currentShipBuild[target] >= fullCircle)
// 					state.currentShipBuild[target] = fullCircle;
// 				return target;
// 			};
// 			return [changeFrontToOmni(), increaseArc()];
// 		},
// 		shieldConversionOmni() {
// 			console.log("shieldConversionOmni");
// 			// Converts frontal shields to omni-directional.
// 			const changeShieldToOmni = () => {
// 				const target = "currentShieldType";
// 				state.currentShipBuild[target] = "OMNI"; //
// 				return target;
// 			};
// 			// Reduces the shield's arc by 30%.
// 			const decreaseArc = () => {
// 				const target = "currentShieldArc";
// 				const base = "_baseShieldArc";
// 				const percentValue = 0.3;
// 				state.currentShipBuild[target] -=
// 					state.currentShipBuild[base] * percentValue;
// 				return target;
// 			};
// 			return [changeShieldToOmni(), decreaseArc()];
// 		},
// 		shieldedCargoHolds() {
// 			console.log("shieldedCargoHolds");
// 			console.log("does nothing");
// 			//This is built into the Hound, Cerberus, pirate variant Buffalo and pirate variant Mule
// 		},
// 		shieldShunt() {
// 			console.log("shieldShunt");
// 			// Removes the ship's shields.
// 			//increasing the ship's armor by 15%.
// 			const increaseArmor = () => {
// 				const target = "currentArmor";
// 				const base = "_baseArmor";
// 				const value = 0.15;

// 				state.currentShipBuild[target] += state.currentShipBuild[base] * value;
// 				//
// 			};
// 			const removeShield = () => {
// 				const shieldArcTarget = "currentShieldArc";
// 				const shieldTypeTarget = "currentShieldType";
// 				const shipTypeTarget = "currentShipType";
// 				const shipShieldEfficiency = "currentShieldEfficiency";
// 				const shipCurrentShieldUpkeep = "currentShieldUpkeep";

// 				state.currentShipBuild[shieldArcTarget] = "---";
// 				state.currentShipBuild[shieldTypeTarget] = "NONE"; //
// 				state.currentShipBuild[shipTypeTarget] = "noShieldShip";
// 				state.currentShipBuild[shipShieldEfficiency] = "---";
// 				state.currentShipBuild[shipCurrentShieldUpkeep] = "---"; // upkeep is half your flux.

// 				return [
// 					shieldArcTarget,
// 					shieldTypeTarget,
// 					shipTypeTarget,
// 					shipShieldEfficiency,
// 					shipCurrentShieldUpkeep,
// 				];
// 			};
// 			console.log(state.currentShipBuild);

// 			return [...removeShield(), increaseArmor()];
// 		},
// 		solarShielding() {
// 			console.log("solarShielding");
// 			console.log("does nothing");
// 		},
// 		stabilizedShields() {
// 			console.log("stabilizedShields");
// 			const target = "currentShieldUpkeep";
// 			const base = "_baseShieldUpkeep";
// 			// Reduces the amount of soft flux raised shields generate per second by 50%.
// 			const percentValue = 0.5;
// 			state.currentShipBuild[target] -=
// 				state.currentShipBuild[base] * percentValue;

// 			return [target];
// 		},
// 		surveyingEquipment() {
// 			console.log("surveyingEquipment");
// 			console.log("does nothing");
// 		},
// 		unstableInjector() {
// 			console.log("unstableInjector");
// 			const target = "currentSpeed";
// 			// Increases the ship's top speed in combat by 25/20/15/15 su/second, depending on hull size.
// 			const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(
// 				state.currentShipBuild.shipSize,
// 				15,
// 				15,
// 				20,
// 				25
// 			);

// 			state.currentShipBuild[target] += value;
// 			return [target];
// 		},
// 	},
