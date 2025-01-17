import View from "../view.js";
import classNames from "../../helper/DomClassNames.js";
import { weaponSlotIdIntoWeaponSlotObject } from "../../helper/helperFunction.js";
// View
import URL from "../../helper/url.js";

const ALT_TEXT = {
	WEAPON_DAMAGE_TYPE: "weapon damage type",
};
const WEAPON_SYSTEMS = {
	FLARE_LAUNCHER_OLD: "flarelauncher_fighter",
	FLARE_LAUNCER_NEW: "flarelauncher2",
};
const EMPTY_PROP_STRING = "[x]";

class FighterPopUpHoverView extends View {
	_localParent = `.${classNames.hoverContainer}`;

	// Weapon Object props
	#opCost;
	#num;
	#roleDesc;
	#range;
	#refit;

	// Weapon Object Additional Dat
	#description;
	#displayName;
	#maxCrew;
	#hitpoints;
	#armorRating;
	#shieldType;
	#shieldArc;
	#maxSpeed;
	#systemId;
	#weaponGroups;
	#hullMods;

	#dataState;
	#allShips;
	#allHullMods;
	#allWeaponSystems;
	#allWeapons;
	#techManufacturer;
	#name;

	#processData() {
		const [weaponObject, weaponSlotObject, dataState] = this._data;

		const { opCost, roleDesc, range, num, refit } = weaponObject;
		const {
			description,
			displayName,
			name,
			maxCrew,
			hitpoints,
			armorRating,
			shieldType,
			shieldArc,
			systemId,
			maxSpeed,
			weaponGroups,
			hullMods,
			techManufacturer,
		} = weaponObject.additionalData;

		// States

		this.#dataState = dataState;
		this.#allShips = dataState.allShips;
		this.#allWeaponSystems = dataState.allWeaponSystems;
		this.#allWeapons = dataState.allWeapons;
		this.#allHullMods = dataState.allHullMods;
		// Weapon Object Data

		this.#opCost = opCost;
		this.#roleDesc = roleDesc;
		this.#range = range;
		this.#num = num;
		this.#refit = refit;
		// Weapon Additional Data

		this.#description = description;
		// not the same
		this.#displayName = displayName;
		this.#name = name;

