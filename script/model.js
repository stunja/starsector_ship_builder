"use strict";
import { renameKeysFromCSVdata } from "./helperFunction.js";
import * as URL from "./url.js";

// "astral"; "gryphon"; "drover"; "hound"; "ox"; "legion"; // pegasus // paragon // astral // legion // odyssey
const shipNameDev = "astral";
//
//invictus // astral // grendel // atlas // colussus // venture // falcon // legion // Conquest
// paragon // hound // gryphon // shepherd // Hammerhead //
// gryphon = cruiser
// condor = destroyer
// hound = frigate
export const state = {
	allShips: [],
	allWeapons: [],
	allShipHulls: [],
	allFighters: [],
	currentShip: [],
	currentShipBuild: [],
	gameRules: [],
};
export const uiState = {
	hullModsMenu: {
		menuState: "closed",
	},
	weaponPopUp: {
		previousSortState: "cost",
		isAscending: false,
		currentWeaponTypes: {},
	},
	fighterPopUp: {
		previousSortState: "cost",
		isAscending: false,
		allWeaponTypes: {
			ALL: "ALL",
			ENERGY: "ENERGY",
			KINETIC: "KINETIC",
			HIGH_EXPLOSIVE: "HIGH_EXPLOSIVE",
			FRAGMENTATION: "FRAGMENTATION",
		},
		currentWeaponTypes: {},
		isOpen: true,
	},
	currentWeaponSlot: "",
	// currentFighterSlot: "",
	currentWeaponHover: "",
};

