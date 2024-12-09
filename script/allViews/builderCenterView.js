import View from "./view.js";
import { capitalizeFirstLetter } from "../helperFunction.js";
import * as URL from "../url.js";

class BuilderCenterView extends View {
	#data;
	#parentClass = "box__middle-center";
	#parentElement;
	// DOM classes
	#shipSpriteClass = "ship-sprite";
	#shipAndWeaponsHolderClass = "ship-weapons-slots__holder";
	#weaponSlotsHolderClass = "weapon-slots__holder";
	#weaponSlotsClass = "weapon-slots";
	weaponSlotClass = "weapon-slot";
	#weaponSlotTypeClass = "weapon-slot-type";

	#weaponSlotIcon = "";
	//
	#weaponTypeClass = "weapon__type";
	#weaponSizeClass = "weapon__size";
	#weaponOpacityClass = "weapon__opacity";

	#weaponBackgroundSpriteParentClass = "weapon-background-sprite-parent";
	#weaponBackgroundSpriteClass = "weapon-background-sprite";
	#weaponBackgroundSpriteTypeClass = "weapon-background-sprite__type";
	#weaponBackgroundSpriteSizeClass = "weapon-background-sprite__size";
	#weaponBackgroundSpriteOppacityClass = "weapon-background-sprite__opacity";
	//
	#weaponSpriteParent = "weapon-sprite-parent";
	weaponSprite = "weapon-sprite";

	// Filter
	#weaponPopUpFilterClass = "weapon-filter";
	#weaponPopUpFilterButtonClass = "weapon-filter__button";
	#weaponPopUpFilterHideButtonClass = "weapon-filter__button--hide";
	#weaponPopUpFilterButtonsClass = "weapon-filter__buttons";

	// Weapon Hover Additional Information
	#hoverAdditionalInformationClass = "hover-additional-information";
	// Weapon Pop Up
	// weaponPopUpClass = "weapon-pop-up";

	// Weapon Pop Up Table
	#weaponPopUpTableClass = "weapon-pop-up__table";
	#weaponPopUpTableWrapperClass = "weapon-pop-up__table-wrapper";
	#weaponPopUpTableBodyClass = "weapon-pop-up__table-body";
	#weaponPopUpTableHeaderClass = `weapon-pop-up__theader`;
	#tableHeaderElementClass = `theader-element`;
	// Weapon Element
	#weaponElementClass = "weapon";
	#weaponElementNameClass = "weapon__name";
	#weaponElementIconClass = "weapon__icon";
	#weaponElementRangeClass = "weapon__range";
	#weaponElementCostClass = "weapon__cost";

	// general
	// dNoneClass = "d-none";
	#weaponPopUpActiveClass = "weapon--active";
	#unselectableClass = "unselectable";
	#textBoldGeneric = "text-bold";

	// weapon sprite
	#weaponSpriteGunClass = "weapon-sprite--gun";
	#weaponSpriteBaseClass = "weapon-sprite--base";
	//
	#targetRem = 10; // rem for shipSpriteSize / WeaponSlotsPosition / shipGAP
	#weaponArc = "weapon-arc";
	#weaponArcSprite = "weapon-arc__sprite";
	//
	#weaponMountTypeClass = "weapon-mount-type";
	#weaponMountTypeContentClass = "weapon-mount-type__content";
	#weaponDamageTypeClass = "weapon-damage-type";
	//

