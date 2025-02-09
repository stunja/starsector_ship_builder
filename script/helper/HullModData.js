// The Data was manually collected by Me.
// First array is regular data, second array is sMods
const HULLMODS_DATA = {
	"Accelerated Shields": [["100%", "100%"], ["100%"]],
	"Adaptive Phase Coils": [["50%", "50%", "75%"], []],
	"Automated Repair Unit": [["50%"], ["25%", "33%"]],
	"Armored Weapon Mounts": [["100%", "25%", "25%", "10%"], ["10%"]],
	"Advanced Turret Gyros": [["75%"], ["25%", "5%"]],
	"Additional Berthing": [[30, 60, 100, 200, "30%", "50%"], []],
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
export default HULLMODS_DATA;
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
