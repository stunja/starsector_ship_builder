import View from "./view.js";
import { capitalizeFirstLetter } from "../helperFunction.js";
import * as URL from "../url.js";
class BuilderLeftView extends View {
	#data;
	#parentElementTop = document.querySelector(".box__top-left");
	#parentElementMiddle = document.querySelector(".box__middle-left");
	#parentElementBottom = document.querySelector(".box__bottom-left");
	//
	#fighterSlotsContainer = "fighter-slots-container";
	#fighterSlotsContainerHeader = "fighter-slots-container__header";
	#fighterSlots = "fighter-slots";
	#fighterSlot = "fighter-slot";
	#fighterSlotEmpty = `fighter-slot__empty`;
	#fighterSlotOrdinancePoints = `fighter-slot__ordinance-points`;
	#fighterSlotContainer = `fighter-slot-container`;
	//
	#smallImageBoxClass = `small-image-box`;
	#weaponDivider = `weapon-divider`;
	//
	#fighterPopUpClass = `fighter-pop-up`;
	#fighterPopUpContainerClass = `fighter-pop-up__container`;
	//
	// general
	dNoneClass = "d-none";
	#weaponPopUpActiveClass = "weapon--active";
	#unselectableClass = "unselectable";
	#textBoldGeneric = "text-bold";
	//! I need to combined two views Left View and Center View
	#weaponPopUpFilterClass = "weapon-filter";

	// Weapon Hover Additional Information
	#hoverAdditionalInformationClass = "hover-additional-information";
	// Weapon Pop Up
	#weaponPopUpClass = "weapon-pop-up";
	weaponPopUpParentClass = "weapon-pop-up-parent";

	// Weapon Pop Up Table
	#weaponPopUpTableClass = "weapon-pop-up__table";
	#weaponPopUpTableWrapperClass = "weapon-pop-up__table-wrapper";
	#weaponPopUpTableBodyClass = "weapon-pop-up__table-body";
	#weaponPopUpTableHeaderClass = `weapon-pop-up__theader`;
	#tableHeaderElementClass = `theader-element`;
	// Weapon Element
	#fighterElementClass = "fighter";
	#fighterElementNameClass = "fighter__name";
	#fighterElementIconClass = "fighter__icon";
	#fighterElementRangeClass = "fighter__range";
	#fighterElementCostClass = "fighter__cost";
	#fighterElementWingSizeClass = "fighter__wing-size";

	#fighterElementTypeClass = "fighter__type";
	#fighterElementSizeClass = "fighter__size";
	#fighterOpacityClass = "fighter__opacity";
	//
	// weapon sprite
	// #weaponSpriteGunClass = "weapon-sprite--gun";
	// #weaponSpriteBaseClass = "weapon-sprite--base";
	#weaponSpriteParent = "weapon-sprite-parent";
	#fighterSpriteContainerElement = `fighter-container`;
	#fighterSpriteClass = "fighter__sprite";