	// Regular
	weaponArcAndAngleChangeCoords() {
		const weaponArcs = document.querySelectorAll(`.${this.#weaponArc}`);

		weaponArcs.forEach((wpnArc) => {
			const secondaryArc = wpnArc.querySelector(`.${this.#weaponArcSprite}`);
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
			`.${this.weaponSlotClass}`
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
			`.${this.weaponSlotClass}`
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
		const targetElement = document.querySelector(`.${this.#shipSpriteClass}`);
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
					<button class="${this.weaponSlotClass} ${
			this.#weaponSizeClass
		}--${weaponSize} ${this.#weaponTypeClass}--${weaponType}" 
					data-id="${currentWeaponSlot.id}">
						<div class="${this.#weaponSpriteParent}">
							${this.#weaponTypeBackgroundMarkup(currentWeaponSlot)}
						</div>
            			${this.#weaponArcRenderMarkup(currentWeaponSlot)}
					</button>`;
		return markup;
	}
	#weaponArcRenderMarkup(currentWeaponSlot) {
		if (!currentWeaponSlot) return "";
		return `<div class="${this.#weaponArc}" data-id="${
			currentWeaponSlot.id
		}" data-arc="${currentWeaponSlot.arc}" data-angle="${
			currentWeaponSlot.angle
		}"><div class="${this.#weaponArcSprite}"></div></div>`;
	}
	// TODO is this a copy?
	#weaponTypeBackgroundMarkup = (currentWeaponSlot) => {
		const weaponType = currentWeaponSlot.type.toLowerCase();
		const weaponSize = currentWeaponSlot.size.toLowerCase();
		return this.#weaponBackgroundSprite(weaponType, weaponSize);
	};

	#weaponBackgroundSpriteMarkUpAndSelector(weaponType, weaponSize) {
		const weaponMarkup = (size, type, oppacity) => {
			return `<div class="${this.#weaponBackgroundSpriteClass} ${
				this.#weaponBackgroundSpriteSizeClass
			}--${size} ${this.#weaponBackgroundSpriteTypeClass}--${type} ${
				this.#weaponBackgroundSpriteOppacityClass
			}--${oppacity}"></div>`;
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
			this.#weaponBackgroundSpriteParentClass
		}">${this.#weaponBackgroundSpriteMarkUpAndSelector(
			weaponType,
			weaponSize
		)}</div>`;
	}
	#weaponIconMarkup(weaponObject, weaponSlot) {
		const turretSprite = weaponObject.additionalWeaponData.turretSprite;
		const turretGunSprite = weaponObject.additionalWeaponData.turretGunSprite;
		const markupForGunSprite = turretGunSprite
			? `<img src="/${URL.DATA}/${turretGunSprite}" alt="gun sprite" class="${
					this.#weaponSpriteGunClass
			  }" />`
			: "";

