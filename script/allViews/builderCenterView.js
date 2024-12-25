import View from "./view.js";
import { capitalizeFirstLetter } from "../helper/helperFunction.js";
import * as URL from "../helper/url.js";

import classNames from "../helper/DomClassNames.js";
//

class BuilderCenterView extends View {
	#data;
	#parentClass = "box__middle-center";
	#parentElement;

	#targetRem = 10; // rem for shipSpriteSize / WeaponSlotsPosition / shipGAP

	// Regular
	weaponArcAndAngleChangeCoords() {
		const weaponArcs = document.querySelectorAll(`.${classNames.weaponArc}`);

		weaponArcs.forEach((wpnArc) => {
			const secondaryArc = wpnArc.querySelector(
				`.${classNames.weaponArcSprite}`
			);
			//
			const { arc, angle } = wpnArc.dataset;
			const halfArc = arc / 2;
			let reverseAngle = -angle;
			// Arc consists of two lines, after and before, and use weapon angle to rotate
			wpnArc.style.setProperty("--after-rotate", `${halfArc}deg`);
			wpnArc.style.setProperty("--before-rotate", `-${halfArc}deg`);
			wpnArc.style.setProperty("--weapon-angle", `${reverseAngle}deg`);
			// Second arc is child of first arc. It is a border.
			secondaryArc.style.setProperty("--arc-mask-color", `${arc}deg`);
			secondaryArc.style.setProperty("--arc-mask-transparent", `${arc}deg`);
		});
	}

	//
	weaponSlotChangePosition(data) {
		//! Should Not be here
		const { viewOffset, center, width, height } = data.currentShip;
		const allWeaponSlotsElements = document.querySelectorAll(
			`.${classNames.weaponSlot}`
		);
		const weaponSlots = data.currentShipBuild._baseWeaponSlots;
		const centerX = center[0] - width;
		const centerY = center[1] - height;

		//
		allWeaponSlotsElements.forEach((el) => {
			const { id } = el.dataset;
			const [currentWeaponSlotData] = weaponSlots.filter(
				(slot) => slot.id === id
			);
			const currentWeaponSlotLocationData = currentWeaponSlotData.locations;
			const posX = currentWeaponSlotLocationData[1];
			const posY = currentWeaponSlotLocationData[0];

			const posLeft = -posX - centerX;
			const posTop = -posY - centerY;

			const posLeftRem = posLeft / this.#targetRem;
			const posTopRem = posTop / this.#targetRem;

			//
			el.style.left = `${posLeftRem}rem`;
			el.style.top = `${posTopRem}rem`;
		});
	}

	weaponSlotActiveClass(btn) {
		const allWeaponSlots = document.querySelectorAll(
			`.${classNames.weaponSlot}`
		);
		allWeaponSlots.forEach((weaponSlot) => {
			weaponSlot.classList.remove(`weapon-slot--active`);
			weaponSlot.classList.add(`weapons-slot--inactive`);
			if (btn) {
				btn.classList.add(`weapon-slot--active`);
				btn.classList.remove(`weapons-slot--inactive`);
			}
		});
	}
	shipSpriteUpdate() {
		const { currentShip, currentShipBuild } = this.#data;
		const targetElement = document.querySelector(`.${classNames.shipSprite}`);
		const className = "currentShipSprite";
		//
		const spriteHeight = currentShip.height;
		const spriteWidth = currentShip.width;
		// const spriteOffset = currentShip.viewOffset;
		const spriteWidthRem = spriteWidth / this.#targetRem;
		const spriteHeightRem = spriteHeight / this.#targetRem;

		const createNewStyle = () => {
			// Create a new style element
			const styleSheet = document.createElement("style");
			styleSheet.type = "text/css";

			// Append the style element to the document head
			document.head.appendChild(styleSheet);

			// Insert a CSS rule into the new stylesheet
			styleSheet.sheet.insertRule(
				`.${className} { width:${spriteWidthRem}rem; height:${spriteHeightRem}rem;}`,
				styleSheet.sheet.cssRules.length
			);
		};
		createNewStyle();
		// Apply the new class to an element
		targetElement.classList.add(className);
	}

