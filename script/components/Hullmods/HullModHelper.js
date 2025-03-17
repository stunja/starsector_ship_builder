// Helper
import { VALUE_CHANGE } from "../../helper/MagicStrings";

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
		suppliesPerMonth
	) {
		const isCivilian = hullMods.builtInMods.some(
			({ id }) => id === HULLMODS.BUILD_IN.civgrade.id
		);

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
};
export default HullModHelper;