		const weaponSize = weaponSlot
			? weaponSlot.size.toLowerCase()
			: weaponObject.additionalWeaponData.size.toLowerCase();
		const weaponType = weaponSlot
			? weaponSlot.type.toLowerCase()
			: weaponObject.additionalWeaponData.type.toLowerCase();
		//
		const markup = `
				<div class="${this.#weaponSpriteParent}">
					${this.#weaponBackgroundSprite(weaponType, weaponSize)}
					<div class="${this.weaponSprite}">
						<img src="/${URL.DATA}/${turretSprite}" alt="weapon base sprite" class="${
			this.#weaponSpriteBaseClass
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
		return `<img src="/${
			URL.UI_ICONS
		}/${targetFile}" alt="weapon damage type" class="${
			this.#weaponDamageTypeClass
		}"/>`;
	}
	// Render
	render(data) {
		this.#data = data;
		if (!this.#parentElement)
			this.#parentElement = document.querySelector(`.${this.#parentClass}`);
		const markup = `
				<div class="${this.weaponPopUpParentClass} ${this.dNoneClass}"></div>
                <ul class="${this.#shipAndWeaponsHolderClass}">
                  	<li class="${this.#weaponSlotsHolderClass}">
                    	<ul class="${this.#weaponSlotsClass}"></ul>
                  	</li>
                  	<img src="/${URL.DATA}/${
			this.#data.currentShip.spriteName
		}" alt="ship" class="${this.#shipSpriteClass}" />
                </ul>
                  `;
		//
		this.clearRender(this.#parentElement);
		this.#parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	weaponSlotRender(baseWeaponSlots) {
		const localParent = `.${this.#weaponSlotsClass}`;
		const markup = baseWeaponSlots
			.map((slot) => this.#weaponSlotMarkUp(slot))
			.join("");
		return [markup, localParent];
	}
	weaponPopUpRender() {
		const localParent = `.${this.weaponPopUpParentClass}`;
		document
			.querySelector(`.${this.weaponPopUpParentClass}`)
			.classList.remove(`${this.dNoneClass}`);

		const markup = `
			<div class="${this.weaponPopUpClass}">
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
	weaponPopUpTableHeader() {
		const localParent = `.${this.#weaponPopUpTableClass} thead`;

		const markup = `
					<tr class="${this.#weaponPopUpTableHeaderClass}">
						<th></th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${
			this.#tableHeaderElementClass
		} ${this.#unselectableClass}" data-category="name">
							<div>
								<p>Name</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${
			this.#tableHeaderElementClass
		} ${this.#unselectableClass}" data-category="type">
							<div>
								<p>Type</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${
			this.#tableHeaderElementClass
		} ${this.#unselectableClass}" data-category="range">
							<div>
								<p>Range</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${
			this.#tableHeaderElementClass
		} ${this.#unselectableClass}" data-category="cost">
							<div>
								<p>Cost</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
					</tr>
				`;

		return [markup, localParent];
	}
	weaponPopUpTableContentRender(
		weaponArray,
		currentInstalledWeapons,
		currentWeaponSlot
	) {
		const localParent = `.${this.#weaponPopUpTableClass} tbody`;
		const weaponTypeStringConversion = (damageType) => {
			const convertedString = damageType
				.split("_")
				.map((word) => word[0] + word.slice(1).toLowerCase())
				.join(" ")
				.toUpperCase();

			const specialCases = {
				"HIGH EXPLOSIVE": "EXPLOSIVE",
				"FRAGMENTATION": "FRAGMEN", // prettier-ignore
			};

			return specialCases[convertedString] || convertedString;
		};
		const findCurrentInstalledWeapon = (currentWeaponSlot, weaponId) =>
			currentInstalledWeapons.find(
				([slotId, wpnId]) =>
					slotId === currentWeaponSlot.id && wpnId === weaponId
			);
		//
		const processWeaponArray = () => {
			let activeWeaponClassObject;

			const modifiedWeaponsArray = weaponArray.filter((wpnObj) => {
				const currentInstalledWeaponKeyPair = findCurrentInstalledWeapon(
					currentWeaponSlot,
					wpnObj.id
				);

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
		//
		const markup = processWeaponArray()
			.map((weaponObj) => {
				if (Number.parseInt(weaponObj.OPs) === 0 || !weaponObj.OPs) return "";

				const weaponType = weaponObj.additionalWeaponData.type.toLowerCase();
				const weaponSize = weaponObj.additionalWeaponData.size.toLowerCase();
				const markup = `
						<tr class="${this.#weaponElementClass} ${
					this.#weaponSizeClass
				}--${weaponSize} ${this.#weaponTypeClass}--${weaponType}${activeClass(
					weaponObj
				)}" data-id="${weaponObj.id}">
							<td class="${this.#weaponElementIconClass}">${this.#weaponIconMarkup(
					weaponObj
				)}</td>
							<td class="${this.#weaponElementNameClass}">${weaponObj.name}</td>
							<td class="${this.#weaponTypeClass} ${
					this.#weaponTypeClass
				}--${weaponObj.type.toLowerCase()}">${weaponTypeStringConversion(
					weaponObj.type
				)}</td>
							<td class="${this.#weaponElementRangeClass}">${weaponObj.range}</td>
							<td class="${this.#weaponElementCostClass}">${weaponObj.OPs}</td>
						</tr>`;
				return markup;
			})
			.join("");

		return [markup, localParent];
	}

	weaponPopUpHoverAdditionalInformationRender(
		weaponObjectEditedData,
		weaponObject
	) {
		const localParent = `.${this.#hoverAdditionalInformationClass}`;
		document.querySelector(localParent).classList.remove(this.dNoneClass);

		const {
			stats,
			information,
			additionalStats,
			string,
			damageTypeEffect,
			accuracyRating,
			turnRateRating,
		} = weaponObjectEditedData;

		const ammoElementMarkUp = () => {
			const markup = `
				<li class="weapon-ammo-size">
					<p>Ammo Size:</p>
					<p class="${this.#textBoldGeneric}">${stats.ammo.capacity}</p>
				</li>
				<li class="weapon-ammo-per-sec">
					<p>Ammo Per Sec:</p>
					<p class="${this.#textBoldGeneric}">${stats.ammo.perSecond}</p>
				</li>`;

			if (stats.ammo.capacity) return markup;
			return "";
		};

		const weaponBurstSize = () => {
			if (stats.ammo.burstSize < 2 || !stats.ammo.burstSize) return "";
			const markup = `
				<li class="weapon-burst-size">
					<p>Burst Size:</p>
					<p class="${this.#textBoldGeneric}">${stats.ammo.burstSize}</p>
				</li>`;
			return markup;
		};

		const weaponProjectileTypeMarkUp = () => {
			const weaponDamageMarkup = `
				<li class="weapon-damage">
					<p>Damage:</p>
					<p class="${this.#textBoldGeneric}">${string.damageString}</p>
				</li>
			`;
			const weaponDamageSecMarkup = `
				<li class="weapon-damage-sec">
					<p>Damage / sec:</p>
					<p class="${this.#textBoldGeneric}">${additionalStats.damagePerSecond}</p>
				</li>
			`;
			const markup = `
				${!additionalStats.isWeaponBeam ? weaponDamageMarkup : ""}
				${weaponDamageSecMarkup}
			`;
			return markup;
		};
		//
		const fluxMarkUp = () => {
			const fluxPerShotMarkup = stats.flux.perShot
				? `
						<li class="weapon-flux-shot">
							<p>Flux / shot:</p>
							<p class="${this.#textBoldGeneric}">${stats.flux.perShot}</p>
						</li>`
				: "";
			const fluxPerSecondMarkup = additionalStats.fluxPerSecond
				? `
						<li class="weapon-flux-sec">
							<p>Flux / sec:</p>
							<p class="${this.#textBoldGeneric}">${additionalStats.fluxPerSecond}</p>
						</li>`
				: "";
			const fluxPerDamageMarkup = additionalStats.fluxPerDamage
				? `
						<li class="weapon-flux-damage">
							<p>Flux / damage:</p>
							<p class="${this.#textBoldGeneric}">${additionalStats.fluxPerDamage}</p>
						</li>`
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

		const primaryDataMarkUp = `
    	<div class="d-grid weapon-primary-data">
          <div class="weapon-primary-data__icon">
            <li class="${this.#weaponElementIconClass} ${
			this.#weaponSizeClass
		}--${stats.mount.size} ${this.#weaponTypeClass}--${
			stats.mount.type
		}" data-id="${information.id}">${this.#weaponIconMarkup(weaponObject)}</li>
          </div>
			<div class="weapon-primary-data_content">
				<li class="weapon-role">
					<p>Primary Role:</p>
					<p class="${this.#textBoldGeneric}">${information.primaryRole}</p>
				</li>
				<li class="${this.#weaponMountTypeClass}">
					<p>Mount Type:</p>
					<div class="${this.#weaponMountTypeContentClass}">
						<p class="${this.#textBoldGeneric}">${capitalizeFirstLetter(
			stats.mount.type
		)}</p>
						<p class="${this.#textBoldGeneric}">${capitalizeFirstLetter(
			stats.mount.size
		)}</p>
					</div>
				</li>
				<li class="weapon-cost">
					<p>Ordinance Point:</p>
					<p class="${this.#textBoldGeneric}">${information.op}</p>
				</li>
				<div class="weapon-range-damage-group">
					<li class="weapon-range">
						<p>Range:</p>
						<p class="${this.#textBoldGeneric}">${stats.range}</p>
					</li>
					${weaponProjectileTypeMarkUp()}
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
					<li class="${this.#weaponDamageTypeClass}">
						<p>Damage Type:</p>
						<div class="${this.#weaponDamageTypeClass}--content">
							<p class="${this.#textBoldGeneric}">${weaponTypeString}</p>
							<p class="${this.#textBoldGeneric}">${damageTypeEffect()}</p>
						</div>
					</li>
					<li class="weapon-accuracy">
						<p>Accuracy:</p>
						<p class="${this.#textBoldGeneric}">${accuracyRating()}</p>
					</li>
					<li class="weapon-turn-rate">
						<p>Turn rate:</p>
						<p class="${this.#textBoldGeneric}">${turnRateRating()}</p>
					</li>
					${weaponBurstSize()}
					${ammoElementMarkUp()}
					<li class="weapon-refire-delay">
						<p>Refire delay:</p>
						<p class="${this.#textBoldGeneric}">${string.refireDelayString}</p>
					</li>
				</div>
			</div>`;
		const introDataMarkUp = `
				<li class="weapon-name">
					<p>Weapon Name</p>
					<p>${information.name}</p>
				</li>
				<li class="weapon-description"><p>${string.shortWeaponDescription}.</p></li>`;
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
		btn.classList.remove(`${this.#weaponPopUpActiveClass}`);
	}

	addCurrentWeaponSpriteToShipRender(currentWeaponSlot, weaponObject) {
		const slotId = currentWeaponSlot.id;
		const localParent = `[data-id="${slotId}"]`;
		const markup = `${this.#weaponIconMarkup(weaponObject, currentWeaponSlot)}`;

		return [markup, localParent];
	}
	removeCurrentWeaponSpriteToShipRender(id) {
		const parentTarget = `[data-id="${id}"]`;
		const elementTarget = `${this.weaponSprite}`;

		const localParent = `${parentTarget} .${elementTarget}`;
		const markup = ``;
		return [markup, localParent];
	}
	// Handlers
	weaponPopUpHeaderHandler(callback) {
		const localParent = `.${this.#weaponPopUpTableHeaderClass}`;
		const eventTarget = `.${this.#tableHeaderElementClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpTableHandler(callback) {
		const localParent = `.${this.#weaponPopUpTableClass}`;
		const eventTarget = `.${this.#weaponElementClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpRemoveCurrentWeapon(callback) {
		const localParent = `.${this.#weaponPopUpTableClass}`;
		const eventTarget = `.${this.#weaponPopUpActiveClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpHoverEffect(callback) {
		const localParent = `.${this.#weaponPopUpTableClass}`;
		const eventTarget = `.${this.#weaponElementClass}`;
		const actionType = "mouseover";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponButtonHandler(callback) {
		const localParent = `.${this.#weaponSlotsClass}`;
		const eventTarget = `.${this.weaponSlotClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}

	//! I need to add button to hide handler
	// weaponPopUpHideButtonHandler(callback) {
	// 	const localParent = `.${this.#weaponPopUpFilterClass}`;
	// 	const eventTarget = `.${this.#weaponPopUpFilterHideButtonClass}`;
	// 	const actionType = "click";
	// 	return [localParent, eventTarget, actionType, callback];
	// }

	weaponPopUpHideWhenClickOutsideHandler() {
		const localParent = document.querySelector(".build-maker__work-area");
		const eventTarget = localParent.querySelector(
			`.${this.#weaponPopUpTableBodyClass}`
		);
		const elementTarget = localParent.querySelector(
			`.${this.weaponPopUpClass}`
		);
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

	///
}

export default new BuilderCenterView();
// weaponPopUpCloseOnHover() {
// 	this.weaponPopUpFormRemover();
// }