	// Markup
	#weaponSlotMarkUp(currentWeaponSlot) {
		if (currentWeaponSlot.mount.toLowerCase() === "hidden") return;
		const weaponSize = currentWeaponSlot.size.toLowerCase();
		const weaponType = currentWeaponSlot.type.toLowerCase();
		const markup = `
					<button class="${classNames.weaponSlot} ${
			classNames.weaponSize
		}--${weaponSize} ${classNames.weaponType}--${weaponType}" 
					data-id="${currentWeaponSlot.id}">
						<div class="${classNames.weaponSpriteParent}">
							${this.#weaponTypeBackgroundMarkup(currentWeaponSlot)}
						</div>
            			${this.#weaponArcRenderMarkup(currentWeaponSlot)}
					</button>`;
		return markup;
	}
	#weaponArcRenderMarkup(currentWeaponSlot) {
		if (!currentWeaponSlot) return "";
		return `<div class="${classNames.weaponArc}" data-id="${currentWeaponSlot.id}" data-arc="${currentWeaponSlot.arc}" data-angle="${currentWeaponSlot.angle}"><div class="${classNames.weaponArcSprite}"></div></div>`;
	}
	// TODO is this a copy?
	#weaponTypeBackgroundMarkup = (currentWeaponSlot) => {
		const weaponType = currentWeaponSlot.type.toLowerCase();
		const weaponSize = currentWeaponSlot.size.toLowerCase();
		return this.#weaponBackgroundSprite(weaponType, weaponSize);
	};

	#weaponBackgroundSpriteMarkUpAndSelector(weaponType, weaponSize) {
		const weaponMarkup = (size, type, oppacity) => {
			return `<div class="${classNames.weaponBackgroundSprite} ${classNames.weaponBackgroundSpriteSize}--${size} ${classNames.weaponBackgroundSpriteType}--${type} ${classNames.weaponBackgroundSpriteOppacity}--${oppacity}"></div>`;
		};
		const weaponTypeSelector = () => {
			if (
				weaponType === "ballistic" ||
				weaponType === "energy" ||
				weaponType === "missile"
			) {
				return weaponSize === "small"
					? weaponMarkup("small", weaponType, "full")
					: weaponSize === "medium"
					? weaponMarkup("small", weaponType, "medium") +
					  weaponMarkup("medium", weaponType, "full")
					: weaponSize === "large"
					? weaponMarkup("small", weaponType, "light") +
					  weaponMarkup("medium", weaponType, "medium") +
					  weaponMarkup("large", weaponType, "full")
					: console.warn("error with weaponSizeLogic");
			}
			if (weaponType === "composite") {
				return (
					weaponMarkup(weaponSize, weaponType, "full") +
					weaponMarkup(weaponSize, weaponType, "full")
				);
			}
			if (weaponType === "hybrid") {
				return (
					weaponMarkup(weaponSize, weaponType, "full") +
					weaponMarkup(weaponSize, weaponType, "full")
				);
			}
			if (weaponType === "decorative") {
				return "";
			}
			if (weaponType === "synergy") {
				return (
					weaponMarkup(weaponSize, weaponType, "full") +
					weaponMarkup(weaponSize, weaponType, "full")
				);
			}
		};
		return weaponTypeSelector();
	}
	#weaponBackgroundSprite(weaponType, weaponSize) {
		return `<div class="${
			classNames.weaponBackgroundSpriteParent
		}">${this.#weaponBackgroundSpriteMarkUpAndSelector(
			weaponType,
			weaponSize
		)}</div>`;
	}
	#weaponIconMarkup(weaponObject, weaponSlot) {
		const turretSprite = weaponObject.additionalWeaponData.turretSprite;
		const turretGunSprite = weaponObject.additionalWeaponData.turretGunSprite;
		const markupForGunSprite = turretGunSprite
			? `<img src="/${URL.DATA}/${turretGunSprite}" alt="gun sprite" class="${classNames.weaponSpriteGun}" />`
			: "";

		const weaponSize = weaponSlot
			? weaponSlot.size.toLowerCase()
			: weaponObject.additionalWeaponData.size.toLowerCase();
		const weaponType = weaponSlot
			? weaponSlot.type.toLowerCase()
			: weaponObject.additionalWeaponData.type.toLowerCase();
		//
		const markup = `
				<div class="${classNames.weaponSpriteParent}">
					${this.#weaponBackgroundSprite(weaponType, weaponSize)}
					<div class="${classNames.weaponSprite}">
						<img src="/${URL.DATA}/${turretSprite}" alt="weapon base sprite" class="${
			classNames.weaponSpriteBase
		}"/>
						${markupForGunSprite}
					</div>
				</div>
				${this.#weaponArcRenderMarkup(weaponSlot)}`;
		return markup;
	}
	#weaponTypeSprite(weaponObject) {
		const editedString = weaponObject.type.toLowerCase();
		const targetFile = `damagetype_${editedString}.png`;
		return `<img src="/${URL.UI_ICONS}/${targetFile}" alt="weapon damage type" class="${classNames.weaponDamageType}"/>`;
	}
	// Render
	render(data) {
		this.#data = data;
		if (!this.#parentElement)
			this.#parentElement = document.querySelector(`.${this.#parentClass}`);

		const markup = `
				<div class="${classNames.weaponPopUp}"></div>
                <ul class="${classNames.shipAndWeaponsHolder}">
                  	<li class="${classNames.weaponSlotsHolder}">
                    	<ul class="${classNames.weaponSlots}"></ul>
                  	</li>
                  	<img src="/${URL.DATA}/${
			this.#data.currentShip.spriteName
		}" alt="ship" class="${classNames.shipSprite}" />
                </ul>
                  `;
		//
		this.clearRender(this.#parentElement);
		this.#parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	weaponSlotRender(baseWeaponSlots) {
		const localParent = `.${classNames.weaponSlots}`;
		const markup = baseWeaponSlots
			.map((slot) => this.#weaponSlotMarkUp(slot))
			.join("");
		return [markup, localParent];
	}
	// weaponPopUpRender() {
	// 	const localParent = `.${classNames.weaponPopUpParent}`;
	// 	document.querySelector(`.${classNames.weaponPopUpParent}`).classList.remove(`${classNames.dNone}`);

	// 	const markup = `
	// 		<div class="${classNames.weaponPopUp}">
	// 			<div class="${classNames.hoverAdditionalInformation}"></div>
	// 			<div class="${classNames.weaponPopUpTable}">
	// 				<ul class="${classNames.weaponPopUpFilter}"></ul>
	// 				<div class="${classNames.weaponPopUpTableWrapper}">
	// 					<table class="${classNames.weaponPopUpTableBody}">
	// 					<thead></thead>
	// 					<tbody></tbody>
	// 					</table>
	// 				</div>
	// 			</div>
	// 		</div>
	// `;
	// 	return [markup, localParent];
	// }
	// weaponPopUpTableHeader() {
	// 	const localParent = `.${classNames.weaponPopUpTable} thead`;

	// 	const markup = `
	// 				<tr class="${classNames.weaponPopUpTableHeader}">
	// 					<th></th>
	// 					<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="name">
	// 						<div>
	// 							<p>Name</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
	// 						</div>
	// 					</th>
	// 					<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="type">
	// 						<div>
	// 							<p>Type</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
	// 						</div>
	// 					</th>
	// 					<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="range">
	// 						<div>
	// 							<p>Range</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
	// 						</div>
	// 					</th>
	// 					<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="cost">
	// 						<div>
	// 							<p>Cost</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
	// 						</div>
	// 					</th>
	// 				</tr>
	// 			`;

	// 	return [markup, localParent];
	// }
	// weaponPopUpTableContentRender(weaponArray, currentInstalledWeapons, currentWeaponSlot) {
	// 	const localParent = `.${classNames.weaponPopUpTable} tbody`;
	// 	const weaponTypeStringConversion = (damageType) => {
	// 		const convertedString = damageType
	// 			.split("_")
	// 			.map((word) => word[0] + word.slice(1).toLowerCase())
	// 			.join(" ")
	// 			.toUpperCase();

	// 		const specialCases = {
	// 			"HIGH EXPLOSIVE": "EXPLOSIVE",
	// 			"FRAGMENTATION": "FRAGMEN", // prettier-ignore
	// 		};

	// 		return specialCases[convertedString] || convertedString;
	// 	};
	// 	const findCurrentInstalledWeapon = (currentWeaponSlot, weaponId) =>
	// 		currentInstalledWeapons.find(([slotId, wpnId]) => slotId === currentWeaponSlot.id && wpnId === weaponId);
	// 	//
	// 	const processWeaponArray = () => {
	// 		let activeWeaponClassObject;

	// 		const modifiedWeaponsArray = weaponArray.filter((wpnObj) => {
	// 			const currentInstalledWeaponKeyPair = findCurrentInstalledWeapon(currentWeaponSlot, wpnObj.id);

	// 			if (currentInstalledWeaponKeyPair) {
	// 				activeWeaponClassObject = wpnObj;
	// 				return false;
	// 			}

	// 			return true;
	// 		});

	// 		if (activeWeaponClassObject) {
	// 			modifiedWeaponsArray.unshift(activeWeaponClassObject);
	// 		}

	// 		return modifiedWeaponsArray;
	// 	};
	// 	//
	// 	const checkIfCorrectWeapon = (wpnObj) => {
	// 		const [correctWeaponValue] = currentInstalledWeapons.filter((wpn) => {
	// 			if (wpn[0] === currentWeaponSlot.id && wpn[1] === wpnObj.id) {
	// 				return true;
	// 			}
	// 		});
	// 		if (correctWeaponValue) {
	// 			return true;
	// 		}
	// 	};
	// 	//
	// 	const activeClass = (wpnObj) => {
	// 		if (checkIfCorrectWeapon(wpnObj)) {
	// 			return ` ${classNames.weaponPopUpActive}`;
	// 		}
	// 		return "";
	// 	};
	// 	//
	// 	const markup = processWeaponArray()
	// 		.map((weaponObj) => {
	// 			if (Number.parseInt(weaponObj.OPs) === 0 || !weaponObj.OPs) return "";

	// 			const weaponType = weaponObj.additionalWeaponData.type.toLowerCase();
	// 			const weaponSize = weaponObj.additionalWeaponData.size.toLowerCase();
	// 			const markup = `
	// 					<tr class="${classNames.weapon} ${classNames.weaponSize}--${weaponSize} ${classNames.weaponType}--${weaponType}${activeClass(weaponObj)}" data-id="${
	// 				weaponObj.id
	// 			}">
	// 						<td class="${classNames.weaponIcon}">${this.#weaponIconMarkup(weaponObj)}</td>
	// 						<td class="${classNames.weaponName}">${weaponObj.name}</td>
	// 						<td class="${classNames.weaponType} ${classNames.weaponType}--${weaponObj.type.toLowerCase()}">${weaponTypeStringConversion(weaponObj.type)}</td>
	// 						<td class="${classNames.weaponRange}">${weaponObj.range}</td>
	// 						<td class="${classNames.weaponCost}">${weaponObj.OPs}</td>
	// 					</tr>`;
	// 			return markup;
	// 		})
	// 		.join("");

	// 	return [markup, localParent];
	// }

	weaponPopUpHoverAdditionalInformationRender(
		weaponObjectEditedData,
		weaponObject
	) {
		const localParent = `.${classNames.hoverAdditionalInformation}`;

		// document
		// 	.querySelector(localParent)
		// 	.classList.remove(classNames.dNone);

		const {
			stats,
			information,
			additionalStats,
			string,
			damageTypeEffect,
			accuracyRating,
			turnRateRating,
		} = weaponObjectEditedData;

		const contentMarkUp = (str, data) => {
			return `
				<li>
					${str !== "" ? `<p>${str}</p>` : ""}
					<strong><p>${data}</p></strong>
				</li>`;
		};

		//
		const fluxMarkUp = () => {
			const fluxPerShotMarkup = stats.flux.perShot
				? `${contentMarkUp("Flux / shot", stats.flux.perShot)}`
				: "";
			const fluxPerSecondMarkup = additionalStats.fluxPerSecond
				? `${contentMarkUp("Flux / sec", additionalStats.fluxPerSecond)}`
				: "";
			const fluxPerDamageMarkup = additionalStats.fluxPerDamage
				? `${contentMarkUp("Flux / damage", additionalStats.fluxPerDamage)}`
				: "";

			const markup = `
				${fluxPerSecondMarkup}
				${fluxPerShotMarkup}
				${fluxPerDamageMarkup}`;
			return markup;
		};
		const weaponTypeString = stats.projectile.type
			.split("_")
			.map((str) => capitalizeFirstLetter(str.toLowerCase()))
			.join(" ");

		//! Way to many useless classes
		// class="${this.#weaponMountTypeClass}"
		const primaryDataMarkUp = `
    	<div class="d-grid weapon-primary-data">
          <div class="weapon-primary-data__icon">
            <li class="${classNames.weaponIcon} ${classNames.weaponSize}--${
			stats.mount.size
		} ${classNames.weaponType}--${stats.mount.type}" data-id="${
			information.id
		}">${this.#weaponIconMarkup(weaponObject)}</li>
          </div>
			<div class="weapon-primary-data_content">
				${contentMarkUp("Primary Role", information.primaryRole)}
				<li>
					<p>Mount Type:</p>
					<div class="${classNames.textAlignRight}">
						<strong><p>${capitalizeFirstLetter(stats.mount.type)}</p></strong>
						<strong><p>${capitalizeFirstLetter(stats.mount.size)}</p></strong>
					</div>
				</li>
				${contentMarkUp("Ordinance Point", information.op)}

				<div class="${classNames.weaponContentGroup}">
					${contentMarkUp("Range", stats.range)}
					${
						!additionalStats.isWeaponBeam
							? contentMarkUp("Damage", string.damageString)
							: ""
					}
					${contentMarkUp("Damage / sec", additionalStats.damagePerSecond)}
				</div>
				${fluxMarkUp()}
			</div>
          </div>
    `;
		const anciliaryDataMarkUp = `
			<div class="d-grid weapon-anciliary-data">
				<div class="weapon-anciliary-data__icon-parent">
					<li class="weapon-anciliary-data__icon">${this.#weaponTypeSprite(
						weaponObject
					)}</li>
				</div>
				<div class="weapon-primary-data_content">
					<li class="${classNames.weaponDamageType}">
						<p>Damage Type:</p>
						<div class="${classNames.textAlignRight}">
							<strong><p>${weaponTypeString}</p></strong>
							<strong><p>${damageTypeEffect()}</p></strong>
						</div>
					</li>
					${contentMarkUp("Accuracy", accuracyRating())}
					${contentMarkUp("Turn rate", turnRateRating())}
					
					${
						stats.ammo.burstSize < 2 || !stats.ammo.burstSize
							? ""
							: contentMarkUp("Burst Size", stats.ammo.burstSize)
					}
					${stats.ammo.capacity ? contentMarkUp("Ammo Size", stats.ammo.capacity) : ""}
					${
						stats.ammo.capacity
							? contentMarkUp("Ammo Per Sec", stats.ammo.perSecond)
							: ""
					}

					${contentMarkUp("Refire delay", string.refireDelayString)}
				</div>
			</div>`;

		//! Wrong implementation of ShortString. I need to rework it
		// 15/12/2024
		const introDataMarkUp = `
				<li class="weapon-name">
					<p>Weapon Name</p>
					<p>${information.name}</p>
				</li>
				<li class="${classNames.weaponDescription}"><p>${string.shortWeaponDescription}.</p></li>`;
		const markup = `
			<ul>
				${introDataMarkUp}
				<li class="weapon-divider"><p>Primary Data</p></li>
				${primaryDataMarkUp}
				<li class="weapon-divider"><p>Anciliary Data</p></li>
				${anciliaryDataMarkUp}
			</ul>
		`;
		return [markup, localParent];
	}
	weaponPopUpTurnCurrentActiveWeaponInactive(btn) {
		btn.classList.remove(`${classNames.weaponPopUpActive}`);
	}

	addCurrentWeaponSpriteToShipRender(currentWeaponSlot, weaponObject) {
		const slotId = currentWeaponSlot.id;
		const localParent = `[data-id="${slotId}"]`;
		const markup = `${this.#weaponIconMarkup(weaponObject, currentWeaponSlot)}`;

		return [markup, localParent];
	}
}

export default new BuilderCenterView();
