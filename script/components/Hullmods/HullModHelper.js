// Helper
import { VALUE_CHANGE } from "../../helper/MagicStrings";
import {
	SHIELD_TYPE,
	HULL_SIZE,
	SHIP_TYPE,
	HULLMOD_COST_KEYS,
} from "../../helper/Properties";

const HullModHelper = {
	updateInstalledHullMod(hullmodId, userShipBuild, allHullMods) {
		const { hullMods } = userShipBuild;

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
	},
	normalizedHullSize(currentHullMod, shipSize) {
		if (!currentHullMod || !shipSize)
			console.warn(`Error in HullModHelper.normalizedHullSize`);

		const keyToFind = HULLMOD_COST_KEYS[shipSize];
		return currentHullMod[keyToFind] ?? 0;
	},
	hullModHullSizeConverter(
		targetHullSize,
		frigate,
		destroyer,
		cruiser,
		capital
	) {
		if (targetHullSize === HULL_SIZE.FRIGATE) return frigate;

		if (targetHullSize === HULL_SIZE.DESTROYER) return destroyer;

		if (targetHullSize === HULL_SIZE.CRUISER) return cruiser;

		if (targetHullSize === HULL_SIZE.CAPITAL_SHIP) return capital;
	},
	// Simple Percent converter
	convertStringPercentIntoNumber(string, action, valueToModify) {
		if (typeof string !== "string" || !string.includes("%")) {
			throw new Error("Invalid percentage string format");
		}
		const percent = Number.parseInt(string) / 100;
		const percentValue = valueToModify * percent;

		if (action === VALUE_CHANGE.INCREASE) {
			return valueToModify + percentValue;
		}
		if (action === VALUE_CHANGE.DECREASE) {
			return valueToModify - percentValue;
		}
		if (action === VALUE_CHANGE.MULTIPLY) {
			return valueToModify * percentValue;
		}
		if (action === VALUE_CHANGE.DIVISION) {
			return valueToModify / percentValue;
		}
		if (action === VALUE_CHANGE.RETURN) {
			return percentValue;
		}
	},
	updateOrdinancePoints(ordinancePoints, hullMod, hullSize) {
		if (!this.normalizedHullSize(hullMod, hullSize)) {
			console.warn(`Error in HullModHelper.updateOrdinancePoints`);
		}
		return ordinancePoints + this.normalizedHullSize(hullMod, hullSize);
	},
	// If Civilian increases maintenance supply use by 100%
	isCivilianInreaseSuppliesPerMonth(
		hullMods,
		increaseOfSupplyUseIfCivilian,
		suppliesPerMonth,
		civGradeId
	) {
		const isCivilian = hullMods.builtInMods.some(({ id }) => id === civGradeId);

		const updateSuppliesPerMonth = this.convertStringPercentIntoNumber(
			increaseOfSupplyUseIfCivilian,
			VALUE_CHANGE.INCREASE,
			suppliesPerMonth
		);

		return isCivilian ? updateSuppliesPerMonth : suppliesPerMonth;
	},
	// Increases Max Crew / Cargo / Fuel
	updateMaxCrewCargoFuel(
		hullSize,
		frigateFlux,
		destroyerFlux,
		cruiserFlux,
		capitalFlux,
		increaseByPercentValue,
		target
	) {
		const maximumCrewCapacityBasedOnHullSize = this.hullModHullSizeConverter(
			hullSize,
			frigateFlux,
			destroyerFlux,
			cruiserFlux,
			capitalFlux
		);

		const percentOftarget = this.convertStringPercentIntoNumber(
			increaseByPercentValue,
			VALUE_CHANGE.RETURN,
			target
		);

		// whichever is higher

		const crewFromFixedValue = target + maximumCrewCapacityBasedOnHullSize;

		const crewFromPercentage = target + percentOftarget;

		return Math.max(crewFromFixedValue, crewFromPercentage);
	},
	// Increase Max Ship Burn
	updateMaxShipBurn(currentShipBurn, incrementShipBurn) {
		return currentShipBurn + incrementShipBurn;
	},

	// Increase Cargo Capacity
	increaseCargo(cargoCap, increaseCargoBy, countBuiltInWings) {
		return cargoCap + increaseCargoBy * countBuiltInWings;
	},

	// Decrease Min Crew Requirment
	decreaseMinCrewReq(
		minCrew,
		reduceMinCrewPerFighterBay,
		crewReductionLimit,
		countBuiltInWings
	) {
		const percentOfReduceMinCrewPerFighterBay =
			this.convertStringPercentIntoNumber(
				reduceMinCrewPerFighterBay,
				VALUE_CHANGE.RETURN,
				minCrew
			);

		const percentOfCrewReductionLimit = this.convertStringPercentIntoNumber(
			crewReductionLimit,
			VALUE_CHANGE.RETURN,
			minCrew
		);

		// if less than 80%, use first value, if not use second value (which is limit value)
		const decreaseBy = Math.min(
			percentOfReduceMinCrewPerFighterBay * countBuiltInWings,
			percentOfCrewReductionLimit
		);
		return minCrew - decreaseBy;
	},
	increaseValue(target, percentOfValueString) {
		return this.convertStringPercentIntoNumber(
			percentOfValueString,
			VALUE_CHANGE.INCREASE,
			target
		);
	},
	decreaseValue(target, percentOfValueString) {
		return this.convertStringPercentIntoNumber(
			percentOfValueString,
			VALUE_CHANGE.DECREASE,
			target
		);
	},
	// Increases the crew required by 20 per fighter bay.
	increaseMinCrewByFighterBay(minCrew, increaseCrewRequirement, fighterBays) {
		return minCrew + increaseCrewRequirement * fighterBays;
	},
	// Update Shield Arc
	updateShieldArc(shieldArc, increaseShieldArc) {
		const fullCircle = 360;
		const totalShieldArc = shieldArc + increaseShieldArc;

		return totalShieldArc >= fullCircle ? fullCircle : totalShieldArc;
	},

	// Increase Flux Capacity / Dissipation
	updateFluxCapacityOrDissipation(
		target,
		hullSize,
		[frigateFlux, destroyerFlux, cruiserFlux, capitalFlux]
	) {
		const valueBasedOnHullSize = this.hullModHullSizeConverter(
			hullSize,
			frigateFlux,
			destroyerFlux,
			cruiserFlux,
			capitalFlux
		);

		return target + valueBasedOnHullSize;
	},
};
export default HullModHelper;
