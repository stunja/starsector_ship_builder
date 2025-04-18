"use strict";
import {
	renameKeysFromCSVdata,
	convertStringsIntoNumbersCSVdata,
	extractDataFromObject,
} from "./helper/helperFunction.js";
import URL from "./helper/url.js";
import { HULLMODS_DATA } from "./components/Hullmods/HullModData.js";
import Papa from "papaparse";

import { SHIELD_TYPE } from "./helper/Properties.js";

// "astral"; "gryphon"; "drover"; "hound"; "ox"; "legion"; // pegasus // paragon // astral // legion // odyssey
const shipNameDev = "invictus"; // hound // venture

// invictus // astral // grendel // atlas // colussus // venture // falcon // legion // Conquest
// paragon // hound // gryphon // shepherd // Hammerhead // monitor
// gryphon = cruiser
// destroyer = condor
// hound = frigate // centurion
// Phase = harbinger / doom // shade
// Civilian = shepherd
// no shield (hound)
//! fulgent = automated ship
// ziggurat
// monitor
// valkyrie

// monitor //! Check later, issue with weapon slots
// !venture fix fighter Slots, it should be build in\
// !phantom issue
// drover

//! Colossus Mk.III can't even search

// 0.98a
// executor

export class Model {
	dataState = {
		allShips: [],
		allWeapons: [],
		allWeaponSystems: [],
		allHullMods: [],
		allFighters: [],
	};
	userState = {
		_currentShip: {},
		userShipBuild: {},
		usableHullMods: [],
	};
	uiState = {
		isLoading: false,
		weaponPopUp: {
			isWeaponPopUpOpen: false,
			currentCategory: null,
			isAscending: true,
		},
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
	updateUserShipBuild(newUserShipBuild) {
		this.updateState("userState", {
			userShipBuild: newUserShipBuild,
		});
	}
	updateWeaponPopUpState(newState) {
		this.updateState("uiState", {
			weaponPopUp: newState,
		});
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

			// HullMods
			const allHullMods = hullMods.createUsableHullMods(hullmods);
			const hullModsWithEffectValues =
				hullMods.injectHullModEffectValueData(allHullMods);

			// Weapons
			const weaponOnly = this.#filterWeaponsOnly(weapons);
			const weaponSystemsOnly = this.#filterWeaponSystems(weapons);
			const filteredWeaponsWithAdditionalData =
				await additionalWeaponData.fetchAndInjectData(weaponOnly, desc);
			// Fighters
			const updatedFighters = await updateFighters.fetchAndInjectData(
				fighters,
				desc,
				ships
			);

			// UserShipBuild
			const userShipBuild = createUserShipBuild.controller(updatedCurrentShip);
			const userShipBuildBuildInHullMods = hullMods.updateBuiltInHullMods(
				userShipBuild,
				hullModsWithEffectValues
			);
			const finalUserShipBuild = hullMods.checkIfAutomatedShip(
				userShipBuildBuildInHullMods
			);

			this.updateState("dataState", {
				allShips: ships,
				allWeapons: filteredWeaponsWithAdditionalData,
				allWeaponSystems: weaponSystemsOnly,
				allHullMods: hullmods,
				allFighters: updatedFighters,
				allDescriptions: desc,
			});
			this.updateUserShipBuild(finalUserShipBuild);
			this.updateState("userState", {
				_currentShip: updatedCurrentShip,
				_baseShipBuild: finalUserShipBuild,
				usableHullMods: hullModsWithEffectValues,
			});
		} catch (err) {
			console.log(`Failed to Load Resources ${err}`);
		} finally {
			this.updateState("uiState", { isLoading: false });
		}
	}
	#weaponIsNotSystem = (wpn) => {
		if (!wpn?.hints) return true;

		const hasSystemTag = wpn.hints.split(",").find((hint) => hint === "SYSTEM");

