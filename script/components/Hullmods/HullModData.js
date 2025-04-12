import {
	SHIELD_TYPE,
	HULL_SIZE,
	SHIP_TYPE,
	WEAPON_SLOT,
} from "../../helper/Properties";

import HullModHelper from "./HullModHelper";
import { VALUE_CHANGE, GENERIC_STRING } from "../../helper/MagicStrings";

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

			// [IGNORE]
			// [Extends Weapon Range]
			// Extends the range of ballistic and energy weapons by 100%. The range of point-defense weapons is only extended by 60%.
			// Precludes the installation of a Dedicated Targeting Core or an Integrated Targeting Unit.
		},

		// Civilian-grade Hull
		civgrade: {
			id: "civgrade",
			name: "Civilian-grade Hull",
			_whyNot:
				"This hullmod denotes that the ship isn't designed for combat, such as an Atlas-class superfreighter. If Militarized Subsystems are installed, the sensor penalties will be removed.",

			// Increases sensor profile by 100%. Reduces sensor strength by 50%.
			hullModLogic: function (userShipBuild, hullMod) {
				const { sensorProfile, sensorStrength } = userShipBuild;

				// Extract Values
				const [increaseSensorProfilePercent, decreaseSensorStengthPercent] =
					hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					sensorProfile: HullModHelper.increaseValue(
						sensorProfile,
						increaseSensorProfilePercent
					),
					sensorStrength: HullModHelper.decreaseValue(
						sensorStrength,
						decreaseSensorStengthPercent
					),
				};
			},
		},

		// Distributed Fire Control
		distributed_fire_control: {
			id: "distributed_fire_control",
			name: "Distributed Fire Control",
			_whyNot:
				"Distributed Fire Control is incompatible with Dedicated Targeting Core and Integrated Targeting Unit, but not the Ballistic Rangefinder.",

			// [IGNORE]
			//Much of the damage that takes weapons offline is to external control runs and power conduits.
			// This ship's weapons are engineered to operate more independently,
			// reducing their exposure to damage by 50% and reducing the EMP damage taken by the ship overall by 50%.
		},

		// Flux Shunt
		fluxshunt: {
			id: "fluxshunt",
			name: "Flux Shunt",
			_whyNot: "Flux Shunt is incompatible with Safety Overrides.",

			// [IGNORE]
			// Allows the ship to dissipate hard flux at 50% of the normal rate while shields are on.
		},

		// Ablative Armor
		ablative_armor: {
			id: "ablative_armor",
			name: "Ablative Armor",
			_whyNot: "Built-in hullmod only available on the Invictus.",

			// [IGNORE]
			// An ancient design intended to stop micro-meteorites through sheer volume of material in place, before the advent of "spaced" armor.
			// Reduces the effective armor strength for the damage reduction calculation to 10% of its actual value.
			// However, ships of this design tend to carry extremely heavy armor.
		},

		//! I have no idea how to implement
		// Heavy Ballistics Integration
		hbi: {
			id: "hbi",
			name: "Heavy Ballistics Integration",
			_whyNot:
				"Built-in only hullmod. Available on the following hulls: Conquest. Onslaught, Invictus. The Ordnance Expertise skill will calculate its bonus after the OP reduction.",

			// Reduces the ordnance point cost of large ballistic weapons by 10.
		},

		//! Later
		// Vast Hangar
		vast_hangar: {
			id: "vast_hangar",
			name: "Vast Hangar",
			_whyNot:
				"The Vast Hangar is a built-in only hullmod. Can be found on the following ships: Invictus.",

			// [IMPLEMENT IN Converted Hangar]
			// The number of fighter bays added by Converted Hangar is increased by 1, and its performance matches that of a dedicated fighter bay -
			// all the penalties and modifiers including those to the ships deployment cost, are negated.
		},

		// Delicate Machinery
		delicate: {
			id: "delicate",
			name: "Delicate Machinery",
			_whyNot: "The Delicate Machinery is a built-in only hullmod.",

			// [IGNORE]
			// The ship systems require excessive maintenance and do not stand up well under the rigours of prolonged engagements.
			// Increases the rate of in-combat CR decay after peak performance time runs out by 50%.
		},

		// Phase Field
		phasefield: {
			id: "phasefield",
			name: "Phase Field",
			_whyNot: "The Phase Field is a built-in only hullmod.",

			// The ship is able to run a low-grade phase field for extended periods of time, reducing its effective sensor profile by 50%.
			// [IGNORE BELOW]
			// In addition, the fleet's detected-at-range is reduced by a multiplier based on the total sensor profile of the 5 highest-profile ships in the fleet, and the total sensor strength of the 5 phase ships with the highest sensor strength values. This effect only applies when the fleet's transponder is turned off.
			// Fleetwide sensor strength increases - such as from High Resolution Sensors - do not factor into this calculation.

			hullModLogic: function (userShipBuild, hullMod) {
				const { sensorProfile } = userShipBuild;

				// Extract Values
				const [reduceSensorProfilePercent] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					sensorProfile: HullModHelper.decreaseValue(
						sensorProfile,
						reduceSensorProfilePercent
					),
				};
			},
		},
		// Advanced Ground Support
		advanced_ground_support: {
			id: "advanced_ground_support",
			name: "Advanced Ground Support",
			_whyNot:
				"This hullmod is a superior version of the the Ground Support Package hullmod: it is effectively twice as effective as the Ground Support Package.",

			// [IGNORE]
			// Close support weapons and counter-measures for ground defenses.
			// Increases the effective strength of planetary raids by 200, up to the total number of marines in the fleet.
		},
		// B-Deck
		bdeck: {
			id: "bdeck",
			name: "B-Deck",
			_whyNot: "Built-in hullmod only available on the Drover.",

			// [IGNORE]
			// Once per combat, when the fighter replacement rate reaches 40%, the fighter launch bays are switched to operate from a "B-deck".
			// Standby fighters are launched to rapidly bring wings back to full strength, and the fighter replacement rate is set to 100%.
		},

		// Drive Field Stabilizer
		drive_field_stabilizer: {
			id: "drive_field_stabilizer",
			name: "Drive Field Stabilizer",
			_whyNot: "Built-in hullmod only available on the Ox.",

			// Stabilizes the fleet's drive bubble, increasing the maximum burn of the fleet by 1. The effect of multiple stabilizers is cumulative.
			// Increases the ship's sensor profile by 200.
		},

		// High Maintenance
		high_maintenance: {
			id: "high_maintenance",
			name: "High Maintenance",
			_whyNot: "This is built into the Hyperion and the Ox.",

			// Increases the monthly maintenance supply cost by 100%.
			hullModLogic: function (userShipBuild, hullMod) {
				const { suppliesPerMonth } = userShipBuild;

				// Extract Values
				const [increaseMaintenanceCostPercent] =
					hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					suppliesPerMonth: HullModHelper.increaseValue(
						suppliesPerMonth,
						increaseMaintenanceCostPercent
					),
				};
			},
		},

		// Energy Bolt Coherer
		coherer: {
			id: "coherer",
			name: "Energy Bolt Coherer",
			_whyNot:
				"A special Built-in only hullmod that uniquely changes depending on whether or not the ship has a crew complement. +200 non-beam energy weapon range for [REDACTED] ships. +100 non-beam energy weapon range and +50% crew casualties in combat for any crewed ship.",

			// [IGNORE]
			// Originally designed by the Tri-Tachyon Corporation for use on its combat droneships, the coherence field strength has to be dialed down to allow operation on crewed vessels.
			// Increases the range of all non-beam Energy and Hybrid weapons by 100/200.
			// The coherence field is unstable under combat conditions, with stresses on the hull resulting in spot failures that releases bursts of lethal radiation. Crew casualties in combat are increased by 50%.
		},

		//! add filter
		// Automated Ship
		automated: {
			id: "automated",
			name: "Automated Ship",
			_whyNot:
				"Automated Ship is a built-in hullmod that only appears on droneships, such as those from the Domain Exploration Derelict.",

			// This ship is fully automated, and does not require - and can not take on - any human crew.
			// Automated ships usually required specialized equipment and expertise to maintain,
			// resulting in a maximum combat readiness penalty of 100%. This penalty can be offset by a
			// fleet commander skilled in the use of automated ships.
		},

		// Experimental Phase Coils
		ex_phase_coils: {
			id: "ex_phase_coils",
			name: "Experimental Phase Coils",
			_whyNot:
				"Automated Ship is a built-in hullmod that only appears Ziggurat.",

			// [IGNORE]
			// Reduces phase cloak cooldown by 80%.
		},

		// Ground Support Package
		ground_support: {
			id: "ground_support",
			name: "Ground Support Package",
			_whyNot: "Built-in only hullmod. Available on: Valkyrie, Colossus Mk.III",

			// Close support weapons and counter-measures for ground defenses.
			// Increases the effective strength of planetary raids by 100, up to the total number of marines in the fleet.
		},

		// Rugged Construction
		rugged: {
			id: "rugged",
			name: "Rugged Construction",
			_whyNot: "Rugged Construction is a built-in hullmod.",

			// [IGNORE]
			// Reduces most negative effects of d-mods by 50%. If disabled or destroyed in combat, the ship has a 50% chance to avoid new d-mods, and is almost always recoverable after the battle.
			// In addition, the supply cost to recover from deployment - and to effect repairs if the ship is disabled - is reduced by 50%.
		},

		// Shielded Cargo Holds
		shielded_holds: {
			id: "shielded_holds",
			name: "Shielded Cargo Holds",
			_whyNot: "Shielded Cargo Holds is a built-in hullmod.",

			// Commonly found on ships that can't always rely on shields to protect their cargo from cosmic radiation.
			// Only a few tweaks are needed to have the shielding confound long-range cargo scans, reducing the probability of contraband being detected.
		},

		// Salvage Gantry
		repair_gantry: {
			id: "repair_gantry",
			name: "Salvage Gantry",
			_whyNot: "Salvage Gantry is a built-in hullmod.",

			// [IGNORE]
			// Increases the resources gained from salvaging abandoned stations, derelicts,
			// floating hulks, and other such by 10%/25%/30%/40%, depending on hull size.
			// Only affects the recovery of common resources such as fuel and supplies, and not rare items like blueprints.
			// In addition, 20% of the bonus applies to post-battle salvage.
			// Each additional ship with a salvage gantry provides diminishing returns.
			// The higher the highest recovery bonus from a single ship in the fleet, the later the diminishing returns kick in.
		},

		//! implement later
		// Legion (XIV)
		// Fourteenth Battlegroup
		test: {
			id: "test",
			name: "Salvage Gantry",
			_whyNot: "Salvage Gantry is a built-in hullmod.",

			// which allow the mounting of heavier armor plating by a flat increase of 100 standard units, with
			// only a 8% reduction in speed and maneuverability. Exceptionally well-tuned energy systems increase
			// flux throughput and capacity by 5% over standard examples of this hull.
		},
		//!
		// Converted Cargo Bay
		// Colossus Mk.III
		test: {
			id: "test",
			name: "Converted Cargo Bay",
			_whyNot: "Built-in hullmod only available on the Colossus Mk.III.",

			// [IGNORE]
			// This ship's cargo hold has been converted to house a pair of fighter bays.
			// The improvised manufactory that produces fighter chassis is unreliable, and most components have minor defects.
			// Fighter speed reduced by 25%, and damage taken increased by 25%.
		},
		// Special Modifications
		test: {
			id: "test",
			name: "Converted Cargo Bay",
			_whyNot:
				"Built-in only hullmod, unique to Lion's Guard ships. This hullmod is considered as a D-mod and can be removed by restoring the vessel. ",

			// Crew casualties in combat are increased by 10%. The base flux dissipation rate is reduced by 5%, and the repair rate for disabled weapons and engines is reduced by 25%.
		},
		//! 0.98a
		// Design Compromises
		test: {
			id: "test",
			name: "Converted Cargo Bay",
			_whyNot: "Built-in hullmod only available on the Anubis.",

			// The ship's performance suffers from competing design priorities, with multiple bleeding-edge projects integrated too late in the design cycle.
			// The ship's flux dissipation and capacity, even the nominal base values, are reduced by 40%
			// The range of ballistic weapons is reduced by 15%, the rate of fire of missile weapons is reduced by 50%, and the flux generation of energy weapons is increased by 100%.
			// On the plus side, extra nanoforge capacity can be brought online more easily, alloving the installation of a Converted Hangar despite the ship already having a fighter bay, increasing the number of operational fighter bays to 2.
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
		// Advanced Turret Gyros
		turretgyros: {
			id: "turretgyros",
			name: "Armored Weapon Mounts",
			_whyNot: "hullmod that can be installed on any ship.",
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
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
						type === WEAPON_SLOT.TYPE.BALLISTIC ||
						type === WEAPON_SLOT.TYPE.HYBRID
				);

				if (!noBallisticOrHybridSlots)
					return [hullMod, reason.noCorrectWeaponSlotsReason];

				return null;
			},
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;
				const { builtInMods } = userShipBuild.hullMods;

				const { id: currentId } = HULLMODS.WEAPONS.advancedoptics;

				// Advanced Optics BuildIn
				const hasAdvancedOpticsBuildIn = builtInMods.some(
					({ id }) => id === currentId
				);

				return {
					...userShipBuild,
					ordinancePoints: hasAdvancedOpticsBuildIn
						? ordinancePoints
						: HullModHelper.updateOrdinancePoints(
								ordinancePoints,
								hullMod,
								hullSize
						  ),
				};
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
		},

		// ECCM Package
		eccm: {
			id: "eccm",
			name: "ECCM Package",
			reason: {
				isAlreadyBuildInReason: "Already Build-In",
			},
			// [IGNORE ALL]
			// Reduces the chance for missiles launched by the ship to be affected by electronic counter-measures and flares by 50%.
			// A CPU core adjunct in each missile increases missile top speed by 25% and missile maneuverability by 50%, as well
			// as significantly improving the guidance algorithm.
			// Also reduces the weapon range reduction due to superior enemy Electronic Warfare by 50%.
			filterReason: function (hullMod, userShipBuild) {
				const { builtInMods } = userShipBuild.hullMods;
				const { id: currentId, reason } = HULLMODS.WEAPONS.eccm;

				// Incompatible with Advanced Optics
				const isAlreadyBuildIn = builtInMods.some(({ id }) => id === currentId);

				if (isAlreadyBuildIn) return [hullMod, reason.isAlreadyBuildInReason];

				return null;
			},
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;
				const { id: currentId } = HULLMODS.WEAPONS.eccm;
				const { builtInMods } = userShipBuild.hullMods;

				const isAlreadyBuildIn = builtInMods.some(({ id }) => id === currentId);

				return {
					...userShipBuild,
					ordinancePoints: isAlreadyBuildIn
						? ordinancePoints
						: HullModHelper.updateOrdinancePoints(
								ordinancePoints,
								hullMod,
								hullSize
						  ),
				};
			},
			// S-mod bonus: Fully negates the effect of ECM and flares on missiles fired by this ship.
		},
		// ECM Package
		ecm: {
			id: "ecm",
			name: "ECM Package",
			reason: {
				isAlreadyBuildInReason: "Already Build-In",
			},
			filterReason: function (hullMod, userShipBuild) {
				const { builtInMods } = userShipBuild.hullMods;
				const { id: currentId, reason } = HULLMODS.WEAPONS.ecm;

				// Incompatible with Advanced Optics
				const isAlreadyBuildIn = builtInMods.some(({ id }) => id === currentId);

				if (isAlreadyBuildIn) return [hullMod, reason.isAlreadyBuildInReason];

				return null;
			},
			// [IGNORE ALL]
			// When deployed in combat, grants 1%/2%/3%/4% ECM rating, depending on this ship's hull size.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;
				const { id: currentId } = HULLMODS.WEAPONS.ecm;
				const { builtInMods } = userShipBuild.hullMods;

				const isAlreadyBuildIn = builtInMods.some(({ id }) => id === currentId);

				return {
					...userShipBuild,
					ordinancePoints: isAlreadyBuildIn
						? ordinancePoints
						: HullModHelper.updateOrdinancePoints(
								ordinancePoints,
								hullMod,
								hullSize
						  ),
				};
			},
		},

		// Expanded Magazines
		magazines: {
			id: "magazines",
			name: "Expanded Magazines",

			// [IGNORE ALL]
			// Increases the ammo capacity or the number of charges for ballistic and energy weapons by 50%.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
			// S-mod bonus: Increases the ammo/charge regeneration rate for ballistic and energy weapons by 50%.
		},
		// Expanded Missile Racks
		missleracks: {
			id: "missleracks",
			name: "Expanded Missile Racks",

			// [IGNORE ALL]
			// Increases the ammo capacity of missile weapons by 100%.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
			// S-mod penalty: Reduces rate of fire of missiles by 20%.
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
		// Automated Repair Unit
		autorepair: {
			id: "autorepair",
			name: "Reinforced Bulkheads",
			_whyNot: "hullmod that can be installed on any ship.",

			// [IGNORE] Reduces the time required to repair disabled weapons and engines (in combat) by 50%.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
			// [IGNORE] S-mod bonus: Reduces repair time to 25%, and reduces overload duration by 33%.
		},
		// Integrated Point Defense AI
		pointdefenseai: {
			id: "pointdefenseai",
			name: "Integrated Point Defense AI",
			_whyNot: "hullmod that can be installed on any ship.",
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			// Increases the minimum crew by 20 to account for pilots and fighter crews.
			// [IGNORE]
			// Increases fighter refit time by 1.5x, and the fighter replacement rate both decays and recovers 1.5x more slowly.
			// In addition, bombers returning to rearm (or fighters returning to repair) take 40% of their base time to relaunch,
			// where it normally takes under a second
			// Increases the ship's deployment points and supply cost to recover from deployment by 1
			// for every 5 ordnance points spent on fighters, or by at least 1 point. This comes with a
			// proportional increase in combat readiness lost per deployment.

			hullModLogic: function (userShipBuild, hullMod) {
				const {
					ordinancePoints,
					hullSize,
					hullMods,
					minCrew,
					weaponSlots,
					installedWeapons,
				} = userShipBuild;
				const { builtInMods } = hullMods;

				const { id: currentId } = HULLMODS.BUILD_IN.vast_hangar;

				const isVastHangarInstalled = builtInMods.some(
					({ id }) => id === currentId
				);

				const [
					_increasesFighterRefitTimeBy,
					_lowerFighterReplacementBothDecayAndRecoverBy,
					_increaseCruiserSpeed,
					increaseMinCrewReqByFlatNumber,
				] = hullMod.effectValues.regularValues;

				// HORRENDOUS implementation but it works
				//? there is a bug, where installed weapons don't clear out.
				const slotsToCreate = isVastHangarInstalled ? 2 : 1;

				const createNewProps = Array.from(
					{
						length: slotsToCreate,
					},
					(_, i) => {
						const currentWeaponId = `IWS-${i + 100}`;
						return {
							newWeaponSlots: {
								id: currentWeaponId,
								mount: "HIDDEN",
								size: WEAPON_SLOT.SIZE.MEDIUM,
								type: WEAPON_SLOT.TYPE.LAUNCH_BAY,
							},
							newInstalledWeapons: [currentWeaponId, GENERIC_STRING.EMPTY],
						};
					}
				);

				const createNewInstalledWeapons = () => {
					// Filter IWS weapons directly
					const iwsWeapons = installedWeapons.filter(
						(weapon) => weapon[0] && weapon[0].includes("IWS")
					);

					// Return early if no IWS weapons
					if (iwsWeapons.length < 1) {
						return createNewProps.map((arr) => arr.newInstalledWeapons);
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

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),

					minCrew: isVastHangarInstalled
						? minCrew
						: minCrew + increaseMinCrewReqByFlatNumber,

					weaponSlots: [
						...[...new Set(weaponSlots)], // filter duplicates
						...createNewProps.map((arr) => arr.newWeaponSlots), // add new weaponSlots
					],

					installedWeapons: [
						...installedWeapons.filter(
							(weapon) => weapon[0] && !weapon[0].includes("IWS")
						),
						...createNewInstalledWeapons(),
					],
				};
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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

		// Neural Interface
		neural_interface: {
			id: "neural_interface",
			name: "Neural Interface",
			_whyNot: "hullmod that can be installed on any ship.",
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
		},

		// Resistant Flux Conduits
		fluxbreakers: {
			id: "fluxbreakers",
			name: "Neural Interface",
			_whyNot: "hullmod that can be installed on any ship.",
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
		},

		// Operations Center
		operations_center: {
			id: "operations_center",
			name: "Operations Center",
			_whyNot: "hullmod that can be installed on any ship.",

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
			},
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
				const { builtInMods } = userShipBuild.hullMods;
				const { id: currentId } = HULLMODS.LOGISTICS.hiressensors;

				// Extract Values
				const [frigateFlux, destroyerFlux, cruiserFlux, capitalFlux] =
					hullMod.effectValues.regularValues;

				// High Resolution Sensors Build-In
				const isAlreadyInstalled = builtInMods.some(
					({ id }) => id === currentId
				);

				return {
					...userShipBuild,
					ordinancePoints: isAlreadyInstalled
						? ordinancePoints
						: HullModHelper.updateOrdinancePoints(
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

		// Solar Shieldin
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

			// [IGNORE ALL]
			// Originally developed by Diktat engineers after spending cycles dealing with the unique
			// conditions of the inner Askonia system. Decreases the effect operating in a solar corona
			//  has on combat readiness by 75%; also has the same effect against storms in deep hyperspace.

			// In combat situations, reduces energy damage taken by 10%.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;
				const { builtInMods } = userShipBuild.hullMods;

				const { id: currentId } = HULLMODS.LOGISTICS.solar_shielding;

				// Already Installed
				const isAlreadyBuildIn = builtInMods.some(({ id }) => id === currentId);

				return {
					...userShipBuild,
					ordinancePoints: isAlreadyBuildIn
						? ordinancePoints
						: HullModHelper.updateOrdinancePoints(
								ordinancePoints,
								hullMod,
								hullSize
						  ),
				};
			},
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;
				const { builtInMods } = userShipBuild.hullMods;

				const { id: currentId } = HULLMODS.LOGISTICS.surveying_equipment;

				// Already Installed
				const isAlreadyBuildIn = builtInMods.some(({ id }) => id === currentId);

				return {
					...userShipBuild,
					ordinancePoints: isAlreadyBuildIn
						? ordinancePoints
						: HullModHelper.updateOrdinancePoints(
								ordinancePoints,
								hullMod,
								hullSize
						  ),
				};
			},
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

			// Increases the maximum burn level by 2.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, shipBurn } = userShipBuild;
				const { builtInMods } = userShipBuild.hullMods;
				const { id: currentId } = HULLMODS.LOGISTICS.augmentedengines;

				const isAlreadyBuildIn = builtInMods.some(({ id }) => id === currentId);

				// Extract Values
				const [increaseMaxBurn] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: isAlreadyBuildIn
						? ordinancePoints
						: HullModHelper.updateOrdinancePoints(
								ordinancePoints,
								hullMod,
								hullSize
						  ),
					shipBurn: HullModHelper.updateMaxShipBurn(shipBurn, increaseMaxBurn),
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

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			// Converts frontal shields to omni-directional. Reduces the shield's arc by 30%.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, shieldArc } = userShipBuild;

				// Extract Values
				const [lowerShieldArcBy] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					shieldArc: HullModHelper.decreaseValue(shieldArc, lowerShieldArcBy),
				};
			},
			// S-mod bonus: Negates the shield arc penalty.
		},
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

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
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

			// Reduces the amount of soft flux raised shields generate per second by 50%.
			// Does not affect the hard flux generated as a result of shields taking damage.
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, shieldUpkeep } = userShipBuild;

				// Extract Values
				const [reduceSoftFluxBy] = hullMod.effectValues.regularValues;
				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					shieldUpkeep: HullModHelper.decreaseValue(
						shieldUpkeep,
						reduceSoftFluxBy
					),
				};
			},
			// S-mod bonus: Converts 10% of the hard flux damage taken by shields to soft flux.
		},
		// Hardened Shields
		hardenedshieldemitter: {
			id: "hardenedshieldemitter",
			name: "Hardened Shields",
			_whyNot: "hullmod that can be installed on any ship that has shields",
			reason: { noShieldReason: "Must have a Shield" },

			filterReason: function (hullMod, userShipBuild) {
				const { shieldType } = userShipBuild;
				const reason = HULLMODS.SHIELD.hardenedshieldemitter.reason;

				const hasNoFrontShield = shieldType !== SHIELD_TYPE.FRONT;
				const hasNoOmniShield = shieldType !== SHIELD_TYPE.OMNI;

				if (hasNoOmniShield && hasNoFrontShield)
					return [hullMod, reason.noShieldReason];

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

				// is already installed
				const isGeneratorInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.SHIELD.frontshield.id
				);
				if (isGeneratorInstalled) return null;

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
			// Set shieldEfficiency and shieldUpkeep
			hullModLogic: function (userShipBuild, hullMod) {
				const {
					ordinancePoints,
					speed,
					hullSize,
					shieldEfficiency,
					shieldUpkeep,
				} = userShipBuild;
				const [newShieldArc, decreaseSpeedByPercent] =
					hullMod.effectValues.regularValues;

				// Checked with Hound
				const newShieldEfficiency = 1.2;
				const newShieldUpkeep = 0.25;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					shieldType: SHIELD_TYPE.FRONT,
					shieldArc: newShieldArc,
					// Decrease Speed
					speed: HullModHelper.convertStringPercentIntoNumber(
						decreaseSpeedByPercent,
						VALUE_CHANGE.DECREASE,
						speed
					),
					shieldEfficiency: newShieldEfficiency,
					shieldUpkeep: newShieldUpkeep,
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

				// Already has Shield Shunt
				const isShieldShuntInstalled = installedHullMods.some(
					({ id }) => id === HULLMODS.SHIELD.shield_shunt.id
				);
				if (isShieldShuntInstalled) return null;

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

				return {
					...userShipBuild,
					// Remove Shield
					shieldType: SHIELD_TYPE.NONE,
					// Increase Shield
					armor: HullModHelper.convertStringPercentIntoNumber(
						addArmorPercent,
						VALUE_CHANGE.INCREASE,
						armor
					),
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					// Clear Props
					shieldArc: 0,
					shieldUpkeep: 0,
					shieldEfficiency: 0,
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize } = userShipBuild;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
				};
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
			// Disabling safety protocols increases the ship's top speed in combat by 50/30/20
			// (depending on ship size, with a corresponding increase in acceleration) and allows the zero-flux engine boost to take effect
			// regardless of flux level. The flux dissipation rate, including that of additional vents, is increased by a factor of 2.
			// Reduces the peak performance time by a factor of 3, prevents the use of active venting,
			//// [IGNORE] and drastically reduces weapon ranges past 450 units.
			// Can not be installed on civilian or capital ships.
			hullModLogic: function (userShipBuild, hullMod) {
				const {
					ordinancePoints,
					hullSize,
					speed,
					fluxDissipation,
					fluxDissipationPerSingleActiveVent,
					peakPerformanceSec,
				} = userShipBuild;

				const [
					increaseFrigateSpeed,
					increaseDestoyerSpeed,
					increaseCruiserSpeed,
					fluxMulty,
					reducePeakPerformanceByMulty,
					_reduceWeaponRange,
				] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					// Increase Speed
					speed:
						speed +
						HullModHelper.hullModHullSizeConverter(
							hullSize,
							increaseFrigateSpeed,
							increaseDestoyerSpeed,
							increaseCruiserSpeed,
							0
						),
					// double flux dissipation
					fluxDissipation: fluxDissipation * fluxMulty,
					// double flux from perSingleFlux
					fluxDissipationPerSingleActiveVent:
						fluxDissipationPerSingleActiveVent * fluxMulty,
					// Lower peak perfomance by 3
					peakPerformanceSec: peakPerformanceSec / reducePeakPerformanceByMulty,
				};
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
		// Unstable Injector
		unstable_injector: {
			id: "unstable_injector",
			name: "Unstable Injector",
			_whyNot: "hullmod that can be installed on any ship.",

			// Increases the ship's top speed in combat by 25/20/15/15 su/second, depending on hull size.
			// [IGNORE] Interferes with weapons targeting and other vulnerable systems, reducing non-missile weapon range by 15% and
			// [IGNORE] increasing the fighter replacement time by 25%.

			hullModLogic: function (userShipBuild, hullMod) {
				const { ordinancePoints, hullSize, speed } = userShipBuild;

				// Extract Values
				const [
					newFrigateSpeed,
					newDestroyerSpeed,
					newCruiserSpeed,
					newCapitalSpeed,
					_reduceWeaponRange,
					_increaseFighterReplacement,
				] = hullMod.effectValues.regularValues;

				return {
					...userShipBuild,
					ordinancePoints: HullModHelper.updateOrdinancePoints(
						ordinancePoints,
						hullMod,
						hullSize
					),
					speed:
						speed +
						HullModHelper.hullModHullSizeConverter(
							hullSize,
							newFrigateSpeed,
							newDestroyerSpeed,
							newCruiserSpeed,
							newCapitalSpeed
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

	"Expanded Cargo Holds": [[30, 60, 100, 200, "30%", "50%"], []],
	"High Resolution Sensors": [
		[50, 75, 100, 150, "10%"],
		[1000, 1500, 2000, 2500],
	],
	"Efficiency Overhaul": [["20%", "50%"], ["10%"]],
	"Surveying Equipment": [[5, 10, 20, 40, 5], ["100%"]],
	"Salvage Gantry": [["10%", "25%", "30%", "40%", "20%"], []],
	// Build IN
	"Civilian-grade Hull": [["100%", "50%"], []],
	"Phase Field": [["50%", 5, 5], []],
	"High Maintenance": [["100%"], []],
};