		this.#maxCrew = maxCrew;
		this.#roleDesc = roleDesc;
		this.#hitpoints = hitpoints;
		this.#armorRating = armorRating;
		this.#shieldType = shieldType;
		this.#shieldArc = shieldArc;
		this.#maxSpeed = maxSpeed;
		this.#systemId = systemId;
		this.#weaponGroups = weaponGroups;
		this.#hullMods = hullMods;
		this.#techManufacturer = techManufacturer;
	}

	generateMarkup() {
		this.#processData(this._data);
		const markup = `	
			<ul>
				${this.#introDataMarkup()}
				<li class="weapon-divider"><p>Primary Data</p></li>
				${this.#primaryDataMarkup()}
			</ul>
		`;
		return markup;
	}
	#introDataMarkup() {
		return `
			${this.#contentMarkup("Weapon Name", this.#name + " - " + this.#displayName)}
			${this.#contentMarkup("Design Type", this.#techManufacturer)}
			${this.#contentMarkup("", this.#descriptionShrink(this.#description))}
			`;
	}

	#primaryDataMarkup() {
		// prettier-ignore
		return `
				<div class="${classNames.dFlex} ${classNames.weaponPrimaryData}">
					<div class="${classNames.weaponContentGroup}">
	                 ${this.#contentMarkup("Primary Role", this.#roleDesc)}
	                 ${this.#contentMarkup("Ordnance Points", this.#opCost)}
	                 ${this.#contentMarkup("Crew per Fighter", this.#maxCrew)}
	                 ${this.#contentMarkup("Maximum engagement range", this.#range)}
	             </div>
					<div class="${classNames.weaponContentGroup}">
						${this.#contentMarkup("Fighters in wing", this.#num)}
						${this.#contentMarkup("Base replacement time (seconds)",this.#refit)}
						${this.#contentMarkup("Hull integrity", this.#hitpoints)}
						${this.#contentMarkup("Armor rating", this.#armorRating)}
					</div>
					<div class="${classNames.weaponContentGroup}">
						${this.#shieldType !== "NONE"
						? `${this.#contentMarkup("Shield Type", this.#shieldType)}
							${this.#contentMarkup("Shield Arc", this.#shieldArc)}`
						: ""
						}
						${this.#contentMarkup("Top speed", this.#maxSpeed)}
						${this.#contentMarkup("System",this.#fighterSystemMarkup(this.#systemId, this.#allWeaponSystems))}
						${this.#contentMultyItems("HullMods",this.#hullModsMarkUp(this.#hullMods, this.#allHullMods))}
					</div>
					<div class="${classNames.weaponContentGroup}">
						${this.#contentMultyItems("Armaments",this.#fighterWeaponsMarkUp(this.#weaponGroups,this.#allWeapons, this.#allWeaponSystems))}
					</div>
				</div>`;
	}
	#contentMarkup = (str, data) => {
		return `
				<li>
					${str !== "" ? `<p>${str}</p>` : ""}
					<strong><p>${data}</p></strong>
				</li>`;
	};
	#contentMultyItems(str, data) {
		return `
				<li>
					${this.#createParagraph(str)}
					<div class="${classNames.fighterFlexColumn}">
						${data}
					</div>
				</li>`;
	}
	#createParagraph(text, isStrong = false) {
		return isStrong ? `<strong><p>${text}</p></strong>` : `<p>${text}</p>`;
	}
	// Shorten description to first sentence
	#descriptionShrink(description) {
		return description.split(".").at(0) + ".";
	}

	// Find weapon or system name by ID
	#fighterSystemMarkup(systemId, allWeaponSystems) {
		if (!systemId || systemId === "") return EMPTY_PROP_STRING;

		// Replace Old launcer with new, because old is not even a system for some reason.
		const checkSystemId =
			systemId === WEAPON_SYSTEMS.FLARE_LAUNCHER_OLD
				? WEAPON_SYSTEMS.FLARE_LAUNCER_NEW
				: systemId;

		const systemObject = allWeaponSystems.find(
			(obj) => obj.id === checkSystemId
		);
		return systemObject?.name || EMPTY_PROP_STRING;
	}

	#hullModsMarkUp(hullMods, allShipHulls) {
		if (!hullMods || hullMods?.length < 1)
			return this.#createParagraph(EMPTY_PROP_STRING, true);

		return hullMods
			.map((hullMod) => {
				const extractedHullMod = allShipHulls.find((mod) => mod.id === hullMod);
				const finalString = extractedHullMod?.name || EMPTY_PROP_STRING;
				return this.#createParagraph(finalString, true);
			})
			.join("");
	}
	#fighterWeaponsMarkUp(weaponGroups, allWeapons, allWeaponSystems) {
		const fighterWeapons = weaponGroups.flatMap((obj) =>
			Object.values(obj.weapons)
		);
		const checkDublicates = (arr) => {
			return Object.entries(
				arr.reduce((acc, val) => {
					acc[val] = (acc[val] || 0) + 1;
					return acc;
				}, {})
			);
		};
		return checkDublicates(fighterWeapons)
			.map(([key, value]) => {
				// find the object
				const keyProperName = weaponSlotIdIntoWeaponSlotObject(allWeapons, key);
				// My bad, on splitting weapon array into two arrays
				// Check if exists in one array, if not check other array
				const lookWeaponInWeaponSystem = keyProperName
					? keyProperName.name
					: allWeaponSystems.find((wpnSys) => wpnSys.id === key).name;
				// If Number of dublicates is larger than one (1) use special string, otherwise, hide
				const valueString = value > 1 ? `${value}x : ` : "";

				// Join Strings
				return this.#createParagraph(
					`${valueString}${lookWeaponInWeaponSystem}`,
					true
				);
			})
			.join("");
	}
}
export default new FighterPopUpHoverView();
