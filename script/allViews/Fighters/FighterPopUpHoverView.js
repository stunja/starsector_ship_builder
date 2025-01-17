import View from "../view.js";
import classNames from "../../helper/DomClassNames.js";
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

	#processData() {
		const [weaponObject, weaponSlotObject, dataState] = this._data;

		const { opCost, roleDesc, range, num, refit } = weaponObject;
		const {
			description,
			displayName,
			maxCrew,
			hitpoints,
			armorRating,
			shieldType,
			shieldArc,
			systemId,
			maxSpeed,
			weaponGroups,
			hullMods,
		} = weaponObject.additionalData;

		// States

		this.#dataState = dataState;
		this.#allShips = dataState.allShips;
		this.#allWeaponSystems = dataState.allWeaponSystems;
		this.#allHullMods = dataState.allHullMods;
		// Weapon Object Data

		this.#opCost = opCost;
		this.#roleDesc = roleDesc;
		this.#range = range;
		this.#num = num;
		this.#refit = refit;

		// Weapon Additional Data

		this.#description = description;
		this.#displayName = displayName;
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
	}
	/* 

hullMods: Array [ "insulatedengine" ]
hullSize: "FIGHTER"
maxCrew: 2
maxSpeed: 130
name: "Warthog"
quality: 0.5
shieldArc: 0
shieldType: "NONE"
spriteName: "graphics/ships/fighters/warthog_lowtech.png"
style: "LOW_TECH"
systemId: "flarelauncher_fighter"
techManufacturer: "Low Tech"
variantId: "warthog_Fighter"
weaponGroups: Array [ {…}, {…} ]
weaponSlots: Array(3) [ {…}, {…}, {…} ]
		*/
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
			<li class="weapon-name">
				<p>Weapon Name</p>
				<p>${this.#displayName}</p>
			</li>
			<li class="${classNames.weaponDescription}">
				<p>${this.#descriptionShrink(this.#description)}</p>
			</li>
			`;
	}

	#primaryDataMarkup() {
		// prettier-ignore
		return `
				<div class="d-grid ${classNames.weaponPrimaryData}">
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
						${this.#contentMultyItems("HullMods",this.#createParagraph(this.#hullModsMarkUp(this.#hullMods, this.#allHullMods),true))}
					</div>
					<div class="${classNames.weaponContentGroup}">
						${this.#contentMultyItems("Armaments",
						this.#fighterWeaponsMarkUp(this.#weaponGroups,this.#allShips))}
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
		if (!hullMods || hullMods?.length < 1) return EMPTY_PROP_STRING;

		return hullMods.map((hullMod) => {
			const extractedHullMod = allShipHulls.find((mod) => mod.id === hullMod);
			return extractedHullMod?.name || EMPTY_PROP_STRING;
		});
	}
	#fighterWeaponsMarkUp(weaponGroups, allWeapons) {
		// Find Object
		// const fighterWeapons = weaponGroups.flatMap((obj) =>
		// 	Object.values(obj.weapons)
		// );
		const fighterWeapons = weaponGroups.flatMap((obj) =>
			Object.values(obj.weapons)
		);
		// const test = allWeapons.find(wpn=>wpn.id === fighterWeapons)
		const test = fighterWeapons.filter((wpnGrpProp) => {
			return allWeapons.filter((wpn) => wpn.id === wpnGrpProp.id);
		});
		// console.log(test);
	}
}
export default new FighterPopUpHoverView();
