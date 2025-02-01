"use strict";
import {
	renameKeysFromCSVdata,
	convertStringsIntoNumbersCSVdata,
	extractDataFromObject,
} from "./helper/helperFunction.js";
import URL from "./helper/url.js";
import Papa from "papaparse";

// "astral"; "gryphon"; "drover"; "hound"; "ox"; "legion"; // pegasus // paragon // astral // legion // odyssey
const shipNameDev = "invictus";
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

			const userShipBuild = createUserShipBuild.controller(updatedCurrentShip);
			// HullMods
			const allHullMods = hullMods.createUsableHullMods(hullmods);
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

			this.updateState("dataState", {
				allShips: ships,
				allWeapons: filteredWeaponsWithAdditionalData,
				allWeaponSystems: weaponSystemsOnly,
				allHullMods: hullmods,
				allFighters: updatedFighters,
				allDescriptions: desc,
			});
			this.updateUserShipBuild(userShipBuild);
			this.updateState("userState", {
				_currentShip: updatedCurrentShip,
				_baseShipBuild: userShipBuild,
				usableHullMods: allHullMods,
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
		builtInMods,
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
};

// NOT USED BELOW THE LINE
//--------------------

const overwriteWeaponTypeWithForcedOverwrite = async function () {
	try {
		const newArray = state.allWeapons.map(
			(weapon) =>
				(weapon.additionalWeaponData.type = weapon.additionalWeaponData
					.mountTypeOverride
					? weapon.additionalWeaponData.mountTypeOverride
					: weapon.additionalWeaponData.type)
		);
		// console.log(newArray.filter((weapon) => weapon.additionalWeaponData.mountTypeOverride));
	} catch (err) {
		console.warn("overwriteWeaponTypeWithForcedOverwrite");
	}
};

const hullModDataInjection = {
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
		hullMods.forEach((hullMod) =>
			hullMod.name === hullModName
				? (hullMod.importedValues = regularValue)
				: ""
		),
	covertAndInjectMissingDescriptions() {
		this.textInjectionData.forEach((e) => {
			const [key] = Object.keys(e);
			const [value] = Object.values(e);
			this.injectTextIntoHullMod(state.usableHullMods, key, value);
		});
	},
	injectTextIntoHullMod: (hullMods, hullModNameToEdit, stringToParse) =>
		hullMods.forEach((hullMod) =>
			hullMod.name === hullModNameToEdit ? (hullMod.desc = stringToParse) : ""
		),
	updateUsableHullsDescriptionsWithInjectedData() {
		state.usableHullMods.forEach((hullMod) => {
			hullMod.importedValues === undefined ? console.log(hullMod) : "";
			if (hullMod.importedValues === undefined) return;
			const replacePlaceholders = (desc, values) => {
				values.forEach((value) => {
					desc = desc.replace(
						"%s",
						`<span class="highlight-text">${value}</span>`
					);
				});
				return desc;
			};
			hullMod.desc = replacePlaceholders(
				hullMod.desc,
				hullMod.importedValues[0]
			);
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
};
