import View from "./view";

import classNames from "../helper/DomClassNames.js";
import DataSet from "../helper/DataSet.js";
import FighterSprites from "./Fighter/FighterSprites.js";
//

class BuilderLeftView extends View {
	#data;
	#parentElementTop = document.querySelector(".box__top-left");
	#parentElementMiddle = document.querySelector(".box__middle-left");
	#parentElementBottom = document.querySelector(".box__bottom-left");

	// Terrible implementation
	renderRow(data) {
		this.#data = data;

		this.#renderTopBox(data);
		this.#renderCenterBox(data);
		this.#renderBottomBox();
	}
	#renderTopBox(data) {
		if (!this.#parentElementTop)
			this.#parentElementTop = document.querySelector(".box__top-left");

		const markup = `
			${this.#shipDescription(data)}
		`;

		this.clearRender(this.#parentElementTop);
		this.#parentElementTop.insertAdjacentHTML("afterbegin", markup);
	}
	#renderCenterBox(data) {
		if (!this.#parentElementMiddle)
			this.#parentElementMiddle = document.querySelector(".box__middle-left");

		const markup = `${this.#fighterBayInitialRender(data)}`;
		this.clearRender(this.#parentElementMiddle);
		this.#parentElementMiddle.insertAdjacentHTML("afterbegin", markup);
	}
	#renderBottomBox() {
		if (!this.#parentElementBottom)
			this.#parentElementBottom = document.querySelector(".box__bottom-left");

		const markup = `               
                    <h5>3</h5>
                    <div class="bottom-left__button-wrapper">
                        <button>Strip Everything</button>
                        <button>Save the ship</button>
                    </div>
                    `;
		this.clearRender(this.#parentElementBottom);
		this.#parentElementBottom.insertAdjacentHTML("afterbegin", markup);
	}

	//! NEXT FEATURE
	#shipDescription = (data) => {
		const currentShip = data.currentShip;

		// console.log(currentShip);
		return `<p>Hello</p>`;
	};

	//! Render The Fighter Bay Boxes
	#fighterBayInitialRender(data) {
		const { currentShip } = data;
		const fighterArray = currentShip.weaponSlots.filter(
			(fighterObject) => fighterObject.type === "LAUNCH_BAY"
		);
		const fighterBayCount = fighterArray.length;
		//
		if (fighterBayCount === 0) return "";

		const fighterSlotsMarkup = fighterArray
			.map((weaponSlot) => {
				return `
					<div class="${classNames.fighterSlotContainer}">
						<figure class="${classNames.smallImageBox} ${classNames.fighterSlot}" ${DataSet.dataFighterId}="${weaponSlot.id}">
						</figure>
					</div>`;
			})
			.join("");
		//

		return `
            <ul class="${classNames.fighterSlotsContainer}">
              <li class="${classNames.fighterSlotsContainerHeader}"><h5>Fighter Bays</h5></li>
              <li class="${classNames.fighterSlots}">
                ${fighterSlotsMarkup}
              </li>
			  <div class="${classNames.fighterPopUp}"></div>
            </ul>
    `;
	}
	fighterBayActiveWeaponSlot(buttonId) {
		const parentElement = this.#parentElementMiddle.querySelector(
			`.${classNames.fighterSlots}`
		);
		if (!parentElement) return;

		this.fighterBayButtonRemoveAllActiveClasses();

		const targetElement = parentElement.querySelector(
			`[${DataSet.dataFighterId}="${buttonId}"]`
		);
		if (targetElement) {
			targetElement.classList.add(classNames.fighterSlotActive);
		}
	}
	fighterBayButtonRemoveAllActiveClasses() {
		const parentElement = this.#parentElementMiddle.querySelector(
			`.${classNames.fighterSlots}`
		);