const hullModsHolder = {
	hullModGenericBasedOnHullSizeCalc(shipSize, capitalValue, cruiserValue, destroyerValue, frigateValue) {
		return shipSize === "capital"
			? capitalValue
			: shipSize === "cruiser"
			? cruiserValue
			: shipSize === "destroyer"
			? destroyerValue
			: shipSize === "frigate"
			? frigateValue
			: console.warn(`${shipSize} is missing?`);
	},
	supplyIncreaseIfCivilianShip() {
		// if()
		if (state.currentShipBuild.currentShipIsCivilian === "military") return;
		const target = "currentSuppliesPerMonth";
		const base = "_baseSuppliesPerMonth";

		// const percentValue = 2; 100% old data shows 100%
		const percentValue = 0.5; // 50% in game for some reason
		//
		state.currentShipBuild[target] += state.currentShipBuild[base] * percentValue;
		return target;
	},
	cargoFuelCrewGenericCalc(target, base) {
		const { currentShipBuild } = state;
		const valueByShipSize = hullModsHolder.hullModGenericBasedOnHullSizeCalc(state.currentShipBuild.shipSize, 200, 100, 60, 30);

		const percentValue = 0.3; // 30% of base value
		const valueByPercentFromBase = currentShipBuild[base] * percentValue;

		const finalValue = valueByShipSize > valueByPercentFromBase ? valueByShipSize : valueByPercentFromBase;
		//
		state.currentShipBuild[target] += finalValue;
		//
		return target;
	},
	hullModEffectData: {
		// % number are calculated from ship base numbers.
		// base armor is 1000. increase armor by 10%, means base (1000) * 0.1 = 100. Than add the number to currentValueName
		// Stacking goes similiar, adding numbers from base values. 20% + 30% both are from base and just sum via addition.
		//
		//! each effectFunction must return array, empty or not. If empty, controller will ignore it.
		// dont put random garbage in return, return only currentValueName
		// this is to tell resetData function to target specific values
		acceleratedShields() {
			console.log("acceleratedShields");
			console.log("DOES NOTHING");
		},
		adaptivePhaseCoils() {
			console.log("adaptivePhaseCoils");
			console.log("DOES NOTHING");
		},

		additionalBerthing() {
			console.log("additionalBerthing");
			const target = "currentMaxCrew";
			const base = "_baseMaxCrew";

			return [hullModsHolder.cargoFuelCrewGenericCalc(target, base), hullModsHolder.supplyIncreaseIfCivilianShip()];
		},
		advancedOptics() {
			console.log("advancedOptics");
			console.log("DOES NOTHING");
			// Extends the range of beam weapons by 200, but reduces their turn rate by 30%. Cumulative with Integrated Targeting Unit.
		},
		advancedTurretGyros() {
			console.log("advancedTurretGyros");
			console.log("DOES NOTHING");
		},

		armoredWeaponMounts() {
			console.log("armoredWeaponMounts");
			const target = "currentArmor";
			const base = "_baseArmor";
			const percentValue = 0.1;

			state.currentShipBuild[target] += state.currentShipBuild[base] * percentValue;
			return [target];
		},

		augmentedDriveField() {
			console.log("augmentedDriveField");
			const { currentShipBuild } = state;
			const target = "currentShipBurn";
			const base = "_baseShipBurn";
			const value = 2;

			state.currentShipBuild[target] += currentShipBuild[base] + value;
			return [target];
		},
		automatedRepairUnit() {
			console.log("automatedRepairUnit");
			console.log("DOES NOTHING");
		},
		auxiliaryFuelTanks() {
			console.log("auxiliaryFuelTanks");
			const target = "currentFuelCap";
			const base = "_baseFuelCap";

			return [hullModsHolder.cargoFuelCrewGenericCalc(target, base), hullModsHolder.supplyIncreaseIfCivilianShip()];
		},
		auxiliaryThrusters() {
			console.log("auxiliaryThrusters");
			console.log("DOES NOTHING");
		},
		ballisticRangefinder() {
			console.log("ballisticRangefinder");
			console.log("DOES NOTHING");
		},
		bDeck() {
			console.log("bDeck");
			console.log("DOES NOTHING");
			console.log("Build In Mod");
		},
		blastDoors() {
			console.log("blastDoors");
			// Increases hull integrity by 20%.
			const target = "currentHitPoints";
			const base = "_baseHitPoints";
			const percentValue = 0.2;

			state.currentShipBuild[target] += state.currentShipBuild[base] * percentValue;
			return [target];
		},
		civilianGradeHull() {
			console.log("civilianGradeHull");
			console.log("DOES NOTHING");
			console.log("Build In Mod");
		},
		convertedFighterBay() {
			console.log("convertedFighterBay");
			const baseFighterBayProperty = "_baseFighterBays";

			const removeFighterBays = () => {
				const targetProperty = "currentFighterBays";
				const value = 0;
				state.currentShipBuild[targetProperty] = value;
				return targetProperty;
			};
			const increaseCargoSize = () => {
				const targetProperty = "currentCargoCap";
				const value = 50;
				state.currentShipBuild[targetProperty] += state.currentShipBuild[baseFighterBayProperty] * value;
				return targetProperty;
			};
			const decreaseMinCrewReq = () => {
				const targetProperty = "currentMinCrew";
				const baseProperty = "_baseMinCrew";
				const fighterBayLimit = state.currentShipBuild[baseFighterBayProperty] > 4 ? 4 : state.currentShipBuild[baseFighterBayProperty];

				const percentValue = 0.2;
				const calc = state.currentShipBuild[baseProperty] * (fighterBayLimit * percentValue);

				state.currentShipBuild[targetProperty] -= calc;
				//
				return targetProperty;
			};
			return [removeFighterBays(), increaseCargoSize(), decreaseMinCrewReq()];
		},
		convertedHangar() {
			// TODO I need to check the cost of all active fighter wings

			console.log("convertedHangar");
			console.log("DOES NOTHING");

			//  Increases the minimum crew by 20
			const increaseMinCrewReq = () => {
				const target = "currentMinCrew";
				const value = 20;

				state.currentShipBuild[target] += value;
				return target;
			};
			// Add Single Fighter Bay
			const addSingleFighterBay = () => {
				const target = "currentFighterBays";
				const value = 1;
				state.currentShipBuild[target] += value;

				return target;
			};
			//  Increases the ship's deployment points and supply cost to recover
			//  from deployment by 1 for every 5 ordnance points spent on fighters, or by at least 1 point.

			const increaseDeploymentCost = () => {};
			const increaseSupplyCost = () => {};

			return [increaseMinCrewReq(), addSingleFighterBay()];
		},
		dedicatedTargetingCore() {
			console.log("dedicatedTargetingCore");
			console.log("DOES NOTHING");
		},
		defensiveTargetingArray() {
			console.log("defensiveTargetingArray");
			console.log("DOES NOTHING");
		},
		eCCMPackage() {
			console.log("eCCMPackage");
			console.log("DOES NOTHING");
		},
		eCMPackage() {
			console.log("eCMPackage");
			console.log("DOES NOTHING");
		},
		efficiencyOverhaul() {
			console.log("efficiencyOverhaul");
			const supplies = ["currentSuppliesPerMonth", "_baseSuppliesPerMonth"];
			const crew = ["currentMinCrew", "_baseMinCrew"];
			const fuelCost = ["currentFuelPerLY", "_basyFuelPerLY"];
			const reduceMaintenanceFuelUseMinimumCrew = ([target, base]) => {
				// Reduces supply use for maintenance, fuel use, and minimum crew required by 20%.
				// 20%
				const value = 0.2;
				state.currentShipBuild[target] -= state.currentShipBuild[base] * value;
				return target;
			};
			const increaseReadinessRecovery = () => {
				// Increases the combat readiness recovery and repair rates by 50%.
				// recovery per day
				const target = "currentCrRecoveryPerDay";
				const base = "_baseCrRecoveryPerDay";
				const value = 0.5;
				state.currentShipBuild[target] += state.currentShipBuild[base] * value;
				return target;
			};

			// The per-day supply consumption for CR recovery is increased to account for the increased recovery rate,
			// but the total supply cost remains the same.
			return [
				reduceMaintenanceFuelUseMinimumCrew(supplies),
				reduceMaintenanceFuelUseMinimumCrew(crew),
				reduceMaintenanceFuelUseMinimumCrew(fuelCost),
				increaseReadinessRecovery(),
			];
		},
		energyBoltCoherer() {
			console.log("energyBoltCoherer");
			console.log("DOES NOTHING");
			console.log("Build In Mod");
		},
		escortPackage() {
			console.log("eCMPackage");
			console.log("DOES NOTHING");
		},
		expandedCargoHolds() {
			console.log("expandedCargoHolds");
			const target = "currentCargoCap";
			const base = "_baseCargoCap";
			return [hullModsHolder.cargoFuelCrewGenericCalc(target, base), hullModsHolder.supplyIncreaseIfCivilianShip()];
		},
		expandedDeckCrew() {
			console.log("expandedDeckCrew");
			const target = "currentMinCrew";
			// const base = "_baseMinCrew";
			const currentfighterBays = "currentFighterBays";
			if (state.currentShipBuild[currentfighterBays] < 1) return;
			//Increases the crew required by 20 per fighter bay.
			const value = 20;
			state.currentShipBuild[target] += state.currentShipBuild[currentfighterBays] * value;

			return [target];
		},
		expandedMagazines() {
			console.log("expandedMagazines");
			console.log("DOES NOTHING");
		},
		expandedMissileRacks() {
			console.log("expandedMissileRacks");
			console.log("DOES NOTHING");
		},
		extendedShields() {
			console.log("extendedShields");
			// const base = "_baseShieldArc";
			const target = "currentShieldArc";
			const value = 60;
			state.currentShipBuild[target] += value;
			return [target];
		},
		fighterChassisStorage() {
			console.log("fighterChassisStorage");
			console.log("DOES NOTHING");
			console.log("build In");
		},
		fluxCoilAdjunct() {
			console.log("fluxCoilAdjunct");
			const target = "currentFluxCapacity";
			const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(state.currentShipBuild.shipSize, 3000, 1800, 1200, 600);
			// Increases the ship's flux capacity by 600/1200/1800/3000, depending on hull size.
			state.currentShipBuild[target] += value;

			return [target];
		},
		fluxDistributor() {
			console.log("fluxDistributor");
			const target = "currentFluxDissipation";
			const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(state.currentShipBuild.shipSize, 150, 90, 60, 30);
			state.currentShipBuild[target] += value;

			return [target];
		},
		fluxShunt() {
			console.log("fluxShunt");
			console.log("DOES NOTHING");
			console.log("Build In??");
		},
		hardenedShields() {
			console.log("hardenedShields");
			const target = "currentShieldEfficiency";
			const base = "_baseShieldEfficiency";
			// Reduces the amount of damage taken by shields by 20%.
			const percentValue = 0.2;

			// if (state.currentShipBuild[base] > 0) {
			//   state.currentShipBuild[target] -=
			//     state.currentShipBuild[base] * percentValue;
			// } else {
			//   state.currentShipBuild[target] -=
			//     state.currentShipBuild[target] * percentValue;
			// }
			state.currentShipBuild[target] -= state.currentShipBuild[base] * percentValue;

			return [target];
		},
		hardenedSubsystems() {
			console.log("hardenedSubsystems");
			const target = "currentPeakPerformanceSec";
			const base = "_basePeakPerformanceSec";
			const percentValue = 0.5;

			state.currentShipBuild[target] += state.currentShipBuild[base] * percentValue;

			return [target];
		},
		heavyArmor() {
			console.log("heavyArmor");
			const target = "currentArmor";
			// const base = "_baseArmor";
			// Increases the ship's armor by 150/300/400/500 points, depending on hull size.
			const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(state.currentShipBuild.shipSize, 500, 400, 300, 150);

			state.currentShipBuild[target] += value;
			return [target];
		},
		highMaintenance() {
			console.log("highMaintenance");
			console.log("DOES NOTHING");
			console.log("Build In??");
		},
		highResolutionSensors() {
			console.log("highResolutionSensors");
			console.log("DOES NOTHING");
		},
		highScatterAmplifier() {
			console.log("highScatterAmplifier");
			console.log("DOES NOTHING");
		},
		insulatedEngineAssembly() {
			console.log("insulatedEngineAssembly");
			// the ship's hull integrity by 10%. The ship's sensor profile is also reduced by 50%.
			const target = "currentHitPoints";
			const base = "_baseHitPoints";
			const percentValue = 0.1;

			state.currentShipBuild[target] += state.currentShipBuild[base] * percentValue;
			return [target];
		},
		integratedPointDefenseAI() {
			console.log("highScatterAmplifier");
			console.log("DOES NOTHING");
		},
		integratedTargetingUnit() {
			console.log("highScatterAmplifier");
			console.log("DOES NOTHING");
		},
		makeshiftShieldGenerator() {
			console.log("makeshiftShieldGenerator");

			const assignShieldData = () => {
				const shieldArcTarget = "currentShieldArc";
				const shieldTypeTarget = "currentShieldType";
				const shipTypeTarget = "currentShipType";
				const shipShieldEfficiency = "currentShieldEfficiency";
				const shipCurrentShieldUpkeep = "currentShieldUpkeep";

				// The shield emitter is locked in a forward-facing position and has a 90 degree arc.

				state.currentShipBuild[shieldArcTarget] = 90;
				state.currentShipBuild[shieldTypeTarget] = "FRONT"; //
				state.currentShipBuild[shipTypeTarget] = "shieldShip";
				state.currentShipBuild[shipShieldEfficiency] = 1.2;
				state.currentShipBuild[shipCurrentShieldUpkeep] = 0.5; // upkeep is half your flux.

				return [shieldArcTarget, shieldTypeTarget, shipTypeTarget, shipShieldEfficiency, shipCurrentShieldUpkeep];
			};
			//  The shield generator draws much of its power from engines and reduces the ship's top speed by 20%.
			const decreaseCurrentSpeed = () => {
				const base = "_baseSpeed";
				const target = "currentSpeed";
				const percentValue = 0.2;

				state.currentShipBuild[target] -= state.currentShipBuild[base] * percentValue;

				return target;
			};

			return [...assignShieldData(), decreaseCurrentSpeed()];
		},
		militarizedSubsystems() {
			//TODO here is a bug
			// it does change to mil, but to see change user must click a button, to reset all effects.
			// I don`t now if it is a serious issue, as it is only influences civ grade logi information, which can be reset in a different way.
			console.log("militarizedSubsystems");
			// Removes the penalties from a civilian-grade hull, and increases maximum burn level by 1.
			const increaseBurnRate = () => {
				const target = "currentShipBurn";

				const value = 1;
				state.currentShipBuild[target] += value;
				return target;
			};
			// Increases minimum crew required by 100%.
			const increaseMinCrewRequirment = () => {
				const target = "currentMinCrew";
				const base = "_baseMinCrew";
				// const percentValue = 2; // 100%

				state.currentShipBuild[target] += state.currentShipBuild[base]; // same as doubling
				return target;
			};
			const changeCurrentShipToMil = () => {
				const target = "currentShipIsCivilian";
				const base = "_baseShipIsCivilian";

				state.currentShipBuild[target] = "military";
				return target;
			};
			return [increaseBurnRate(), increaseMinCrewRequirment(), changeCurrentShipToMil()];
		},
		missileAutoforge() {
			console.log("missileAutoforge");
			console.log("DOES NOTHING");
			console.log("Removed from GAME??");
		},
		missileAutoloader() {
			console.log("missileAutoloader");
			console.log("DOES NOTHING");
		},
		navRelay() {
			console.log("navRelay");
			console.log("DOES NOTHING");
		},
		neuralIntegrator() {
			console.log("neuralIntegrator");
			console.log("DOES NOTHING");
		},

		neuralInterface() {
			console.log("neuralInterface");
			console.log("DOES NOTHING");
		},
		operationsCenter() {
			console.log("operationsCenter");
			console.log("DOES NOTHING");
		},
		phaseAnchor() {
			console.log("phaseAnchor");
			console.log("DOES NOTHING");
		},
		phaseField() {
			console.log("phaseField");
			console.log("DOES NOTHING");
			console.log("Build IN?");
		},
		recoveryShuttles() {
			console.log("recoveryShuttles");
			console.log("DOES NOTHING");
		},
		reinforcedBulkheads() {
			console.log("reinforcedBulkheads");
			// Increases the ship's hull integrity by 40%.
			const target = "currentHitPoints";
			const base = "_baseHitPoints";
			const percentValue = 0.4;

			state.currentShipBuild[target] += state.currentShipBuild[base] * percentValue;
			return [target];
		},
		resistantFluxConduits() {
			console.log("resistantFluxConduits");
			console.log("DOES NOTHING");
		},
		safetyOverrides() {
			console.log("safetyOverrides");

			// Disabling safety protocols increases the ship's top speed in combat by null/50/30/20
			const increaseSpeed = () => {
				const target = "currentSpeed";
				const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(state.currentShipBuild.shipSize, null, 20, 30, 50);
				state.currentShipBuild[target] += value;
				return target;
			};
			// (depending on ship size, with a corresponding increase in acceleration) and allows the
			// The flux dissipation rate, including that of additional vents, is increased by a factor of 2.

			const increaseAcceleration = () => {
				const target = "currentAcceleration";
				const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(state.currentShipBuild.shipSize, null, 20, 30, 50);
				state.currentShipBuild[target] += value;
				return target;
			};
			// + 100% base dissipation
			const doubleBaseDissipation = () => {
				const target = "currentFluxDissipation";
				const base = "_baseFluxDissipation";
				const { activeVents } = state.currentShipBuild;
				const ventsValue = activeVents > 0 ? activeVents : 1;
				state.currentShipBuild[target] = state.currentShipBuild[base] * 2 + ventsValue * 20;
				return target;
			};
			// active vents dissipation from 10 to 20 per vetn
			const doubleActiveVentDissipation = () => {
				const target = "currentFluxDissipationPerSingleActiveVent";
				const base = "_baseFluxDissipationPerSingleActiveVent";
				state.currentShipBuild[target] = state.currentShipBuild[base] * 2;
				return target;
			};
			// Reduces the peak performance time by a factor of 3
			// peak performance from 240 to 79

			const reducePeakPerformance = () => {
				const target = "currentPeakPerformanceSec";
				const base = "_basePeakPerformanceSec";
				const percentValue = 3;
				state.currentShipBuild[target] -= (state.currentShipBuild[base] / percentValue) * 2;
				return target;
			};
			return [increaseSpeed(), increaseAcceleration(), doubleBaseDissipation(), doubleActiveVentDissipation(), reducePeakPerformance()];
			// Can not be installed on civilian or capital ships.
		},
		salvageGantry() {
			console.log("salvageGantry");
			console.log("DOES NOTHING");
			console.log("Build In");
		},
		shieldConversionFront() {
			console.log("shieldConversionFront");
			// Locks the ship's omni-directional shield emitter to a
			const changeFrontToOmni = () => {
				const target = "currentShieldType";
				state.currentShipBuild[target] = "FRONT"; //
				return target;
			};
			//  front-facing position and extends its arc by 100%.
			const increaseArc = () => {
				const target = "currentShieldArc";
				const base = "_baseShieldArc";
				const fullCircle = 360;

				state.currentShipBuild[target] += state.currentShipBuild[base];
				if (state.currentShipBuild[target] >= fullCircle) state.currentShipBuild[target] = fullCircle;
				return target;
			};
			return [changeFrontToOmni(), increaseArc()];
		},
		shieldConversionOmni() {
			console.log("shieldConversionOmni");
			// Converts frontal shields to omni-directional.
			const changeShieldToOmni = () => {
				const target = "currentShieldType";
				state.currentShipBuild[target] = "OMNI"; //
				return target;
			};
			// Reduces the shield's arc by 30%.
			const decreaseArc = () => {
				const target = "currentShieldArc";
				const base = "_baseShieldArc";
				const percentValue = 0.3;
				state.currentShipBuild[target] -= state.currentShipBuild[base] * percentValue;
				return target;
			};
			return [changeShieldToOmni(), decreaseArc()];
		},
		shieldedCargoHolds() {
			console.log("shieldedCargoHolds");
			console.log("does nothing");
			//This is built into the Hound, Cerberus, pirate variant Buffalo and pirate variant Mule
		},
		shieldShunt() {
			console.log("shieldShunt");
			// Removes the ship's shields.
			//increasing the ship's armor by 15%.
			const increaseArmor = () => {
				const target = "currentArmor";
				const base = "_baseArmor";
				const value = 0.15;

				state.currentShipBuild[target] += state.currentShipBuild[base] * value;
				//
			};
			const removeShield = () => {
				const shieldArcTarget = "currentShieldArc";
				const shieldTypeTarget = "currentShieldType";
				const shipTypeTarget = "currentShipType";
				const shipShieldEfficiency = "currentShieldEfficiency";
				const shipCurrentShieldUpkeep = "currentShieldUpkeep";

				state.currentShipBuild[shieldArcTarget] = "---";
				state.currentShipBuild[shieldTypeTarget] = "NONE"; //
				state.currentShipBuild[shipTypeTarget] = "noShieldShip";
				state.currentShipBuild[shipShieldEfficiency] = "---";
				state.currentShipBuild[shipCurrentShieldUpkeep] = "---"; // upkeep is half your flux.

				return [shieldArcTarget, shieldTypeTarget, shipTypeTarget, shipShieldEfficiency, shipCurrentShieldUpkeep];
			};
			console.log(state.currentShipBuild);

			return [...removeShield(), increaseArmor()];
		},
		solarShielding() {
			console.log("solarShielding");
			console.log("does nothing");
		},
		stabilizedShields() {
			console.log("stabilizedShields");
			const target = "currentShieldUpkeep";
			const base = "_baseShieldUpkeep";
			// Reduces the amount of soft flux raised shields generate per second by 50%.
			const percentValue = 0.5;
			state.currentShipBuild[target] -= state.currentShipBuild[base] * percentValue;

			return [target];
		},
		surveyingEquipment() {
			console.log("surveyingEquipment");
			console.log("does nothing");
		},
		unstableInjector() {
			console.log("unstableInjector");
			const target = "currentSpeed";
			// Increases the ship's top speed in combat by 25/20/15/15 su/second, depending on hull size.
			const value = hullModsHolder.hullModGenericBasedOnHullSizeCalc(state.currentShipBuild.shipSize, 15, 15, 20, 25);

			state.currentShipBuild[target] += value;
			return [target];
		},
	},
	hullModDataInjection: {
		controller() {
			// Ballistic Rangefinder /  Converted Hangar / Missile Autoloader / High Scatter Amplifier / High Resolution Sensors
			//! smod text injection is missing AT LEAST for  // Converted Hangar
			this.covertAndInjectMissingDescriptions();
			this.convertAndInjectDataIntoAllUsableHulls();
			this.updateUsableHullsDescriptionsWithInjectedData();
		},
		convertAndInjectDataIntoAllUsableHulls() {
			const convertedData = Object.entries(this.data);
			convertedData.forEach((e) => {
				const [name, numberArray] = e;
				this.injectDataIntoHullMod(state.usableHullMods, name, numberArray);
			});
		},
		injectDataIntoHullMod: (hullMods, hullModName, regularValue) =>
			hullMods.forEach((hullMod) => (hullMod.name === hullModName ? (hullMod.importedValues = regularValue) : "")),
		covertAndInjectMissingDescriptions() {
			this.textInjectionData.forEach((e) => {
				const [key] = Object.keys(e);
				const [value] = Object.values(e);
				this.injectTextIntoHullMod(state.usableHullMods, key, value);
			});
		},
		injectTextIntoHullMod: (hullMods, hullModNameToEdit, stringToParse) =>
			hullMods.forEach((hullMod) => (hullMod.name === hullModNameToEdit ? (hullMod.desc = stringToParse) : "")),
		updateUsableHullsDescriptionsWithInjectedData() {
			state.usableHullMods.forEach((hullMod) => {
				hullMod.importedValues === undefined ? console.log(hullMod) : "";
				if (hullMod.importedValues === undefined) return;
				const replacePlaceholders = (desc, values) => {
					values.forEach((value) => {
						desc = desc.replace("%s", `<span class="highlight-text">${value}</span>`);
					});
					return desc;
				};
				hullMod.desc = replacePlaceholders(hullMod.desc, hullMod.importedValues[0]);
			});
		},
		data: {
			"Accelerated Shields": [["100%", "100%"], ["100%"]],
			"Extended Shields": [[60], [60]],
			"Hardened Shields": [["20%"], []],
			"Stabilized Shields": [["50%"], ["10%"]],
			"Shield Conversion - Front": [["100%"], ["5%"]],
			"Shield Conversion - Omni": [["30%"], []],
			"Shield Shunt": [["15%"], ["15%"]],
			"Makeshift Shield Generator": [[90, "20%"], []],
			"Flux Shunt": [["50%"], []],
			"Automated Repair Unit": [["50%"], ["25%", "33%"]],
			"Blast Doors": [["20%", "60%"], ["85%"]],
			"Heavy Armor": [[150, 300, 400, 500], ["25%"]],
			"Reinforced Bulkheads": [["40%"], []],
			"Resistant Flux Conduits": [["50%", "25%"], ["10%"]],
			"Armored Weapon Mounts": [["100%", "25%", "25%", "10%"], ["10%"]],
			"Integrated Point Defense AI": [["50%"], []],
			//
			"Solar Shielding": [["75%", "10%"], ["100%"]],
			"Advanced Optics": [[200, "30%"], []],
			"Advanced Turret Gyros": [["75%"], ["25%", "5%"]],
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
			"Adaptive Phase Coils": [["50%", "50%", "75%"], []],
			"Phase Anchor": [[0, "2x", "1x"], []],
			"Phase Field": [["50%", 5, 5], []],
			"Additional Berthing": [[30, 60, 100, 200, "30%", "50%"], []],
			"Auxiliary Fuel Tanks": [[30, 60, 100, 200, "30%", "50%"], []],
			"Expanded Cargo Holds": [[30, 60, 100, 200, "30%", "50%"], []],
			"Augmented Drive Field": [[2], [1]],
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
		},

		textInjectionData: [
			{
				"Ballistic Rangefinder":
					"If the largest Ballistic slot on the ship is large: increases the base range of small weapons in Ballistic slots by %s, and of medium weapons by %s, up to a maximum of %s range. Otherwise: increases the base range of small weapons in Ballistic slots by %s, up to %s maximum. Does not affect point-defense weapons or Ballistic weapons placed in Composite, Hybrid or Universal slots. Hybrid weapons in Ballistic slots receive double the bonus. Non-PD Hybrid weapons in ballistic slots, including large ones, will receive %s bonus range, subject to the maximum, in cases where other weapons of the same size would receive no bonus.",
			},
			{
				"Converted Hangar":
					"Converts the ship's standard shuttle hangar to house a fighter bay. The improvised flight deck, its crew, and the related machinery function at a pace below that of a dedicated carrier. Increases fighter refit time by %sx, and the fighter replacement rate both decays and recovers %sx more slowly. In addition, bombers returning to rearm (or fighters returning to repair) take %s% of their base time to relaunch, where it normally takes under a second. Increases the minimum crew by %s to account for pilots and fighter crews. Increases the ship's deployment points and supply cost to recover from deployment by %s for every %s ordnance points spent on fighters, or by at least %s point. This comes with a proportional increase in combat readiness lost per deployment.",
			},
			{
				"Missile Autoloader":
					"A combat-rated autoloader that provides a limited number of reloads to missile weapons installed in small missile mounts. Does not affect weapons that do not use ammo or already regenerate it, or weapons that are mounted in any other kind of weapon slot. The number of missiles reloaded is not affected by skills or hullmods that increase missile weapon ammo capacity. A partial reload is possible when running out of capacity. After a reload, the weapon requires an extra 5 seconds, in addition to its normal cooldown, before it can fire again.",
			},
			{
				"High Scatter Amplifier":
					"Beam weapons deal %s more damage and deal hard flux to shields. Reduces the portion of the range of beam weapons that is above %s units by %s. The base range is affected. Interactions with other modifiers: The base range is reduced, thus percentage and multiplicative modifiers - such as from Integrated Targeting Unit, skills, or similar sources - apply to the reduced base value.",
			},
			{
				"High Resolution Sensors":
					"Increases sensor strength by %s/%s/%s/%s points for frigates / destroyers / cruisers and capitals, respectively. Minimum CR of %s required to function.",
			},
			{
				"Neural Interface": `Links the flagship with another ship, allowing switching between ships without using a shuttle pod. Both ships must have a neural interface and not be commanded by officers or AI cores. The transfer is instant if the combined deployment points of the linked ships are %s or less. If the linked ship is destroyed or leaves the battlefield, the flagship will establish a neural link with another ship with a Neural Interface. If the flagship is destroyed or leaves the battlefield, command will have to be physically transferred to another ship with a Neural Interface before a new link can be established. Both linked ships benefit from your personal combat skills as if you had transferred command to them, regardless of which one you are controlling personally. As with "transfer command", some skill effects - such as those increasing ammo capacity or another fixed ship stat - do not apply.`,
			},
			{
				"Neural Integrator": `An augmented version of Neural Interface that works with automated ships by enabling direct control of all of the ship's systems via the link, instead of having the controlling consciousness aspect simply direct the bridge crew. Links the flagship with another ship, allowing switching between ships without using a shuttle pod. Both ships must have a neural interface and not be commanded by officers or AI cores. The transfer is instant if the combined deployment points of the linked ships are %s or less. If the linked ship is destroyed or leaves the battlefield, the flagship will establish a neural link with another ship with a Neural Interface. If the flagship is destroyed or leaves the battlefield, command will have to be physically transferred to another ship with a Neural Interface before a new link can be established. Both linked ships benefit from your personal combat skills as if you had transferred command to them, regardless of which one you are controlling personally. As with "transfer command", some skill effects - such as those increasing ammo capacity or another fixed ship stat - do not apply. Also increases the deployment cost and supply use by %s`,
			},
		],
	},

	usableHullMods(data) {
		// create new object with VISIBLE and DEFINED hulls.
		// Alphabetic Sorting
		//? If you need d-mod try filtering for HIDDEN (=== TRUE)
		state.usableHullMods = data
			.filter((hullMod) => (hullMod.hidden !== "TRUE" && hullMod.hidden !== undefined && hullMod.name !== "Assault Package" ? hullMod : ""))
			.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
	},
};
const modelFetcher = {
	fetchSpecializedShipData: async function () {
		try {
			const res = await fetch(`/${URL.DATA_HULLS}/${state.currentShip.id}.ship`);
			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
			const specificShipData = await res.text();
			const dataNormalized = JSON.parse(specificShipData);
			// Only grabs specific data, check .SHIP file for more positions
			const whatToExtract = ["spriteName", "builtInMods", "weaponSlots", "hullSize", "builtInWings", "width", "height", "center", "viewOffset"];
			Object.entries(dataNormalized).forEach(([key, value]) => {
				if (whatToExtract.includes(key)) {
					state.currentShip[key] = value;
				}
			});
		} catch (err) {
			console.log(err);
		}
	},
	fetchAllShipData: async function () {
		try {
			const res = await fetch(`/${URL.DATA_HULLS}/${URL.SHIPDATA_CVS}`);

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			const csvData = await res.text();

			const rows = csvData.split("\n");
			const headers = rows[0].split(",");

			state.allShips = rows.slice(1).map((row) => {
				//shipData
				const values = row.split(",");
				let obj = headers.reduce((object, header, index) => {
					object[header] = values[index];
					return object;
				}, {});
				// keys conversion
				obj = renameKeysFromCSVdata(obj);
				return obj;
			});
		} catch (error) {
			console.error("Error:", error);
			throw error; // Re-throw the error after logging it
		}
	},
	fetchAllWeaponData: async function () {
		try {
			const res = await fetch(`/${URL.DATA_WEAPONS}/${URL.WEAPONDATA_CVS}`);
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			const csvData = await res.text();

			const rows = csvData.split("\n");
			const headers = rows[0].split(",");

			const weaponArray = rows.slice(1).map((row) => {
				//shipData
				const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
				let obj = headers.reduce((object, header, index) => {
					object[header] = values[index];
					return object;
				}, {});
				// keys conversion
				obj = renameKeysFromCSVdata(obj);
				// if (obj.id !== "") return obj;
				return obj;
			});
			state.allWeapons = weaponArray
				.map((weapons) =>
					Object.fromEntries(
						Object.entries(weapons).map(([key, value]) => {
							if (!key || !value) return [];
							// console.log(key, value);
							const newValue = value.trimStart().replace(/[""]/g, "");
							return [key, newValue];
						})
					)
				)
				.filter((weapons) => weapons.id !== "")
				.filter((weapons) => weapons.id !== undefined);
		} catch (error) {
			console.error("Error:", error);
			throw error; // Re-throw the error after logging it
		}
	},

	fetchAllHullModsData: async function () {
		try {
			const res = await fetch(`/${URL.DATA_HULLMODS}/${URL.HULLMODS_CVS}`);
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			const csvData = await res.text();

			const getHeader = function (data) {
				return csvData.split("\n")[0].split(",");
			};
			const header = getHeader(csvData);
			const rows = csvData.split(/(?<=png)/);
			const clearRow = rows.map((row) =>
				row
					.replace(/\r/g, "")
					.split("\n")
					.filter((e) => e.trim() !== "" && !e.startsWith("#") && !/^[,]+$/.test(e))
			);
			const returnBack = clearRow.slice(0, 1).map((e) => e[1]);
			const finalRow = clearRow.slice(1);
			finalRow.unshift(returnBack);

			const combinedString = finalRow.map((subArr) => {
				if (subArr.length === 0) return "";
				return subArr.reduce((acc, curr) => [acc + curr], "");
			});

			const values = combinedString.map(([row]) => {
				function replaceCommasInQuotes(str) {
					return str.replace(/"[^"]*"/g, function (match) {
						// return match.replace(/,/g, " ");
						return match.replace(/,/g, "|");
					});
				}
				const edited = replaceCommasInQuotes(row);

				return edited.split(",");
			});
			state.allShipHulls = values.map((row) => {
				// const values = row.split(",");
				let obj = header.reduce((object, header, index) => {
					object[header] = row[index]; // Use bracket notation for dynamic property names
					return object;
				}, {});
				// keys conversion
				obj = renameKeysFromCSVdata(obj);
				return obj;
			});
		} catch (error) {
			console.error("Error:", error);
			throw error; // Re-throw the error after logging it
		}
	},

	fetchAndInjectAdditionalWeaponProperties: async function () {
		const cleanWeaponData = (dirtyData) => {
			return dirtyData
				.replace(/#.*$/gm, "")
				.replace(/,(\s*[}\]])/g, "$1")
				.replace(/(?<!":\s)(\b[A-Za-z]+\b)(?=\s*[:,])/g, '"$1"')
				.replace(/\[(.*?)\]/g, (match, p1) => {
					return `[${p1
						.split(",")
						.map((item) => {
							const trimmedItem = item.trim();
							return isNaN(trimmedItem) ? `"${trimmedItem}"` : trimmedItem;
						})
						.join(",")}]`;
				})
				.replaceAll(`""`, `"`)
				.replaceAll(";", ",")
				.replaceAll(`:",`, `:"",`);
		};

		const fetchWeaponData = async (weaponId) => {
			const res = await fetch(`/${URL.DATA_WEAPONS}/${weaponId}.wpn`);
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			return res.text();
		};

		const extractAdditionalWeaponData = (weaponDataFinal) => {
			const keysToInject = ["size", "specClass", "turretSprite", "type", "turretGunSprite", "turretOffsets", "mountTypeOverride"];
			return keysToInject.reduce((acc, key) => {
				acc[key] = weaponDataFinal[key];
				return acc;
			}, {});
		};

		const processWeapon = async (weaponObj) => {
			try {
				const dirtyData = await fetchWeaponData(weaponObj.id);
				const cleanData = await cleanWeaponData(dirtyData);
				const weaponDataFinal = JSON.parse(cleanData);
				const additionalWeaponData = extractAdditionalWeaponData(weaponDataFinal);
				return { ...weaponObj, additionalWeaponData };
			} catch (err) {
				// console.error(`Error processing weapon ${weaponObj.id}: ${err}`); //! TURN ON
				//! I turned it off due to it being annoying
				return weaponObj; // Return original object if processing fails
			}
		};

		state.allWeapons = await Promise.all(state.allWeapons.map(processWeapon));
	},
	fetchDescriptions: async function () {
		const res = await fetch(`/${URL.DATA_STRINGS}/${URL.DESCRIPTION_CVS}`);
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		const csvData = await res.text();
		//
		const clearData = csvData.replaceAll("\n", "");
		const commaNotInQuotes = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/; // split by commas that ARE not in quotes
		//////
		const rows = clearData.split(",\r");
		const headers = rows[0].split(",");

		state.globalDescriptions = rows.slice(1).map((row) => {
			const values = row.split(commaNotInQuotes);
			const clearedValues = values.map((singleValue) => singleValue.replaceAll("\r", " ").replaceAll('"', "").replaceAll("  ", ""));
			let obj = headers.reduce((object, header, index) => {
				object[header] = clearedValues[index];
				return object;
			}, {});
			// keys conversion
			obj = renameKeysFromCSVdata(obj);
			return obj;
		});
	},
	fetchAllFighters: async function () {
		try {
			// wing data
			const res = await fetch(`/${URL.DATA_HULLS}/${URL.FIGHTER_CVS}`);
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			const csvData = await res.text();
			const hideFightersWithThisTag = "leader_no_swarm"; // to target OMEGA fighters

			const rows = csvData.split("\n");
			const headers = rows[0].split(",");
			const fighterArray = rows.slice(1).map((row) => {
				//shipData
				const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
				let obj = headers.reduce((object, header, index) => {
					object[header] = values[index];
					return object;
				}, {});
				// keys conversion
				obj = renameKeysFromCSVdata(obj);
				return obj;
			});
			const newFighterArray = fighterArray
				.map((fighters) =>
					Object.fromEntries(
						Object.entries(fighters).map(([key, value]) => {
							if (!key || !value) return [];
							const newValue = value.trimStart().replace(/[""]/g, "");
							return [key, newValue];
						})
					)
				)
				.filter((fighters) => fighters.id !== "" && fighters.id !== undefined);

			state.allFighters = newFighterArray
				.map((fighter) => ({
					...fighter,
					tags: fighter.tags
						.replaceAll(" ", "")
						.split(",")
						.filter((tag) => tag !== ""),
				}))
				.filter((currentFighter) => !currentFighter.tags.includes(hideFightersWithThisTag));
		} catch (error) {
			console.error("Error:", error);
			throw error; // Re-throw the error after logging it
		}
	},
	fetchAndInjectInitialFighterData: async function () {
		try {
			const updatedId = (fighterObject) => fighterObject.id.replaceAll("_wing", "");
			const convertIdToDifferentIdSpecialRule = (fighterId) => {
				// for some reason different id for two fighters
				if (fighterId === "borer") {
					return (fighterId = "drone_borer");
				}
				if (fighterId === "terminator") {
					return (fighterId = "drone_terminator");
				}
				return fighterId;
			};

			const fetchFighterData = async (fighterIdOnly) => {
				const res = await fetch(`/${URL.DATA_HULLS}/${convertIdToDifferentIdSpecialRule(fighterIdOnly)}.ship`);
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.text();
			};

			const extractAdditionalFighterData = (fighterDataFinal) => {
				const keysToInject = ["height", "spriteName", "width"];
				return keysToInject.reduce((acc, key) => {
					acc[key] = fighterDataFinal[key];
					return acc;
				}, {});
			};

			const processWeapon = async (fighterObject) => {
				try {
					const cleanData = await fetchFighterData(updatedId(fighterObject));
					const weaponDataFinal = JSON.parse(cleanData);
					const additionalFighterData = extractAdditionalFighterData(weaponDataFinal);
					return { ...fighterObject, additionalFighterData };
				} catch (err) {
					console.error(`Error processing weapon ${fighterObject.id}: ${err}`);
					return fighterObject; // Return original object if processing fails
				}
			};
			state.allFighters = await Promise.all(state.allFighters.map(processWeapon));
		} catch (err) {
			console.log(err);
		}
	},

	fetchAndInjectAdditionalFighterDataFromShipData: async function () {
		const { allFighters, allShips } = state;

		// Additional properties take from AllShips CVS
		const KEYS_TO_EXTRACT = ["shield_type", "tech_manufacturer", "shield_arc", "armor_rating", "hitpoints", "name", "max_crew", "system_id", "max_speed"];

		const normalizeFighterId = (fighterId) => {
			const normalized = fighterId.replaceAll("_wing", "").split("_").join(" ").toLowerCase();

			const specialIdMappings = {
				borer: "drone_borer",
				terminator: "drone_terminator",
				"mining drone": "mining_drone",
			};

			return specialIdMappings[normalized] || normalized;
		};
		const extractDescription = (id) => {
			return state.globalDescriptions.find((description) => description.id === id);
		};

		state.allFighters = allFighters.map((fighterObject) => {
			// different Id in different databases for some reason
			// some with dagger_wing, some dagger.
			const fighterId = normalizeFighterId(fighterObject.id);

			// Strip values from One array and assign to DataShipHull subObject
			const currentFighter = allShips.find((shipObject) => shipObject.id === fighterId);
			const additionalFighterDataShipHull = currentFighter ? Object.fromEntries(KEYS_TO_EXTRACT.map((key) => [key, currentFighter[key]])) : {};

			// There are more parameters like text2 / test3 etc. Text1 Is main text.
			const description = extractDescription(fighterId).text1;
			return {
				...fighterObject,
				additionalFighterDataShipHull,
				description,
			};
		});
	},
	fetchAndInjectFighterVariantData: async function () {
		//? WHY THE DATA IS IN VARIANTS/FIGHTERS I HAVE NOT IDEA
		//? WHY ARE SOME IN DIFFERENT FOLDERS
		//? WHY FLASH IS IN REMNANT
		//? HOPLON IS KOPESH (OLD NAME)

		try {
			const cleanToJson = (fileContent) => {
				fileContent = fileContent.replace(/#.*$/gm, ""); // Remove inline comments
				fileContent = fileContent.replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas
				fileContent = fileContent.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":'); // Add quotes around keys

				return fileContent;
			};
			const variantTargeting = (fighterObject) => {
				// hoplon_Escort => kopesh_Bomber // Why I dont know
				return fighterObject.variant !== "hoplon_Escort" ? fighterObject.variant : "khopesh_Bomber";
			};

			const fetchVariantData = async (variantId) => {
				const SPECIAL_RULES = {
					drone_borer: URL.DATA_VARIANTS_DRONES,
					drone_terminator: URL.DATA_VARIANTS_DRONES,
					flash_Bomber: URL.DATA_VARIANTS_REMNANT,
					spark_Interceptor: URL.DATA_VARIANTS_REMNANT,
					lux_Fighter: URL.DATA_VARIANTS_REMNANT,
				};

				const regularURL = (urlCheck) => {
					if (urlCheck === undefined) {
						return `/${URL.DATA_VARIANTS_FIGHTERS}/${variantId}.variant`;
					}
					return `/${urlCheck}/${variantId}.variant`;
				};

				//
				const res = await fetch(regularURL(SPECIAL_RULES[variantId]));
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.text();
			};

			const processWeapon = async (fighterObject) => {
				try {
					const fetchedData = await fetchVariantData(variantTargeting(fighterObject));
					const cleanedData = cleanToJson(fetchedData);
					const additionalFighterDataFromVariant = JSON.parse(cleanedData);
					// console.log(additionalFighterDataFromVariant);
					return { ...fighterObject, additionalFighterDataFromVariant };
				} catch (err) {
					console.error(`Error processing weapon ${fighterObject.id}: ${err}`);
					return fighterObject; // Return original object if processing fails
				}
			};
			state.allFighters = await Promise.all(state.allFighters.map(processWeapon));
		} catch (err) {
			console.log(`${err} in fetchAndInjectFighterVariantData`);
		}
	},
};
const currentShipBuildHolder = {
	addBuildInHullModsToCurrentShipBuild: async function () {
		let { builtInMods } = state.currentShip;
		const { allShipHulls } = state;

		if (!builtInMods) return (state.currentShipBuild = { hullMods: {} });

		const hullModsMap = new Map(allShipHulls.map((hull) => [hull.id, hull]));

		const buildInHullMods = builtInMods.map((modId) => hullModsMap.get(modId)).filter(Boolean); // Removes undefined entries in case of missing mods

		state.currentShipBuild = { hullMods: { buildInHullMods: buildInHullMods } };
	},
	findAndCreateCurrentShip: async function (inputShipName) {
		let { allShips } = state;
		[state.currentShip] = allShips.filter((ship) => (ship.id === inputShipName ? ship.id : ""));
	},
	//! Base Ship Data is here
	//TODO (15/12/2024) I need to rework this
	assingInitialCurrentShipData() {
		const { currentShip, currentShipBuild } = state;

		genericHelperFunction.setHullSizeProperties(currentShipBuild, currentShip.hullSize);

		Object.assign(currentShipBuild, {
			//! dont change base values, they are foundation
			// Capacitors
			activeCapacitors: 0,
			activeCapacitorsOrdinanceCost: 1,
			_baseFluxCapacity: Number(currentShip.max_flux),
			currentFluxCapacity: Number(currentShip.max_flux),
			_baseFluxCapacityPerSingleActiveCapacitor: 200,
			currentFluxCapacityPerSingleActiveCapacitor: 200,
			// Vents
			activeVents: 0,
			activeVentsOrdinanceCost: 1,
			_baseFluxDissipation: Number(currentShip.flux_dissipation),
			currentFluxDissipation: Number(currentShip.flux_dissipation),
			_baseFluxDissipationPerSingleActiveVent: 10,
			currentFluxDissipationPerSingleActiveVent: 10,

			// CR
			currentCR: 70,
			_baseCrRecoveryPerDay: Number(currentShip.cr___day),
			currentCrRecoveryPerDay: Number(currentShip.cr___day),

			_baseCrDeploymentCost: Number(currentShip.CR_to_deploy),
			_baseCrLossPerSecond: Number(currentShip.CR_loss_sec),
			_baseDeploymentCost: Number(currentShip.fleet_pts),
			_basePeakPerformanceSec: Number(currentShip.peak_CR_sec),
			currentPeakPerformanceSec: Number(currentShip.peak_CR_sec),

			// Ordinance Points
			_baseOrdinancePoints: 0,
			currentOrdinancePoints: 0,
			maxOrdinancePoints: Number(currentShip.ordnance_points),
			// Misc
			currentPilot: "",
			// Armour
			_baseArmor: Number(currentShip.armor_rating),
			currentArmor: Number(currentShip.armor_rating),
			// Hull HP
			_baseHitPoints: Number(currentShip.hitpoints),
			currentHitPoints: Number(currentShip.hitpoints),
			// Movement
			_baseSpeed: Number(currentShip.max_speed),
			currentSpeed: Number(currentShip.max_speed),
			_baseAcceleration: Number(currentShip.acceleration),
			currentAcceleration: Number(currentShip.acceleration),
			_baseDeceleration: Number(currentShip.deceleration),
			currentDeceleration: Number(currentShip.deceleration),
			//
			_baseMaxTurnRate: Number(currentShip.max_turn_rate),
			_baseTurnAcceleration: Number(currentShip.turn_acceleration),

			// Shield Type || Shield / Phase / No Shield
			_baseShipType: genericHelperFunction.shieldTypeCheck(),
			currentShipType: genericHelperFunction.shieldTypeCheck(),

			_baseShieldType: currentShip.shield_type,
			currentShieldType: currentShip.shield_type,

			_baseShieldArc: Number(currentShip.shield_arc),
			currentShieldArc: Number(currentShip.shield_arc),

			_baseShieldEfficiency: Number(currentShip.shield_efficiency),
			currentShieldEfficiency: Number(currentShip.shield_efficiency),

			_baseShieldUpkeep: Number(currentShip.shield_upkeep),
			currentShieldUpkeep: Number(currentShip.shield_upkeep),

			// Phase
			phaseCost: Number(currentShip.phase_cost),
			phaseUpkeep: Number(currentShip.phase_upkeep),

			// Systems
			systemId: currentShip.system_id,
			defenseId: currentShip.defense_id,

			// Fighter Bays
			_baseFighterBays: Number(currentShip.fighter_bays),
			currentFighterBays: Number(currentShip.fighter_bays),
			_buildInFighterBays: currentShip.builtInWings,
			// Logistical
			_baseShipIsCivilian: this.checkIfShipIsCiv(),
			currentShipIsCivilian: this.checkIfShipIsCiv(),
			// Supplies
			_baseSuppliesPerMonth: Number(currentShip.supplies_mo),
			currentSuppliesPerMonth: Number(currentShip.supplies_mo),

			_baseRecoveryCost: Number(currentShip.supplies_rec),
			currentRecoveryCost: Number(currentShip.supplies_rec),

			_baseCargoCap: Number(currentShip.cargo),
			currentCargoCap: Number(currentShip.cargo),

			// Crew
			_baseMaxCrew: Number(currentShip.max_crew),
			currentMaxCrew: Number(currentShip.max_crew),
			_baseMinCrew: Number(currentShip.min_crew),
			currentMinCrew: Number(currentShip.min_crew),

			// Fuel
			_baseFuelCap: Number(currentShip.fuel),
			currentFuelCap: Number(currentShip.fuel),

			_baseShipBurn: Number(currentShip.max_burn),
			currentShipBurn: Number(currentShip.max_burn),

			_basyFuelPerLY: Number(currentShip.fuel_ly),
			currentFuelPerLY: Number(currentShip.fuel_ly),

			// Weapon Slots
			_baseWeaponSlots: currentShip.weaponSlots,
			currentWeaponSlots: this.weaponSlotIdEdit(currentShip.weaponSlots),

			// Current Installed Weapons
			_baseInstalledWeapons: this.injectCurrentShipSlotsIntoWeapons(currentShip.weaponSlots),
			currentInstalledWeapons: this.injectCurrentShipSlotsIntoWeapons(currentShip.weaponSlots),
		});
	},

	injectCurrentShipSlotsIntoWeapons(weaponSlotInput) {
		return this.weaponSlotIdEdit(weaponSlotInput).map((wpn) => [wpn.id, ""]);
	},
	weaponSlotIdEdit(weaponSlots) {
		return weaponSlots.map((slot) => {
			slot.id = slot.id.replace(" ", "-");
			return slot;
		});
	},
	checkIfShipIsCiv() {
		return state.currentShipBuild.hullMods.buildInHullMods?.some((hullmod) => hullmod.id === "civgrade") ? "civilian" : "military";
	},
};

const genericHelperFunction = {
	convertTagsFromStringIntoAndArray(data = [], stringProperty = "", newArrayName = "") {
		//! Why forEach 15/12
		data.forEach((item) => {
			if (item[stringProperty] && item[stringProperty].trim() !== "") {
				item[newArrayName] = item[stringProperty]
					.replace(/[""]/g, "")
					.trim()
					.split(/\s*\|\s*/);
			} else {
				item[newArrayName] = ["UNAVAILABLE"];
			}
		});
	},
	//! unused
	hullModUsableTagsCoversion(data) {
		// take existing tags array IN USABLE HULLS, create new array INSIDE EACH HULLMODE with tags I actually need.
		// filter tags I don`t intend to use like MERC or STANDARD
		data.forEach(
			(hullMod) =>
				(hullMod.tagsArrayToUse = hullMod.tagsArray.filter(
					(e) => e !== "merc" && e !== "standard" && e !== "no_drop" && e !== "no_drop_salvage" && e !== "phase_brawler"
				))
		);
	},
	cleanUpHullModDescription(usableHullMods) {
		const convertDescription = (desc) => {
			return desc
				.replace(/\|/g, ",")
				.replace(/[""]/g, "")
				.replace(/\.(\S)/g, ". $1");
		};

		usableHullMods.forEach((hullMod) => {
			hullMod.desc = convertDescription(hullMod.desc);
		});
	},
	shieldTypeCheck() {
		const { shield_arc, shield_efficiency, shield_type, shield_upkeep, phase_upkeep, phase_cost } = state.currentShip;

		let shipType;
		if (shield_arc === "" && shield_efficiency === "" && shield_type === "PHASE" && shield_upkeep === "" && phase_upkeep !== "" && phase_cost !== "") {
			shipType = "phaseShip";
		} else if (shield_arc !== "" && shield_efficiency !== "" && shield_type !== "PHASE" && shield_upkeep !== "" && phase_upkeep === "" && phase_cost === "") {
			shipType = "shieldShip";
		} else {
			shipType = "noShieldShip";
		}

		return shipType;
	},
	setHullSizeProperties(data, hullSize) {
		//? hullSize in specific shipHull file don`t match hullSize cost in hullMods
		// import for hullMods cost calc
		const hullSizeProperties = {
			CAPITAL_SHIP: {
				hullModCost: "cost_capital",
				shipSize: "capital",
				maxVents: 50,
				maxCapacitors: 50,
				sensorProfile: 150,
				sensorStrength: 150,
			},
			CRUISER: {
				hullModCost: "cost_cruiser",
				shipSize: "cruiser",
				maxVents: 30,
				maxCapacitors: 30,
				sensorProfile: 90,
				sensorStrength: 90,
			},
			DESTROYER: {
				hullModCost: "cost_dest",
				shipSize: "destroyer",
				maxVents: 20,
				maxCapacitors: 20,
				sensorProfile: 60,
				sensorStrength: 60,
			},
			FRIGATE: {
				hullModCost: "cost_frigate",
				shipSize: "frigate",
				maxVents: 10,
				maxCapacitors: 10,
				sensorProfile: 30,
				sensorStrength: 30,
			},
		};

		if (hullSize in hullSizeProperties) {
			Object.assign(data, hullSizeProperties[hullSize]);
		} else {
			console.warn(`Unknown hull size: ${hullSize}`);
		}
	},
	convertStringIntoNumber() {},
	weaponDataConversionFromStringIntoNumber: async function () {
		const listOfPropertiesToConvert = [
			"OPs",
			"range",
			"energy_shot",
			"damage_shot",
			"range",
			"turn_rate",
			"chargeup",
			"chargedown",
			"burst_size",
			"ammo_sec",
			"ammo",
			"proj_hitpoints",
			"proj_speed",
			"reload_size",
			"spread_shot",
			"tier",
			"impact",
			"max_spread",
			"min_spread",
			"rarity",
			"spread_decay_sec",
			"emp",
			"burst_delay",
			"base_value",
		];
		state.allWeapons = state.allWeapons.map((weaponObject) => {
			listOfPropertiesToConvert.forEach((property) => {
				if (!property) return;
				const convertedString = Number.parseFloat(weaponObject[property]);
				weaponObject[property] = isNaN(convertedString) === false ? convertedString : undefined;
			});
			return weaponObject;
		});
	},
	injectWeaponDescriptions: async function () {
		try {
			state.allWeapons = state.allWeapons.map((weaponObject) => {
				const currentWeaponDescriptionObject = state.globalDescriptions
					.filter((descriptionObject) => descriptionObject.id === weaponObject.id)
					.map((descriptionObject) => descriptionObject.text1);
				[weaponObject.description] = currentWeaponDescriptionObject;
				return weaponObject;
			});
		} catch (err) {
			console.warn("injectWeaponDescriptions");
		}
	},
	overwriteWeaponTypeWithForcedOverwrite: async function () {
		try {
			const newArray = state.allWeapons.map(
				(weapon) =>
					(weapon.additionalWeaponData.type = weapon.additionalWeaponData.mountTypeOverride
						? weapon.additionalWeaponData.mountTypeOverride
						: weapon.additionalWeaponData.type)
			);
			// console.log(newArray.filter((weapon) => weapon.additionalWeaponData.mountTypeOverride));
		} catch (err) {
			console.warn("overwriteWeaponTypeWithForcedOverwrite");
		}
	},
};

const gameRulesInjection = {
	shipTurnRate() {},
};

export const modelInit = async function () {
	//TODO strange place to put it in.
	await modelFetcher.fetchDescriptions();
	// remember the order
	await modelFetcher.fetchAllShipData();
	await modelFetcher.fetchAllWeaponData();
	await modelFetcher.fetchAndInjectAdditionalWeaponProperties();

	//
	await modelFetcher.fetchAllFighters();
	await modelFetcher.fetchAndInjectInitialFighterData();
	await modelFetcher.fetchAndInjectAdditionalFighterDataFromShipData();
	await modelFetcher.fetchAndInjectFighterVariantData();
	//
	//TODO I need to insert it in regular Weapon Fetching same As I did with FighterData
	await genericHelperFunction.injectWeaponDescriptions();
	//
	await genericHelperFunction.overwriteWeaponTypeWithForcedOverwrite();
	await genericHelperFunction.weaponDataConversionFromStringIntoNumber();

	await modelFetcher.fetchAllHullModsData();
	await currentShipBuildHolder.findAndCreateCurrentShip(shipNameDev);
	await modelFetcher.fetchSpecializedShipData();
	await currentShipBuildHolder.addBuildInHullModsToCurrentShipBuild();

	currentShipBuildHolder.assingInitialCurrentShipData();
	gameRulesInjection.shipTurnRate();

	// only hullMods user can select
	hullModsHolder.usableHullMods(state.allShipHulls);
	genericHelperFunction.cleanUpHullModDescription(state.usableHullMods);

	// convert strings into Tags Array
	genericHelperFunction.convertTagsFromStringIntoAndArray(state.usableHullMods, "tags", "tagsArray");
	genericHelperFunction.convertTagsFromStringIntoAndArray(state.usableHullMods, "uiTags", "uiTagsArray");
	hullModsHolder.hullModDataInjection.controller();
	// Filter tags
	// cleanDescriptionArray();
	//! assing effects to hullMods
};
//! I dont remember why I export all of this???
//! review before pushing
//! I doesnt work?
// bruh
// export const fetchSpecializedShipData = modelFetcher.fetchSpecializedShipData;
// export const fetchAllShipData = modelFetcher.fetchAllShipData;
// export const fetchAllWeaponData = modelFetcher.fetchAllWeaponData;
// export const fetchAllHullModsData = modelFetcher.fetchAllHullModsData;
// export const fetchAllFighters = modelFetcher.fetchAllFighters;
// export const fetchAndInjectInitialFighterData =
// 	modelFetcher.fetchAndInjectInitialFighterData;
// export const fetchAndInjectAdditionalFighterDataFromShipData =
// 	modelFetcher.fetchAndInjectAdditionalFighterDataFromShipData;

// export const hullModEffectData = hullModsHolder.hullModEffectData;
// export const addBuildInHullModsToCurrentShipBuild =
// 	currentShipBuildHolder.addBuildInHullModsToCurrentShipBuild;
// export const findAndCreateCurrentShip =
// 	currentShipBuildHolder.findAndCreateCurrentShip;
// export const assingInitialCurrentShipData =
// 	currentShipBuildHolder.assingInitialCurrentShipData;
