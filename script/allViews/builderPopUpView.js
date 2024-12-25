import View from "../allViews/view.js";
import * as URL from "../helper/url.js";

class BuilderPopUpView extends View {
	#data;
	#filteredArray;
	#currentSelectedFilter = "all";
	// for reference only, empty before FIRST assignment
	constructor() {
		super();
	}
	#parentElement = document.querySelector(".pop-up");
	#filterParent = document.querySelector(
		".hullmod-menu__header__buttons--wrapper"
	);
	//
	masterRender(data) {
		if (!this.#data) this.#data = data;
		if (!this.#parentElement) this.#assignParentElement();
		if (!this.#filteredArray) this.filterArrayAccordingToSelectedFilterTag();

		// render
		this.render();
	}
	render() {
		const markup = this.#markupFunction();

		this.clearRender(this.#parentElement);
		this.#parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	removeRender() {
		this.clearRender(this.#parentElement);
	}
	// Hull Mod List Related
	#hullModList() {
		if (!this.#filteredArray) return;
		const twoArrays = this.#sortHullModArray(this.#filteredArray);
		const markup = this.#hullModListMarkUp(twoArrays);
		return markup;
	}

	#sortHullModArray(inputArray) {
		const { currentShipBuild } = this.#data;
		const goodArray = [];
		const badArray = [];

		const shipHasShield = currentShipBuild.currentShipType === "shieldShip";
		const phaseShip = currentShipBuild.currentShipType === "phaseShip";
		const shipHasFighterBays = currentShipBuild.currentFighterBays > 0;

		// Map for prioritizing conditions!!
		const rules = new Map([
			[
				"Already Build In",
				(hullMod) =>
					currentShipBuild.hullMods.buildInHullMods?.some(
						(buildIn) => buildIn.id === hullMod.id
					),
			],

			this.#hullModIncompatibilityDueToShipSize(
				"Ballistic Rangefinder",
				"frigate"
			),
			// High Scatter Amplifier
			this.#hullModIncompatibilityCheckAgainstSpecificActiveHullMod(
				"Advanced Optics",
				"High Scatter Amplifier"
			),
			// Advanced Optics
			this.#hullModIncompatibilityCheckAgainstSpecificActiveHullMod(
				"High Scatter Amplifier",
				"Advanced Optics"
			),
			// Integrated Targeting Unit
			this.#hullModIncompatibilityCheckAgainstSpecificActiveHullMod(
				"Dedicated Targeting Core",
				"Integrated Targeting Unit"
			),
			[
				"Incompatible with [Distributed Fire Control]",
				(hullMod) =>
					(hullMod.name === "Integrated Targeting Unit" &&
						this.#checkIfSelectedHullModIsBuildIn(
							"Distributed Fire Control"
						)) ||
					(hullMod.name === "Dedicated Targeting Core" &&
						this.#checkIfSelectedHullModIsBuildIn("Distributed Fire Control")),
			],

			// Dedicated Targeting Core
			this.#hullModIncompatibilityCheckAgainstSpecificActiveHullMod(
				"Integrated Targeting Unit",
				"Dedicated Targeting Core"
			),

			[
				"Only accessible on cruiser or capital type ship",
				(hullMod) =>
					(hullMod.name === "Dedicated Targeting Core" &&
						currentShipBuild.shipSize === "frigate") ||
					(hullMod.name === "Dedicated Targeting Core" &&
						currentShipBuild.shipSize === "destroyer"),
			],
			// Advanced Targeting Core
			[
				"Incompatible with [Advanced Targeting Core]",
				(hullMod) =>
					(hullMod.name === "Integrated Targeting Unit" &&
						this.#checkIfSelectedHullModIsBuildIn("Advanced Targeting Core")) ||
					(hullMod.name === "Dedicated Targeting Core" &&
						this.#checkIfSelectedHullModIsBuildIn("Advanced Targeting Core")),
			],
			// Escore Package
			this.#hullModIncompatibilityDueToShipSize("Escort Package", "frigate"),
			this.#hullModIncompatibilityDueToShipSize("Escort Package", "capital"),
			// Safety Overrides
			this.#hullModIncompatibilityDueToShipSize("Safety Overrides", "capital"),
			[
				"Not allowed on Civilian Ship",
				(hullMod) =>
					hullMod.name === "Safety Overrides" &&
					currentShipBuild.currentShipIsCivilian === "civilian",
			],
			[
				"Incompatible with [Flux Shunt]",
				(hullMod) =>
					hullMod.name === "Safety Overrides" &&
					this.#checkIfSelectedHullModIsBuildIn("Flux Shunt"),
			],
			// Neural Integrator

			[
				"Only on Automated Ships, [not implemented]",
				(hullMod) => hullMod.name === "Neural Integrator",
			],
			// Fighter Bays
			[
				"Ship has no BUILD-IN fighter bays",
				(hullMod) =>
					hullMod.name === "Converted Fighter Bay" &&
					!currentShipBuild._buildInFighterBays,
			],
			// Converted Hangar

			this.#hullModIncompatibilityDueToShipSize("Converted Hangar", "frigate"),
			[
				"Not Allowed on [Phase Ship]",
				(hullMod) => hullMod.name === "Converted Hangar" && phaseShip,
			],
			[
				"Not Allowed on Ships with BUILD-In fighter bays",
				(hullMod) =>
					hullMod.name === "Converted Hangar" &&
					currentShipBuild._buildInFighterBays,
			],

			// Generic Fighter Bay check
			[
				"Ship has no fighter bays",
				(hullMod) =>
					hullMod.uiTagsArray.some((e) => e === "Fighters") &&
					!shipHasFighterBays &&
					hullMod.name !== "Converted Hangar",
			],
			// Logistical Tag
			[
				"Can`t add more than 2 Logistical Hull Mods",
				(hullMod) =>
					hullMod.uiTagsArray.some((e) => e === "Logistics") &&
					this.#checkIfMoreThanTwoLogiModsAlreadyInstalled(),
			],
			// Phase Tag
			[
				"Incompatible with [Phase Anchor]",
				(hullMod) =>
					hullMod.name === "Adaptive Phase Coils" &&
					this.#checkIfSelectedHullModIsAlreadyActive("Phase Anchor"),
			],
			[
				"Incompatible with [Adaptive Phase Coils]",
				(hullMod) =>
					hullMod.name === "Phase Anchor" &&
					this.#checkIfSelectedHullModIsAlreadyActive("Adaptive Phase Coils"),
			],
			[
				"Not a Phase ship",
				(hullMod) =>
					hullMod.uiTagsArray.some((e) => e === "Phase") && !phaseShip,
			],

			// Shield Tag
			// shield shunt
			[
				"Incompatible with Makeshift Shield Generator",
				(hullMod) =>
					hullMod.name === "Shield Shunt" &&
					this.#checkIfSelectedHullModIsAlreadyActive(
						"Makeshift Shield Generator"
					),
			],
			// Makeshift Shield Generator
			[
				"Ship already has a Shield",
				(hullMod) =>
					hullMod.name === "Makeshift Shield Generator" && shipHasShield,
			],
			[
				"Not allowed on Phase Ships",
				(hullMod) => hullMod.name === "Makeshift Shield Generator" && phaseShip,
			],
			[
				"Incompatible with Shield Shunt",
				(hullMod) =>
					hullMod.name === "Makeshift Shield Generator" &&
					this.#checkIfSelectedHullModIsAlreadyActive("Shield Shunt"),
			],
			// Shield FRONT - Error
			// TODO untested
			[
				"Ship Shield is already Front Facing",
				(hullMod) =>
					hullMod.name === "Shield Conversion - Front" &&
					currentShipBuild.currentShieldType === "FRONT",
			],
			// Shield OMNI - Error
			// TODO untested
			[
				"Ship Shield is already OMNI",
				(hullMod) =>
					hullMod.name === "Shield Conversion - Omni" &&
					currentShipBuild.currentShieldType === "OMNI",
			],
			this.#hullModIncompatibilityCheckAgainstSpecificActiveHullMod(
				"Shield Conversion - Omni",
				"Shield Conversion - Front"
			),
			this.#hullModIncompatibilityCheckAgainstSpecificActiveHullMod(
				"Shield Conversion - Front",
				"Shield Conversion - Omni"
			),
			// Shield Tag and No Shield
			[
				"Ship has No Shield",
				(hullMod) =>
					hullMod.uiTagsArray.some((e) => e === "Shields") &&
					!shipHasShield &&
					hullMod.name !== "Makeshift Shield Generator",
			],
			// Add more conditions with descriptive keys
		]);

		inputArray.forEach((hullMod) => {
			let classified = false;
			for (const [message, check] of rules) {
				// check if hullMod already active, don`t change it.
				if (this.#checkIfSelectedHullModIsAlreadyActive(hullMod.name)) {
					break;
				}

				if (check(hullMod)) {
					badArray.push([hullMod, message]);
					classified = true;
					break; // Prioritize the first match
				}
			}

			if (!classified) {
				goodArray.push(hullMod);
			}
		});

		return [goodArray, badArray];
	}
	#checkIfSelectedHullModIsBuildIn = (name) =>
		this.#data.currentShipBuild.hullMods?.buildInHullMods?.some(
			(buildIn) => buildIn.name === name
		);

	#checkIfSelectedHullModIsAlreadyActive = (name) =>
		this.#data.currentShipBuild.hullMods?.activeHullMods?.some(
			(hullMod) => hullMod.name === name
		);

	#checkIfMoreThanTwoLogiModsAlreadyInstalled = () => {
		const { activeHullMods } = this.#data.currentShipBuild.hullMods;
		if (!activeHullMods) return false;

		const numberOfLogisticalHullMods = activeHullMods.filter((hullMod) =>
			hullMod.uiTagsArray.includes("Logistics")
		).length;

		return numberOfLogisticalHullMods >= 2;
	};
	#hullModIncompatibilityDueToShipSize(targetName, targetSize) {
		return [
			`Not allowed on ${targetSize}`,
			(hullMod) =>
				hullMod.name === targetName &&
				this.#data.currentShipBuild.shipSize === targetSize,
		];
	}
	#hullModIncompatibilityCheckAgainstSpecificActiveHullMod(
		hullModName,
		incompatibleModName
	) {
		return [
			`Incompatible with [${incompatibleModName}]`,
			(hullMod) =>
				hullMod.name === hullModName &&
				this.#checkIfSelectedHullModIsAlreadyActive(incompatibleModName),
		];
	}
	//
	#hullModListMarkUp([goodArray, badArray]) {
		// this.#filteredArray
		const goodArrayMarkUp = goodArray
			.map((hullMod) => {
				const {
					name = "name",
					desc = "description",
					sprite_ = "",
					uiTagsArray = [],
				} = hullMod;
				if (!hullMod || hullMod === undefined) return;

				return this.#hullModListMarkUpNormal(
					name,
					desc,
					sprite_,
					uiTagsArray,
					hullMod
				);
			})
			.join("");

		const badArrayMarkUp = badArray
			.map(([hullMod, errorReason]) => {
				const {
					name = "name",
					desc = "description",
					sprite_ = "",
					uiTagsArray = [],
				} = hullMod;
				if (!hullMod || hullMod === undefined) return;

				return this.#hullModListMarkUpUnavailable(
					name,
					desc,
					sprite_,
					uiTagsArray,
					hullMod,
					errorReason
				);
			})
			.join("");

		return goodArrayMarkUp + badArrayMarkUp;
	}
	#hullModListMarkUpNormal(name, desc, sprite_, uiTagsArray, hullMod) {
		const { hullModCost } = this.#data.currentShipBuild;
		const tagsArrayToRender = uiTagsArray
			.map((tag) => `<p class="hullmod__tag">${tag}</p>`)
			.join("");
		// console.log(desc.length);
		return `
      <tr class="hullmod-menu__hullmod" id="hullmod__${hullMod.id}">
            <td><img src="/${
							URL.DATA
						}/${sprite_}" alt="${sprite_}-${name}" class="hullmod__sprite" /></td>
            <td><p class="hullmod__title">${name}</p></td>
            <td><p class="hullmod__desc">${this.hullModDescriptionShrink([
							desc,
							hullMod.id,
						])}</p></td>
            <td><div class="hullmod__tags">${tagsArrayToRender}</div></td>
            <td><p class="hullmod__cost">
              ${hullMod[hullModCost]}</p>
            </td>
              <td><button class="button hullmod__add-hull-button" data-id="${
								hullMod.id
							}">Add</button></td>
      </tr>
    `;
	}
	hullModDescriptionShrink([desc, hullModId]) {
		const splitText = desc.split(".").slice(0, -1);
		const addShowMoreButton = `<button class="hullmod__desc__show-more" data-id="${hullModId}">[Show More]</button>`;
		const finalShrinkedText =
			splitText.length === 1
				? `${splitText[0]}.`
				: splitText.length === 2
				? `${splitText[0]}. ${splitText[1]}.`
				: splitText.length >= 3
				? `${splitText[0]}. ${splitText[1]}... ${addShowMoreButton}`
				: "err";
		return finalShrinkedText;
	}
	#hullModListMarkUpUnavailable(
		name,
		desc,
		sprite_,
		tagsArrayToRender,
		hullMod,
		errorReason
	) {
		const { hullModCost } = this.#data.currentShipBuild;
		return `
      <tr class="hullmod-menu__hullmod--unavailable" id="hullmod__${
				hullMod.id
			}">
            <td><img src="/${
							URL.DATA
						}/${sprite_}" alt="${sprite_}-${name}" class="hullmod__sprite" /></td>
            <td><p class="hullmod__title">${name}</p></td>
              <td><p class="hullmod__desc">${this.hullModDescriptionShrink([
								desc,
								hullMod.id,
							])}</p></td>
            <td><div class="hullmod__tags">${tagsArrayToRender}</div></td>
            <td><p class="hullmod__cost">
              ${hullMod[hullModCost]}</p>
            </td>
            <td class="hullmod__unavailable-reason-text">${errorReason}</td>
      </tr>
    `;
	}

	addRemoveHullModToggleButtonRender() {
		const buttons = document.querySelectorAll(".hullmod__add-hull-button");
		if (!this.#data.currentShipBuild.hullMods.activeHullMods) return;

		const { activeHullMods } = this.#data.currentShipBuild.hullMods;

		buttons.forEach((button) => {
			const { id } = button.dataset;
			button.textContent = "Add";
			button.classList.remove("hullmod__add-hull-button--warn");

			if (activeHullMods.some((hullmod) => hullmod.id === id)) {
				button.textContent = "Remove";
				button.classList.add("hullmod__add-hull-button--warn");
			}
		});
	}
	#hullModFilter() {
		const { usableHullMods } = this.#data;
		const allTags = usableHullMods.flatMap((e) => e.uiTagsArray);
		const uniqueNames = [...new Set(allTags)].sort();
		uniqueNames.unshift("all");
		const markup = uniqueNames
			.map((uniqueTag) =>
				uniqueTag === this.#currentSelectedFilter
					? `<button class="button hullmod-menu__header__button hullmod-menu__header__button--active" data-filter-tag="${uniqueTag}">${uniqueTag}</button>`
					: `<button class="button hullmod-menu__header__button" data-filter-tag="${uniqueTag}">${uniqueTag}</button>`
			)
			.join("");
		return markup;
	}
	#markupFunction() {
		return `
        <div class="pop-up--wrapper">
          <table class="pop-up__hullmod-menu--open">
              <thead class="hullmod-menu__header">
                <tr class="hullmod-menu__header__filter">
                  <th class="hullmod-menu__header__filter" colspan="2">Filter Mods:</th>
                  <th class="hullmod-menu__header__buttons" colspan="10">
                    <div class="hullmod-menu__header__buttons--wrapper">
                      ${this.#hullModFilter()}
                    </div>
                  </th>
                </tr>
                <tr class="hullmod-menu__header_names">
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Desctipion</th>
                  <th>Tags</th>
                  <th>OP cost</th>
                  <th>Action</th>
                </tr>

              </thead>
              <tbody class="hullmod-menu__body">
                ${this.#hullModList()}
              </tbody>
          </table>
        </div>
      `;
	}
	#assignParentElement() {
		this.#parentElement = document.querySelector(".pop-up");
	}
	// Handler
	popUpFilterHandler(callback) {
		const localParent = ".hullmod-menu__header__buttons--wrapper";
		const eventTarget = ".hullmod-menu__header__button";
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}

	filterArrayAccordingToSelectedFilterTag(btn) {
		//! DEV? Probably not needed, but, check later.
		if (!btn) return (this.#filteredArray = this.#data.usableHullMods);

		// regular flow
		const { filterTag } = btn.dataset;
		this.#currentSelectedFilter = filterTag;
		if (filterTag === "all")
			return (this.#filteredArray = this.#data.usableHullMods);

		return (this.#filteredArray = this.#data.usableHullMods.filter((e) =>
			e.uiTagsArray.includes(filterTag) ? e : ""
		));
	}
	addHandlerToAddRemoveHullMod(callback) {
		const localParent = ".hullmod-menu__body";
		const eventTarget = ".hullmod__add-hull-button";
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	showMoreHullModDescriptionHandler(callback) {
		const localParent = ".hullmod-menu__body";
		const eventTarget = ".hullmod__desc__show-more";
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	hideHullModDescriptionHandler(callback) {
		const localParent = ".hullmod-menu__body";
		const eventTarget = ".hullmod__desc__close";
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
}
export default new BuilderPopUpView();
/////////////