		// Remove active class from all slots first
		parentElement
			.querySelectorAll(`.${classNames.fighterSlot}`)
			.forEach((slot) => slot.classList.remove(classNames.fighterSlotActive));
	}
	//!
	figherBayAddFighterRender(currentWeapon, currentWeaponSlot) {
		const slotId = currentWeaponSlot.id;
		const localParent = `.${classNames.fighterSlots} [${DataSet.dataFighterId}="${slotId}"]`;

		const markup = `${FighterSprites.render(currentWeapon)}`;
		return [markup, localParent];
	}
	// Handler
	fighterSlotHandler(callback) {
		const localParent = `.${classNames.fighterSlotsContainer}`;
		const eventTarget = `.${classNames.fighterSlot}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpHeaderHandler(callback) {
		const localParent = `.${classNames.weaponPopUpTableHeader}`;
		const eventTarget = `.${classNames.tableHeader}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpTableHandler(callback) {
		const localParent = `.${classNames.weaponPopUpTable}`;
		const eventTarget = `.${classNames.fighter}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpRemoveCurrentWeapon(callback) {
		const localParent = `.${classNames.weaponPopUpTable}`;
		const eventTarget = `.${classNames.weaponPopUpActive}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}

	// weaponPopUpHideWhenClickOutsideHandler() {
	// 	const localParent = document.querySelector(
	// 		`.${classNames.fighterPopUpClass}`
	// 	);

	// 	const actionType = "click";

	// 	document.addEventListener(
	// 		actionType,
	// 		function (e) {
	// 			if (!localParent.contains(e.target)) {
	// 				localParent.textContent = "";
	// 			}
	// 		},
	// 		{ once: true }
	// 	);
	// }
	fighterPopUpHoverEffect(callback) {
		const localParent = `.${classNames.weaponPopUpTable}`;
		const eventTarget = `.${classNames.fighter}`;
		const actionType = "mouseover";
		return [localParent, eventTarget, actionType, callback];
	}
}
export default new BuilderLeftView();

// fighterPopUpHoverAdditionalInformationRender(
// 	fighterObject,
// 	allWeapons,
// 	allShipHulls
// ) {
// 	const localParent = `.${this.hoverAdditionalInformationClass}`;
// 	const { role_desc, op_cost, range, num, refit, description } =
// 		fighterObject;

// 	const {
// 		name,
// 		shield_arc,
// 		tech_manufacturer,
// 		max_crew,
// 		hitpoints,
// 		armor_rating,
// 		shield_type,
// 		max_speed,
// 		system_id,
// 	} = fighterObject.additionalFighterDataShipHull;

// 	const { weaponGroups, hullMods } =
// 		fighterObject.additionalFighterDataFromVariant;

// 	document.querySelector(localParent).classList.remove(this.dNone);
// 	// Should be one sentence long
// 	const descriptionShrink = (string) => string.split(".").at(0) + ".";

// 	const singleParagraphMarkUp = (str) => {
// 		return `<strong><p>${str}</p></strong>`;
// 	};
// 	const contentMarkUp = (label, data) => {
// 		return `
// 			<li>
// 				${label !== "" ? `<p>${label}</p>` : ""}
// 				${singleParagraphMarkUp(data)}
// 			</li>`;
// 	};
// 	const contentMultyItems = (str, data) => {
// 		return `
// 			<li>
// 				<p>${str}</p>
// 				<div class="fighter-flex-column">
// 					${data}
// 				</div>
// 			</li>`;
// 	};

// 	const fighterSystemMarkup = () => {
// 		const [currentSystem] = allWeapons.filter(
// 			(weapon) => weapon.id === system_id
// 		);
// 		return currentSystem ? currentSystem.name : "[NONE]";
// 	};

// 	const figherWeaponsMarkUp = () => {
// 		const fighterWeapons = weaponGroups.flatMap((obj) =>
// 			Object.values(obj.weapons)
// 		);

// 		const condencedArray = fighterWeapons.reduce((acc, weapon) => {
// 			acc[weapon] = (acc[weapon] || 0) + 1;
// 			return acc;
// 		}, {});

// 		const newWeaponArray = Object.entries(condencedArray);

// 		const replaceStringIdWithProperString = (weaponId) => {
// 			const [currentWeapon] = allWeapons.filter(
// 				(weaponObject) => weaponObject.id === weaponId
// 			);

