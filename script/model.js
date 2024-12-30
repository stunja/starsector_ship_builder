"use strict";
import {
	renameKeysFromCSVdata,
	convertStringsIntoNumbersCSVdata,
} from "./helper/helperFunction.js";
import * as URL from "./helper/url.js";
import Papa from "papaparse";

// "astral"; "gryphon"; "drover"; "hound"; "ox"; "legion"; // pegasus // paragon // astral // legion // odyssey
const shipNameDev = "astral";
//
//invictus // astral // grendel // atlas // colussus // venture // falcon // legion // Conquest
// paragon // hound // gryphon // shepherd // Hammerhead //
// gryphon = cruiser
// condor = destroyer
// hound = frigate
// Phase = harbinger / doom // shade
export class Model {
	dataState = {
		allShips: [],
		allWeapons: [],
		allHullMods: [],
		allFighters: [],
	};
	userState = {
		currentShip: {},
		userShipBuild: {},
		usableHullMods: [],
	};
	uiState = {
		isLoading: false,
	};
	updateState(stateName, newState) {
		if (this[stateName]) {
			this[stateName] = {
				...this[stateName],
				...newState,
			};
		} else {
			console.error(`State ${stateName} doesn't exists.`);
		}
	}

	async loadData() {
		this.updateState("uiState", { isLoading: true });
		try {
			const [ships, weapons, hullmods, fighters, desc] = await Promise.all([
				cvsFetcher.fetch(`/${URL.DATA_HULLS}/${URL.SHIPDATA_CVS}`),
				cvsFetcher.fetch(`/${URL.DATA_WEAPONS}/${URL.WEAPONDATA_CVS}`),
				cvsFetcher.fetch(`/${URL.DATA_HULLMODS}/${URL.HULLMODS_CVS}`),
				cvsFetcher.fetch(`/${URL.DATA_HULLS}/${URL.FIGHTER_CVS}`),
				cvsFetcher.fetch(`/${URL.DATA_STRINGS}/${URL.DESCRIPTION_CVS}`),
			]);

			const currentShip = findCurrentShip(ships);
			const updatedCurrentShip = await fetchCurrentShipAdditionalData(
				currentShip
			);
			const userShipBuild = createUserShipBuild.controller(updatedCurrentShip);

			this.updateState("dataState", {
				allShips: ships,
				allWeapons: weapons,
				allHullMods: hullmods,
				allFighters: fighters,
				allDescriptions: desc,
			});
			this.updateState("userState", {
				currentShip: updatedCurrentShip,
				userShipBuild: userShipBuild,
				_baseShipBuild: userShipBuild,
			});
		} catch (err) {
			console.log(`Failed to Load Resources ${err}`);
		} finally {
			this.updateState("uiState", { isLoading: false });
		}
	}
}
const cvsFetcher = {
	fetch: async function (url) {
		const csvData = await this.fetchData(url);
		const convertedData = await this.papaDataConverter(csvData);
		const dataWithConvertedKeys = convertedData.map(renameKeysFromCSVdata);
		const exportData = convertStringsIntoNumbersCSVdata(dataWithConvertedKeys);
		return exportData;
	},
	fetchData: async function (url) {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		return await res.blob();
	},
	papaDataConverter(data) {
		return new Promise((resolve, reject) => {
			Papa.parse(data, {
				header: true,
				complete: (results) => {
					resolve(results.data);
				},
				error: (err) => {
					reject(err);
				},
			});
		});
	},
};
const jsonFetcher = {
	fetch: async function (url) {
		const csvData = await this.fetchData(url);
		const dataNormalized = JSON.parse(csvData);
		return dataNormalized;
	},
	fetchData: async function (url) {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		return await res.text();
	},
};
const findCurrentShip = function (allShips) {
	const [currentShip] = allShips.filter((ship) =>
		ship.id === shipNameDev ? ship.id : ""
	);
	return currentShip;
};
const fetchCurrentShipAdditionalData = async function (currentShip) {
	const whatToExtract = [
		"spriteName",
		"builtInMods",
		"weaponSlots",
		"hullSize",
		"builtInWings",
		"width",
		"height",
		"center",
		"viewOffset",
	];
	try {
		const data = await jsonFetcher.fetch(
			`/${URL.DATA_HULLS}/${currentShip.id}.ship`
		);
		const additionalData = Object.fromEntries(
			Object.entries(data).filter(([key]) => whatToExtract.includes(key))
		);
		return { ...currentShip, additionalData };
	} catch (err) {
		console.log("Failed to fetch additiona data for currentShip", err);
	}
};