	renderRow(data) {
		this.#data = data;

		this.#renderTopBox();
		this.#renderCenterBox(data);
		this.#renderBottomBox();
	}
	#renderTopBox() {
		if (!this.#parentElementTop) this.#parentElementTop = document.querySelector(".box__top-left");

		const markup = `${this.#crewReadinessGraph()}`;
		this.clearRender(this.#parentElementTop);
		this.#parentElementTop.insertAdjacentHTML("afterbegin", markup);
	}
	#renderCenterBox(data) {
		if (!this.#parentElementMiddle) this.#parentElementMiddle = document.querySelector(".box__middle-left");

		const markup = `${this.#pilotIconRender()}${this.#fighterBayRender(data)}`;
		this.clearRender(this.#parentElementMiddle);
		this.#parentElementMiddle.insertAdjacentHTML("afterbegin", markup);
	}
	#renderBottomBox() {
		if (!this.#parentElementBottom) this.#parentElementBottom = document.querySelector(".box__bottom-left");

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
	#pilotIconRender() {
		return `
            <ul class="box__middle-left__pilot">
                <li><h5>Current Pilot</h5></li>
                <li class="small-image-box">
                  <a
                    href="#"
                    class="small-image-box__icon pilot-icon"
                  >
                    <h5>Level 6</h5>
                  </a>
                </li>
              </ul>
            `;
	}

	#crewReadinessGraph = () => {
		const currentCombatReadiness = 71;
		return `<ul>
                <li>
                  <h5>Combat Readiness</h5>
                </li>
                <li>
                  <h5>${currentCombatReadiness}%</h5>
                </li>
                <li class="box__top-left__CR-graph"></li>
              </ul>`;
	};
	#fighterBayRender(data) {
		const { currentShip } = data;
		const fighterArray = currentShip.weaponSlots.filter((fighterObject) => fighterObject.type === "LAUNCH_BAY");
		const fighterBayCount = fighterArray.length;
		const dataSetId = `data-fighter-id`;
		//
		if (fighterBayCount === 0) return "";
		const currentFighterCost = "";

		const fighterSlotsMarkup = fighterArray
			.map((weaponSlot) => {
				return `
					<div class="${this.#fighterSlotContainer}">
						<figure class="${this.#smallImageBoxClass} ${this.#fighterSlot}" ${dataSetId}="${weaponSlot.id}">
							<a href="#" class="${this.#fighterSlotEmpty}">
								<h5 class="${this.#fighterSlotOrdinancePoints}">${currentFighterCost}</h5>
							</a>
						</figure>
					</div>`;
			})
			.join("");
		//

		return `
            <ul class="${this.#fighterSlotsContainer}">
              <li class="${this.#fighterSlotsContainerHeader}"><h5>Fighter Bays</h5></li>
              <li class="${this.#fighterSlots}">
                ${fighterSlotsMarkup}
              </li>
			  <div class="${this.#fighterPopUpClass}"></div>
            </ul>
    `;
	}
	#fighterIconRender(weaponSlot, currentFighterObject) {
		const currentWeaponSlot = weaponSlot;
		const currentWeaponSprite = currentFighterObject.additionalFighterData.spriteName;
		const spriteLocation = `./${URL.DATA}/${currentWeaponSprite}`;
		const fighterSprite = `<img src="${spriteLocation}" alt="gun sprite" class="${this.#fighterSpriteClass}" />`;
		//
		const markup = `
					<div class="${this.#weaponSpriteParent}">
						<div class="${this.#fighterSpriteContainerElement}">
							${fighterSprite}
						</div>
					</div>`;
		return markup;
	}
	fighterPopUpRender() {
		const localParent = `.${this.#fighterPopUpClass}`;
		// document.querySelector(`.${this.weaponPopUpParentClass}`).classList.remove(`${this.dNoneClass}`);

		const markup = `
			<div class="${this.#fighterPopUpContainerClass}">
				<div class="${this.#hoverAdditionalInformationClass}"></div>
				<div class="${this.#weaponPopUpTableClass}">
					<ul class="${this.#weaponPopUpFilterClass}"></ul>
					<div class="${this.#weaponPopUpTableWrapperClass}">
						<table class="${this.#weaponPopUpTableBodyClass}">
							<thead></thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
			</div>
    `;
		return [markup, localParent];
	}
	fighterPopUpTableHeader() {
		const localParent = `.${this.#weaponPopUpTableClass} thead`;
		const dataCategory = [
			{
				label: "Name",
				category: "name",
			},
			{
				label: "Role",
				category: "role",
			},
			{
				label: "Wing",
				category: "wing",
			},
			{
				label: "Range",
				category: "range",
			},
			{
				label: "Cost",
				category: "cost",
			},
		];
		const headerCategoryMarkUp = dataCategory
			.map(
				({ label, category }) => `
						<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="${category}">
							<div>
								<p>${label}</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>`
			)
			.join("");

		const markup = `
					<tr class="${this.#weaponPopUpTableHeaderClass}">
						<th></th>
						${headerCategoryMarkUp}
					</tr>
				`;

		return [markup, localParent];
	}
	fighterPopUpTableContentRender(weaponArray, currentInstalledWeapons, currentWeaponSlot) {
		const localParent = `.${this.#weaponPopUpTableClass} tbody`;
		//
		const weaponTypeStringConversion = (fighterId) =>
			fighterId
				.replaceAll("_wing", "")
				.split("_")
				.map((arr) => capitalizeFirstLetter(arr))
				.join(" ");

		const findCurrentInstalledWeapon = (currentWeaponSlot, weaponId) =>
			currentInstalledWeapons.find(([slotId, wpnId]) => slotId === currentWeaponSlot.id && wpnId === weaponId);
		//
		const processWeaponArray = () => {
			let activeWeaponClassObject;
			const modifiedWeaponsArray = weaponArray.filter((wpnObj) => {
				const currentInstalledWeaponKeyPair = findCurrentInstalledWeapon(currentWeaponSlot, wpnObj.id);

				if (currentInstalledWeaponKeyPair) {
					activeWeaponClassObject = wpnObj;
					return false;
				}
				return true;
			});

			if (activeWeaponClassObject) {
				modifiedWeaponsArray.unshift(activeWeaponClassObject);
			}

			return modifiedWeaponsArray;
		};
		//
		const checkIfCorrectWeapon = (wpnObj) => {
			const [correctWeaponValue] = currentInstalledWeapons.filter((wpn) => {
				if (wpn[0] === currentWeaponSlot.id && wpn[1] === wpnObj.id) {
					return true;
				}
			});
			if (correctWeaponValue) {
				return true;
			}
		};
		//
		const activeClass = (wpnObj) => {
			if (checkIfCorrectWeapon(wpnObj)) {
				return ` ${this.#weaponPopUpActiveClass}`;
			}
			return "";
		};
		const markup = processWeaponArray()
			.map((fighterObj) => {
				//
				const markup = `
						<tr class="${this.#fighterElementClass}${activeClass(fighterObj)}" data-id="${fighterObj.id}">
							<td class="${this.#fighterElementIconClass}">${this.#fighterIconRender(currentWeaponSlot, fighterObj)}</td>
							<td class="${this.#fighterElementNameClass}">${weaponTypeStringConversion(fighterObj.id)}</td>
							<td class="${this.#fighterElementTypeClass}">${fighterObj.role}</td>
							<td class="${this.#fighterElementWingSizeClass}">${fighterObj.num}</td>
							<td class="${this.#fighterElementRangeClass}">${fighterObj.range}</td>
							<td class="${this.#fighterElementCostClass}">${fighterObj.op_cost}</td>
						</tr>`;
				return markup;
			})
			.join("");

		return [markup, localParent];
	}
	// Handler
	fighterSlotHandler(callback) {
		const localParent = `.${this.#fighterSlotsContainer}`;
		const eventTarget = `.${this.#fighterSlot}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpHeaderHandler(callback) {
		const localParent = `.${this.#weaponPopUpTableHeaderClass}`;
		const eventTarget = `.${this.#tableHeaderElementClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpTableHandler(callback) {
		const localParent = `.${this.#weaponPopUpTableClass}`;
		const eventTarget = `.${this.#fighterElementClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpRemoveCurrentWeapon(callback) {
		const localParent = `.${this.#weaponPopUpTableClass}`;
		const eventTarget = `.${this.#weaponPopUpActiveClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	// Dublicate implementation from builderCenterView
	// I can fuse both, but I dont have time.
	fighterPopUpHideWhenClickOutsideHandler() {
		const localParent = document.querySelector(".build-maker__work-area");
		const eventTarget = localParent.querySelector(`.${this.#weaponPopUpTableBodyClass}`);
		const elementTarget = localParent.querySelector(`.${this.#fighterPopUpClass}`);
		const target = document.querySelector(`.${this.weaponPopUpParentClass}`);
		const dClass = `${this.dNoneClass}`;

		const actionType = "click";
		//
		document.addEventListener(
			actionType,
			function (e) {
				if (!eventTarget.contains(e.elementTarget)) {
					target.classList.add(dClass);
					elementTarget.textContent = "";
				}
			},
			{ once: true }
		);
	}
	// fighterPopUpHoverEffect(callback) {
	// 	const localParent = `.${this.#weaponPopUpTableClass}`;
	// 	const eventTarget = `.${this.#fighterElementClass}`;
	// 	const actionType = "mouseover";
	// 	return [localParent, eventTarget, actionType, callback];
	// }
	//
	// #weaponPopUpTableClass = "weapon-pop-up__table";
	// #weaponPopUpTableWrapperClass = "weapon-pop-up__table-wrapper";
	// #weaponPopUpTableBodyClass = "weapon-pop-up__table-body";
	// #weaponPopUpTableHeaderClass = `weapon-pop-up__theader`;
	// #tableHeaderElementClass = `theader-element`;
	// #weaponPopUpActiveClass = "weapon--active";

	//!
	// weaponPopUpHoverEffect(callback) {
	// 	const localParent = `.${this.#weaponPopUpTableClass}`;
	// 	const eventTarget = `.${this.#weaponElementClass}`;
	// 	const actionType = "mouseover";
	// 	return [localParent, eventTarget, actionType, callback];
	// }
	// weaponButtonHandler(callback) {
	// 	const localParent = `.${this.#weaponSlotsClass}`;
	// 	const eventTarget = `.${this.weaponSlotClass}`;
	// 	const actionType = "click";
	// 	return [localParent, eventTarget, actionType, callback];
	// }
}
export default new BuilderLeftView();
// weaponPopUpHoverAdditionalInformationRender(weaponObjectEditedData, weaponObject) {
// 	const localParent = `.${this.#hoverAdditionalInformationClass}`;
// 	document.querySelector(localParent).classList.remove(this.dNoneClass);

// 	const { stats, information, additionalStats, string, damageTypeEffect, accuracyRating, turnRateRating } = weaponObjectEditedData;

// 	const ammoElementMarkUp = () => {
// 		const markup = `
// 			<li class="weapon-ammo-size">
// 				<p>Ammo Size:</p>
// 				<p class="${this.#textBoldGeneric}">${stats.ammo.capacity}</p>
// 			</li>
// 			<li class="weapon-ammo-per-sec">
// 				<p>Ammo Per Sec:</p>
// 				<p class="${this.#textBoldGeneric}">${stats.ammo.perSecond}</p>
// 			</li>`;

// 		if (stats.ammo.capacity) return markup;
// 		return "";
// 	};

// 	const weaponBurstSize = () => {
// 		if (stats.ammo.burstSize < 2 || !stats.ammo.burstSize) return "";
// 		const markup = `
// 			<li class="weapon-burst-size">
// 				<p>Burst Size:</p>
// 				<p class="${this.#textBoldGeneric}">${stats.ammo.burstSize}</p>
// 			</li>`;
// 		return markup;
// 	};

// 	const weaponProjectileTypeMarkUp = () => {
// 		const weaponDamageMarkup = `
// 			<li class="weapon-damage">
// 				<p>Damage:</p>
// 				<p class="${this.#textBoldGeneric}">${string.damageString}</p>
// 			</li>
// 		`;
// 		const weaponDamageSecMarkup = `
// 			<li class="weapon-damage-sec">
// 				<p>Damage / sec:</p>
// 				<p class="${this.#textBoldGeneric}">${additionalStats.damagePerSecond}</p>
// 			</li>
// 		`;
// 		const markup = `
// 			${!additionalStats.isWeaponBeam ? weaponDamageMarkup : ""}
// 			${weaponDamageSecMarkup}
// 		`;
// 		return markup;
// 	};
// 	//
// 	const fluxMarkUp = () => {
// 		const fluxPerShotMarkup = stats.flux.perShot
// 			? `
// 					<li class="weapon-flux-shot">
// 						<p>Flux / shot:</p>
// 						<p class="${this.#textBoldGeneric}">${stats.flux.perShot}</p>
// 					</li>`
// 			: "";
// 		const fluxPerSecondMarkup = additionalStats.fluxPerSecond
// 			? `
// 					<li class="weapon-flux-sec">
// 						<p>Flux / sec:</p>
// 						<p class="${this.#textBoldGeneric}">${additionalStats.fluxPerSecond}</p>
// 					</li>`
// 			: "";
// 		const fluxPerDamageMarkup = additionalStats.fluxPerDamage
// 			? `
// 					<li class="weapon-flux-damage">
// 						<p>Flux / damage:</p>
// 						<p class="${this.#textBoldGeneric}">${additionalStats.fluxPerDamage}</p>
// 					</li>`
// 			: "";
// 		const markup = `
// 			${fluxPerSecondMarkup}
// 			${fluxPerShotMarkup}
// 			${fluxPerDamageMarkup}`;
// 		return markup;
// 	};
// 	const weaponTypeString = stats.projectile.type
// 		.split("_")
// 		.map((str) => capitalizeFirstLetter(str.toLowerCase()))
// 		.join(" ");

// 	const primaryDataMarkUp = `
// 	<div class="d-grid weapon-primary-data">
//       <div class="weapon-primary-data__icon">
//         <li class="${this.#weaponElementIconClass} ${this.#weaponSizeClass}--${stats.mount.size} ${this.#weaponTypeClass}--${stats.mount.type}" data-id="${
// 		information.id
// 	}">${this.#weaponIconMarkup(weaponObject)}</li>
//       </div>
// 		<div class="weapon-primary-data_content">
// 			<li class="weapon-role">
// 				<p>Primary Role:</p>
// 				<p class="${this.#textBoldGeneric}">${information.primaryRole}</p>
// 			</li>
// 			<li class="${this.#weaponMountTypeClass}">
// 				<p>Mount Type:</p>
// 				<div class="${this.#weaponMountTypeContentClass}">
// 					<p class="${this.#textBoldGeneric}">${capitalizeFirstLetter(stats.mount.type)}</p>
// 					<p class="${this.#textBoldGeneric}">${capitalizeFirstLetter(stats.mount.size)}</p>
// 				</div>
// 			</li>
// 			<li class="weapon-cost">
// 				<p>Ordinance Point:</p>
// 				<p class="${this.#textBoldGeneric}">${information.op}</p>
// 			</li>
// 			<div class="weapon-range-damage-group">
// 				<li class="weapon-range">
// 					<p>Range:</p>
// 					<p class="${this.#textBoldGeneric}">${stats.range}</p>
// 				</li>
// 				${weaponProjectileTypeMarkUp()}
// 			</div>
// 			${fluxMarkUp()}
// 		</div>
//       </div>
// `;
// 	const anciliaryDataMarkUp = `
// 		<div class="d-grid weapon-anciliary-data">
// 			<div class="weapon-anciliary-data__icon-parent">
// 				<li class="weapon-anciliary-data__icon">${this.#weaponTypeSprite(weaponObject)}</li>
// 			</div>
// 			<div class="weapon-primary-data_content">
// 				<li class="${this.#weaponDamageTypeClass}">
// 					<p>Damage Type:</p>
// 					<div class="${this.#weaponDamageTypeClass}--content">
// 						<p class="${this.#textBoldGeneric}">${weaponTypeString}</p>
// 						<p class="${this.#textBoldGeneric}">${damageTypeEffect()}</p>
// 					</div>
// 				</li>
// 				<li class="weapon-accuracy">
// 					<p>Accuracy:</p>
// 					<p class="${this.#textBoldGeneric}">${accuracyRating()}</p>
// 				</li>
// 				<li class="weapon-turn-rate">
// 					<p>Turn rate:</p>
// 					<p class="${this.#textBoldGeneric}">${turnRateRating()}</p>
// 				</li>
// 				${weaponBurstSize()}
// 				${ammoElementMarkUp()}
// 				<li class="weapon-refire-delay">
// 					<p>Refire delay:</p>
// 					<p class="${this.#textBoldGeneric}">${string.refireDelayString}</p>
// 				</li>
// 			</div>
// 		</div>`;
// 	const introDataMarkUp = `
// 			<li class="weapon-name">
// 				<p>Weapon Name</p>
// 				<p>${information.name}</p>
// 			</li>
// 			<li class="weapon-description"><p>${string.shortWeaponDescription}.</p></li>`;
// 	const markup = `
// 		<ul>
// 			${introDataMarkUp}
// 			<li class="weapon-divider"><p>Primary Data</p></li>
// 			${primaryDataMarkUp}
// 			<li class="weapon-divider"><p>Anciliary Data</p></li>
// 			${anciliaryDataMarkUp}
// 		</ul>
// 	`;
// 	return [markup, localParent];
// }
// weaponPopUpFormRemover() {
// 	const target = document.querySelector(`.${this.#weaponPopUpClass}`);
// 	const targetParent = document.querySelector(`.${this.weaponPopUpParentClass}`);
// 	const dClass = `${this.dNoneClass}`;
// 	//
// 	target.textContent = "";
// 	targetParent.classList.add(dClass);
// }
// weaponPopUpCloseOnHover() {
// 	this.weaponPopUpFormRemover();
// }
// weaponPopUpTurnCurrentActiveWeaponInactive(btn) {
// 	btn.classList.remove(`${this.#weaponPopUpActiveClass}`);
// }
// const fighterBayMarkUp = () =>
// 	Array.from({ length: fighterBayCount }, (_, index) => {
// 		return `
// 			<div class="${this.#fighterSlotContainer}">
// 				<figure class="${this.#smallImageBoxClass} ${this.#fighterSlot}" ${dataSetId}="${this.#fighterSlot}-${index + 1}">
// 					<a href="#" class="${this.#fighterSlotEmpty}">
// 						<h5 class="${this.#fighterSlotOrdinancePoints}">${currentFighterCost}</h5>
// 					</a>
// 				</figure>
// 			</div>`;
// 	}).join("");
// const markup = `
// <tr class="${this.#weaponPopUpTableHeaderClass}">
// 	<th></th>
// 	<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="name">
// 		<div>
// 			<p>Name</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
// 		</div>
// 	</th>
// 	<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="type">
// 		<div>
// 			<p>Role</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
// 		</div>
// 	</th>
// 	<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="wing-size">
// 		<div>
// 			<p>Wing</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
// 		</div>
// 	</th>
// 	<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="range">
// 		<div>
// 			<p>Range</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
// 		</div>
// 	</th>
// 	<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="cost">
// 		<div>
// 			<p>Cost</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
// 		</div>
// 	</th>
// </tr>
// `;
