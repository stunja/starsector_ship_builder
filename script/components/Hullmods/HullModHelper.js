// Helper
import { VALUE_CHANGE } from "../../helper/MagicStrings";
import {
	SHIELD_TYPE,
	WEAPON_SLOT_TYPE,
	HULL_SIZE,
	SHIP_TYPE,
} from "../../helper/Properties";

const HULLMOD_HULLSIZE = {
	CAPITAL_SHIP: "cost_capital",
	CRUISER: "cost_cruiser",
	DESTROYER: "cost_dest",
	FRIGATE: "cost_frigate",
};
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
		const keyToFind = HULLMOD_HULLSIZE[shipSize];
		return currentHullMod[keyToFind];
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
	hullModHullSizeConverter(target, frigate, destroyer, cruiser, capital) {
		if (target === HULL_SIZE.FRIGATE) return frigate;

		if (target === HULL_SIZE.DESTROYER) return destroyer;

		if (target === HULL_SIZE.CRUISER) return cruiser;

		if (target === HULL_SIZE.CAPITAL_SHIP) return capital;
	},
	updateOrdinancePoints(ordinancePoints, hullMod, hullSize) {
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
	// Increases maximum crew
	updateMaxCrew(
		hullSize,
		frigateFlux,
		destroyerFlux,
		cruiserFlux,
		capitalFlux,
		increaseByPercentValue,
		maxCrew
	) {
		const maximumCrewCapacityBasedOnHullSize = this.hullModHullSizeConverter(
			hullSize,
			frigateFlux,
			destroyerFlux,
			cruiserFlux,
			capitalFlux
		);

		const percentOfMaxCrew = this.convertStringPercentIntoNumber(
			increaseByPercentValue,
			VALUE_CHANGE.RETURN,
			maxCrew
		);

		// whichever is higher

		const crewFromFixedValue = maxCrew + maximumCrewCapacityBasedOnHullSize;

		const crewFromPercentage = maxCrew + percentOfMaxCrew;

		return Math.max(crewFromFixedValue, crewFromPercentage);
	},
	// Increase Max Ship Burn
	updateMaxShipBurn(currentShipBurn, incrementShipBurn) {
		return currentShipBurn + incrementShipBurn;
	},

	// Increases fuel capacity
	updateFuelCapacity(
		hullSize,
		frigateFlux,
		destroyerFlux,
		cruiserFlux,
		capitalFlux,
		increaseByPercentValue,
		fuelCap
	) {
		const maximumBasedOnHullSize = this.hullModHullSizeConverter(
			hullSize,
			frigateFlux,
			destroyerFlux,
			cruiserFlux,
			capitalFlux
		);

		const percentOfMax = this.convertStringPercentIntoNumber(
			increaseByPercentValue,
			VALUE_CHANGE.RETURN,
			fuelCap
		);

		// whichever is higher

		const valueFromFixedValue = fuelCap + maximumBasedOnHullSize;

		const valueFromPercentage = fuelCap + percentOfMax;

		return Math.max(valueFromFixedValue, valueFromPercentage);
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
};
export default HullModHelper;