// UserShipBuild is here
const createUserShipBuild = {
	SHIP_ENUMS: {
		CAPACITORS_BASE: 0,
		CAPACITORS_COST: 1,
		FLUX_CAPACITY_PER_SINGLE_ACTIVE: 200,
		VENTS_BASE: 0,
		VENTS_COST: 1,
		FLUX_DISSIPATION_PER_SINGLE_ACTIVE: 10,
		ORDINANCE_POINTS: 0,
	},
	controller: function ({
		maxFlux,
		fluxDissipation,
		crDay,
		cRToDeploy,
		cRLossSec,
		fleetPts,
		peakCRSec,
		ordnancePoints,
		armorRating,
		maxSpeed,
		acceleration,
		deceleration,
		maxTurnRate,
		turnAcceleration,
		shieldType,
		shieldArc,
		shieldEfficiency,
		shieldUpkeep,
		phaseCost,
		phaseUpkeep,
		systemId,
		fighterBays,
		suppliesMo,
		suppliesRec,
		cargo,
		maxCrew,
		minCrew,
		fuel,
		maxBurn,
		fuelLy,
		hitpoints,
		defenseId,
		additionalData,
	}) {
		return {
			//? dont change base values, they are foundation
			// Capacitors
			capacitors: this.SHIP_ENUMS.CAPACITORS_BASE,
			capacitorsOrdinanceCost: this.SHIP_ENUMS.CAPACITORS_COST,
			fluxCapacity: maxFlux,
			fluxCapacityPerSingleActiveCapacitor:
				this.SHIP_ENUMS.FLUX_CAPACITY_PER_SINGLE_ACTIVE,

			// Vents
			vents: this.SHIP_ENUMS.VENTS_BASE,
			ventsOrdinanceCost: this.SHIP_ENUMS.VENTS_COST,
			fluxDissipation: fluxDissipation,
			fluxDissipationPerSingleActiveVent:
				this.SHIP_ENUMS.FLUX_CAPACITY_PER_SINGLE_ACTIVE,

			// CR
			crRecoveryPerDay: crDay,
			crDeploymentCost: cRToDeploy,
			crLossPerSecond: cRLossSec,
			deploymentCost: fleetPts,
			peakPerformanceSec: peakCRSec,

			// Ordinance Points
			ordinancePoints: this.SHIP_ENUMS.ORDINANCE_POINTS,
			maxOrdinancePoints: ordnancePoints,

			// Armour
			armor: armorRating,

			// Hull HP
			hitPoints: hitpoints,

			// Movement
			speed: maxSpeed,
			acceleration: acceleration,
			deceleration: deceleration,
			maxTurnRate: maxTurnRate,
			turnAcceleration: turnAcceleration,

			// Shield Type || Shield / Phase / No Shield
			shieldType: shieldType,
			shieldArc: shieldArc,
			shieldEfficiency: shieldEfficiency,
			shieldUpkeep: shieldUpkeep,

			// Phase
			phaseCost: phaseCost,
			phaseUpkeep: phaseUpkeep,

			// Systems
			systemId: systemId,
			defenseId: defenseId,

			// Fighter Bays
			fighterBays: fighterBays,

			// Logistical
			shipIsCivilian: this.isShipCivilian(additionalData.builtInMods),

			// Supplies
			suppliesPerMonth: suppliesMo,
			recoveryCost: suppliesRec,
			cargoCap: cargo,

			// Crew
			maxCrew: maxCrew,
			minCrew: minCrew,

			// Fuel
			fuelCap: fuel,
			shipBurn: maxBurn,
			fuelPerLY: fuelLy,

			// Weapon Slots
			weaponSlots: this.weaponSlotIdStringEdit(additionalData.weaponSlots),

			// Installed Weapons
			installedWeapons: this.injectCurrentShipSlotsIntoWeapons(
				additionalData.weaponSlots
			),
		};
	},
	injectCurrentShipSlotsIntoWeapons: function (weaponSlotInput) {
		return this.weaponSlotIdStringEdit(weaponSlotInput).map((wpn) => [
			wpn.id,
			"",
		]);
	},
	// Just replaces empty string with dash. it works
	weaponSlotIdStringEdit: function (weaponSlots) {
		return weaponSlots.map((slot) => ({
			...slot,
			id: slot.id.replace(/\s+/g, "-"),
		}));
	},
	isShipCivilian: function (builtInMods) {
		return builtInMods?.some((hullmod) => hullmod.id === "civgrade")
			? "civilian"
			: "military";
	},
};