// 			return currentWeapon.name ? currentWeapon.name : currentWeapon.id;
// 		};

// 		const fighterWeaponString = newWeaponArray
// 			.map((weapon) => {
// 				const weaponLabel = replaceStringIdWithProperString(weapon[0]);
// 				const weaponCount = weapon[1] > 1 ? `${weapon[1]}x ` : "";

// 				return `${singleParagraphMarkUp(weaponCount + " " + weaponLabel)}`;
// 			})
// 			.join("");
// 		//
// 		return fighterWeaponString;
// 	};
// 	const hullModsMarkUp = () => {
// 		const missingHullModName = "[NONE]";
// 		if (!hullMods) return singleParagraphMarkUp(missingHullModName);

// 		const extractedName = hullMods.map((currentMod) => {
// 			const [extractedHullModObject] = allShipHulls.filter(
// 				(hullMod) => hullMod.id === currentMod
// 			);
// 			return extractedHullModObject.name;
// 		});

// 		const isNameExistsAndNotEmpty =
// 			extractedName && extractedName.length > 0
// 				? extractedName
// 				: missingHullModName;

// 		return singleParagraphMarkUp(isNameExistsAndNotEmpty);
// 	};

// 	const introContent = `
// 			${contentMarkUp("Fighter Name", name)}
// 			${contentMarkUp("Design Type", tech_manufacturer)}
// 			`;

// 	const mainContent = `
// 		<div class="${this.weaponContentGroupClass}">
// 			${contentMarkUp("Primary Role", role_desc)}
// 			${contentMarkUp("Ordnance Points", op_cost)}
// 			${contentMarkUp("Crew per Fighter", max_crew)}
// 			${contentMarkUp("Maximum engagement range", range)}
// 		</div>
// 		<div class="${this.weaponContentGroupClass}">
// 			${contentMarkUp("Fighters in wing", num)}
// 			${contentMarkUp("Base replacement time (seconds)", refit)}
// 			${contentMarkUp("Hull integrity", hitpoints)}
// 			${contentMarkUp("Armor rating", armor_rating)}
// 		</div>
// 		<div class="${this.weaponContentGroupClass}">
// 			${
// 				shield_type !== "NONE"
// 					? `
// 					${contentMarkUp("Shield Type", shield_type)}
// 					${contentMarkUp("Shield Arc", shield_arc)}`
// 					: ""
// 			}
// 			${contentMarkUp("Top speed", max_speed)}
// 			${contentMarkUp("System", fighterSystemMarkup())}
// 			${contentMultyItems("HullMods", hullModsMarkUp())}
// 		</div>
// 		<div class="${this.weaponContentGroupClass}">
// 			${contentMultyItems("Arnaments", figherWeaponsMarkUp())}
// 		</div>
// 	`;
// 	//
// 	const markup = `
// 			<ul>
// 				${introContent}
// 				<li class="${this.#weaponDescriptionClass}">
// 					<p>${descriptionShrink(description)}</p>
// 				</li>
// 				<li class="weapon-divider"><p>Technical Data</p></li>
// 				${mainContent}
// 			</ul>`;

// 	return [markup, localParent];
// }
// fighterPopUpHideWhenClickOutsideHandler() {
// 	const localParent = document.querySelector(".build-maker__work-area");
// 	const eventTarget = localParent.querySelector(
// 		`.${classNames.weaponPopUpTableBody}`
// 	);
// 	const elementTarget = localParent.querySelector(
// 		`.${classNames.fighterPopUpClass}`
// 	);
// 	const target = document.querySelector(
// 		`.${classNames.weaponPopUpParent}`
// 	);
// 	const dClass = `${classNames.dNone}`;

// 	const actionType = "click";
// 	//
// 	document.addEventListener(
// 		actionType,
// 		function (e) {
// 			if (!eventTarget.contains(e.elementTarget)) {
// 				target.classList.add(dClass);
// 				elementTarget.textContent = "";
// 			}
// 		},
// 		{ once: true }
// 	);
// }