		return !hasSystemTag;
	};
	#filterWeaponSystems = (weaponsArray) =>
		weaponsArray.filter((weapon) => !this.#weaponIsNotSystem(weapon));

	#filterWeaponsOnly = (weaponsArray) =>
		weaponsArray.filter(
			(weapon) => this.#weaponIsNotSystem(weapon) && weapon.id
		);
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
const additionalWeaponData = {
	// There a much more props in the file, from sounds / colors / additional positions
	KEYS_TO_INJECT: [
		"size",
		"specClass",
		"turretSprite",
		"type",
		"turretGunSprite",
		"turretOffsets",
		"mountTypeOverride",
	],

	// This function is very particular regex. DONT CHANGE.
	// I am trying to fix broken JSON-like file into a proper JSON.
	// Trial and Error approach
	cleanWeaponData(dirtyData) {
		const cleaningSteps = [
			// Remove comments
			(data) => data.replace(/#.*$/gm, ""),
			// Fix trailing commas
			(data) => data.replace(/,(\s*[}\]])/g, "$1"),
			// Quote unquoted keys
			(data) => data.replace(/(?<!":\s)(\b[A-Za-z]+\b)(?=\s*[:,])/g, '"$1"'),
			// Process arrays and quote non-numeric values
			(data) =>
				data.replace(
					/\[(.+?)\]/g,
					(_match, contents) =>
						`[${contents
							.split(",")
							.map((item) => {
								const trimmed = item.trim();
								return isNaN(trimmed) ? `"${trimmed}"` : trimmed;
							})
							.join(",")}]`
				),
			// Final cleanup
			(data) =>
				data.replace(/""/g, '"').replace(/;/g, ",").replace(/:",/g, ':"",'),
		];

		return cleaningSteps.reduce((data, step) => step(data), dirtyData);
	},
	async processWeapon(weaponObject, allDescriptions) {
		try {
			const dirtyData = await jsonFetcher.fetchData(
				`/${URL.DATA_WEAPONS}/${weaponObject.id}.wpn`
			);
			const cleanData = this.cleanWeaponData(dirtyData);
			const jsonData = JSON.parse(cleanData);
			const createAdditionalDataObject = extractDataFromObject(
				this.KEYS_TO_INJECT,
				jsonData
			);

			const injectAdditionalDescriptions = await this.injectWeaponDescriptions(
				weaponObject,
				createAdditionalDataObject,
				allDescriptions
			);

			return {
				...weaponObject,
				additionalData: injectAdditionalDescriptions,
			};
		} catch (err) {
			console.error(`Error processing weapon ${weaponObject.id}:`, err);
			return weaponObject;
		}
	},
	async injectWeaponDescriptions(
		weaponObject,
		additionalData,
		allDescriptions
	) {
		try {
			const descriptionObject = allDescriptions.find(
				(desc) => desc.id === weaponObject.id
			);

			// if (!descriptionObject) return additionalData;
			if (!descriptionObject) throw new Error("missing description");

			const unitedString = () => {
				return (
					descriptionObject.text1 +
					descriptionObject.text2 +
					descriptionObject.text3 +
					descriptionObject.text4
				)
					.replaceAll("\r", "")
					.replaceAll("\n", "");
			};

			return {
				...additionalData,
				description: unitedString(),
			};
		} catch (err) {
			// console.warn("injectWeaponDescriptions", err);
			return additionalData;
		}
	},
	fetchAndInjectData: async function (allWeapons, allDescriptions) {
		return Promise.all(
			allWeapons.map((weaponObject) =>
				this.processWeapon(weaponObject, allDescriptions)
			)
		);
	},
};

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
	// Not ideal implementation, but I needed a reference for all default props
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
		const weaponObject = {
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
				this.SHIP_ENUMS.FLUX_DISSIPATION_PER_SINGLE_ACTIVE,

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
			shieldType: this.correctShieldType(shieldType, phaseCost, phaseUpkeep),
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
			fighterBays: Number.isFinite(fighterBays) ? fighterBays : 0,

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

			// Installed Weapons
			installedWeapons: this.injectCurrentShipSlotsIntoWeapons(
				additionalData.weaponSlots
			),
		};

		// Combine everything
		const weaponObjectWithAdditionalData = {
			...weaponObject,
			...this.addAdditionalData(additionalData),
		};
		return {
			...weaponObjectWithAdditionalData,
			...this.addDataBasedOnShipHullSize(
				weaponObjectWithAdditionalData.hullSize
			),
		};
	},
	addAdditionalData({
		center,
		height,
		viewOffset,
		width,
		spriteName,
		builtInMods = [],
		builtInWings = null,
		hullSize,
		weaponSlots,
	}) {
		// Add Additional Data
		return {
			secondaryData: {
				center,
				height,
				viewOffset,
				width,
				spriteName,
				builtInWings,
			},
			hullMods: { builtInMods, installedHullMods: [] },
			hullSize,
			weaponSlots: this.weaponSlotIdStringEdit(weaponSlots),
		};
	},
	// Add data maxVentbased on HULLSIZE
	// maxVents / maxCapacitors / sensorProfile / sensorStrength
	addDataBasedOnShipHullSize(hullSize) {
		//? hullSize in specific shipHull file don`t match hullSize cost in hullMods
		// import for hullMods cost calc
		const propertyNames = [
			"maxVents",
			"maxCapacitors",
			"sensorProfile",
			"sensorStrength",
		];
		const hullSizeProperties = {
			CAPITAL_SHIP: [50, 50, 150, 150],
			CRUISER: [30, 30, 90, 90],
			DESTROYER: [20, 20, 60, 60],
			FRIGATE: [10, 10, 30, 30],
		};

		const hullSizeData = () => {
			const values = hullSizeProperties[hullSize];
			return Object.fromEntries(
				propertyNames.map((name, index) => [name, values[index]])
			);
		};

		return hullSizeData();
	},
	injectCurrentShipSlotsIntoWeapons(weaponSlotInput) {
		return this.weaponSlotIdStringEdit(weaponSlotInput).map((wpn) => [
			wpn.id,
			"",
		]);
	},
	// Just replaces empty string with dash. it works
	weaponSlotIdStringEdit(weaponSlots) {
		return weaponSlots.map((slot) => ({
			...slot,
			id: slot.id.replace(/\s+/g, "-"),
		}));
	},
	isShipCivilian(builtInMods) {
		return builtInMods?.some((hullmod) => hullmod.id === "civgrade")
			? "civilian"
			: "military";
	},
	correctShieldType(shieldType, phaseCost, phaseUpkeep) {
		const hasNoCostOrNoUpkeep =
			!Number.isFinite(phaseCost) || !Number.isFinite(phaseUpkeep);

		if (shieldType === SHIELD_TYPE.PHASE && hasNoCostOrNoUpkeep)
			return SHIELD_TYPE.NONE;

		return shieldType;
	},
};
const updateFighters = {
	// There a much more props in the file,
	KEYS_TO_INJECT: [
		"height",
		"spriteName",
		"width",
		"hullSize",
		"style",
		"weaponSlots",
	],

	// I need a different name
	// Additional properties take from AllShips CVS
	//! extract from allShips
	KEYS_TO_EXTRACT_FROM_ALLSHIPS: [
		"shieldType",
		"techManufacturer",
		"shieldArc",
		"armorRating",
		"hitpoints",
		"name",
		"maxCrew",
		"systemId",
		"maxSpeed",
	],
	async processWeapon(fighterObject, allDescriptions, allShips) {
		try {
			const convertedFighterId = this.convertIdToDifferentIdSpecialRule(
				this.updatedId(fighterObject)
			);

			const fetchData = await jsonFetcher.fetchData(
				`/${URL.DATA_HULLS}/${convertedFighterId}.ship`
			);

			const jsonData = JSON.parse(fetchData);

			const createAdditionalDataObject = extractDataFromObject(
				this.KEYS_TO_INJECT,
				jsonData
			);

			// Add Descriptions to Addtional Data
			const arrayWithDescriptions = this.injectFighterDescriptions(
				fighterObject,
				createAdditionalDataObject,
				allDescriptions
			);
			// Add data from AllShips to Additional Data
			const arrayWithFighterHullData = this.injectFighterHullData(
				convertedFighterId,
				arrayWithDescriptions,
				allShips
			);
			const finalArray = await this.injectVariantData(
				fighterObject,
				arrayWithFighterHullData
			);

			return {
				...fighterObject,
				additionalData: finalArray,
			};
		} catch (err) {
			console.error(`Error processing weapon ${fighterObject.id}:`, err);
			return fighterObject;
		}
	},
	fetchAndInjectData: async function (allFighters, allDescriptions, allShips) {
		return Promise.all(
			this.cleanedArray(allFighters).map((weaponObject) =>
				this.processWeapon(weaponObject, allDescriptions, allShips)
			)
		);
	},
	// Helper functions
	// id mismatch between shipData and Fighter Data
	// Fighters are not identical to allWeapons
	updatedId: (fighterObject) => fighterObject.id.replaceAll("_wing", ""),

	// for some reason different id from others, I have to overwrite manually
	convertIdToDifferentIdSpecialRule: (fighterId) => {
		if (fighterId === "borer") {
			return (fighterId = "drone_borer");
		}
		if (fighterId === "terminator") {
			return (fighterId = "drone_terminator");
		}
		return fighterId;
	},
	cleanedArray: (data) => {
		// fighters are not important anyway (ALPHA REDACTED)
		const IGNORE_FIGHTER_ID = {
			aspect_shock_wing: "aspect_shock_wing",
			aspect_shieldbreaker_wing: "aspect_shieldbreaker_wing",
			aspect_attack_wing: "aspect_attack_wing",
			aspect_missile_wing: "aspect_missile_wing",
		};
		try {
			const keysToRemove = [
				"_1",
				"_2",
				"_3",
				"_4",
				"_5",
				"_6",
				"_7",
				"_8",
				"_9",
				"_10",
				"_11",
			];
			const removeEmptyObjects = data.filter((obj) => obj.id);

			const removeIgnoredFighterObjects = removeEmptyObjects.filter((obj) => {
				if (!IGNORE_FIGHTER_ID[obj.id]) return obj;
			});

			const removeBrokenKeysArray = removeIgnoredFighterObjects.map((obj) =>
				Object.fromEntries(
					Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
				)
			);
			return removeBrokenKeysArray;
		} catch (err) {
			console.log("Error with Cleaning of Fighter Data", err);
		}
	},
	injectFighterDescriptions(fighterObject, additionalData, allDescriptions) {
		try {
			const convertedFighterId = this.convertIdToDifferentIdSpecialRule(
				this.updatedId(fighterObject)
			);

			const descriptionObject = allDescriptions.find(
				(desc) => desc.id === convertedFighterId
			);

			if (!descriptionObject) throw new Error("missing description");

			const unitedString = () => {
				return (
					descriptionObject.text1 +
					descriptionObject.text2 +
					descriptionObject.text3 +
					descriptionObject.text4
				)
					.replaceAll("\r", "")
					.replaceAll("\n", "");
			};

			return {
				...additionalData,
				description: unitedString(),
			};
		} catch (err) {
			console.warn("injectFighterDescriptions", err);
			return additionalData;
		}
	},
	injectFighterHullData(fighterId, data, allShips) {
		const findCorrectHull = allShips.find((ship) => ship.id === fighterId);
		const extractedData = extractDataFromObject(
			this.KEYS_TO_EXTRACT_FROM_ALLSHIPS,
			findCorrectHull
		);
		return { ...data, ...extractedData };
	},
	async injectVariantData(fighterObject, data) {
		//? WHY THE DATA IS IN VARIANTS/FIGHTERS I HAVE NOT IDEA
		//? WHY ARE SOME IN DIFFERENT FOLDERS
		//? WHY FLASH IS IN REMNANT
		//? HOPLON IS KOPESH (OLD NAME)
		const SPECIAL_RULES = {
			drone_borer: URL.DATA_VARIANTS_DRONES,
			drone_terminator: URL.DATA_VARIANTS_DRONES,
			flash_Bomber: URL.DATA_VARIANTS_REMNANT,
			spark_Interceptor: URL.DATA_VARIANTS_REMNANT,
			lux_Fighter: URL.DATA_VARIANTS_REMNANT,
		};
		const cleanToJson = (fileContent) => {
			fileContent = fileContent.replace(/#.*$/gm, ""); // Remove inline comments
			fileContent = fileContent.replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas
			fileContent = fileContent.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":'); // Add quotes around keys

			return fileContent;
		};
		const variantTargeting = (fighterObject) => {
			// hoplon_Escort => kopesh_Bomber // Why I dont know it doesn`t match
			return fighterObject.variant === "hoplon_Escort"
				? "khopesh_Bomber"
				: fighterObject.variant;
		};
		const convertedURL = (urlCheck, fighterVariant) => {
			if (urlCheck === undefined) {
				return `/${URL.DATA_VARIANTS_FIGHTERS}/${fighterVariant}.variant`;
			}
			return `/${urlCheck}/${fighterVariant}.variant`;
		};
		try {
			const variantId = variantTargeting(fighterObject);
			const fetchedData = await jsonFetcher.fetchData(
				convertedURL(SPECIAL_RULES[variantId], variantId)
			);
			const cleanedData = cleanToJson(fetchedData);
			const variantData = JSON.parse(cleanedData);

			return {
				...data,
				...variantData,
			};
		} catch (err) {
			console.log(`${err} in injectVariantData`);
		}
	},
};

// create new object with VISIBLE and DEFINED hulls. // D-mods are hidden!
const hullMods = {
	createUsableHullMods(data) {
		// Alphabetic Sorting
		const filteredData = data
			.filter((hullmod) => hullmod.id)
			.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

		return this.updateMissingDescriptions(filteredData);
	},
	updateMissingDescriptions(data) {
		return data.map((obj) => {
			const newString = this.textInjectionData[obj.id];
			if (!newString) return obj;
			return { ...obj, desc: newString };
		});
	},
	textInjectionData: {
		ballistic_rangefinder:
			"If the largest Ballistic slot on the ship is large: increases the base range of small weapons in Ballistic slots by %s, and of medium weapons by %s, up to a maximum of %s range. Otherwise: increases the base range of small weapons in Ballistic slots by %s, up to %s maximum. Does not affect point-defense weapons or Ballistic weapons placed in Composite, Hybrid or Universal slots. Hybrid weapons in Ballistic slots receive double the bonus. Non-PD Hybrid weapons in ballistic slots, including large ones, will receive %s bonus range, subject to the maximum, in cases where other weapons of the same size would receive no bonus.",

		converted_hangar:
			"Converts the ship's standard shuttle hangar to house a fighter bay. The improvised flight deck, its crew, and the related machinery function at a pace below that of a dedicated carrier. Increases fighter refit time by %sx, and the fighter replacement rate both decays and recovers %sx more slowly. In addition, bombers returning to rearm (or fighters returning to repair) take %s% of their base time to relaunch, where it normally takes under a second. Increases the minimum crew by %s to account for pilots and fighter crews. Increases the ship's deployment points and supply cost to recover from deployment by %s for every %s ordnance points spent on fighters, or by at least %s point. This comes with a proportional increase in combat readiness lost per deployment.",

		missile_autoloader:
			"A combat-rated autoloader that provides a limited number of reloads to missile weapons installed in small missile mounts. Does not affect weapons that do not use ammo or already regenerate it, or weapons that are mounted in any other kind of weapon slot. The number of missiles reloaded is not affected by skills or hullmods that increase missile weapon ammo capacity. A partial reload is possible when running out of capacity. After a reload, the weapon requires an extra 5 seconds, in addition to its normal cooldown, before it can fire again.",

		high_scatter_amp:
			"Beam weapons deal %s more damage and deal hard flux to shields. Reduces the portion of the range of beam weapons that is above %s units by %s. The base range is affected. Interactions with other modifiers: The base range is reduced, thus percentage and multiplicative modifiers - such as from Integrated Targeting Unit, skills, or similar sources - apply to the reduced base value.",

		hiressensors:
			"Increases sensor strength by %s/%s/%s/%s points for frigates / destroyers / cruisers and capitals, respectively. Minimum CR of %s required to function.",

		neural_interface: `Links the flagship with another ship, allowing switching between ships without using a shuttle pod. Both ships must have a neural interface and not be commanded by officers or AI cores. The transfer is instant if the combined deployment points of the linked ships are %s or less. If the linked ship is destroyed or leaves the battlefield, the flagship will establish a neural link with another ship with a Neural Interface. If the flagship is destroyed or leaves the battlefield, command will have to be physically transferred to another ship with a Neural Interface before a new link can be established. Both linked ships benefit from your personal combat skills as if you had transferred command to them, regardless of which one you are controlling personally. As with "transfer command", some skill effects - such as those increasing ammo capacity or another fixed ship stat - do not apply.`,

		neural_integrator: `An augmented version of Neural Interface that works with automated ships by enabling direct control of all of the ship's systems via the link, instead of having the controlling consciousness aspect simply direct the bridge crew. Links the flagship with another ship, allowing switching between ships without using a shuttle pod. Both ships must have a neural interface and not be commanded by officers or AI cores. The transfer is instant if the combined deployment points of the linked ships are %s or less. If the linked ship is destroyed or leaves the battlefield, the flagship will establish a neural link with another ship with a Neural Interface. If the flagship is destroyed or leaves the battlefield, command will have to be physically transferred to another ship with a Neural Interface before a new link can be established. Both linked ships benefit from your personal combat skills as if you had transferred command to them, regardless of which one you are controlling personally. As with "transfer command", some skill effects - such as those increasing ammo capacity or another fixed ship stat - do not apply. Also increases the deployment cost and supply use by %s`,
	},
	injectHullModEffectValueData: (data, hullModsData = HULLMODS_DATA) => {
		if (!Array.isArray(data)) {
			throw new Error("Input must be an array");
		}

		return data.map(({ name, ...hullMod }) => {
			const values = hullModsData[name];

			if (!values) return { ...hullMod, name };

			const [regularValues = {}, sModsValues = {}] = values;

			return {
				...hullMod,
				name,
				effectValues: { regularValues, sModsValues },
			};
		});
	},
	updateBuiltInHullMods: (userShipBuild, hullMods) => {
		const builtInMods = userShipBuild.hullMods.builtInMods;

		const newBuildInMods = builtInMods.map((hullModId) =>
			hullMods.find(({ id }) => id === hullModId)
		);
		const newHullMods = {
			...userShipBuild.hullMods,
			builtInMods: newBuildInMods,
		};
		return { ...userShipBuild, hullMods: newHullMods };
	},
	addBuildInHullModsEffect: (data) => {
		console.log("test");
		console.log(data);
	},

	checkIfAutomatedShip: (data) => {
		const { builtInMods } = data.hullMods;
		const hullModId = "automated";
		const isAutomated = builtInMods.some(({ id }) => id === hullModId);
		return { ...data, isAutomated };
	},
};
