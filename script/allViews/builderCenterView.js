import View from "./view.js";

class BuilderCenterView extends View {
	#data;
	#parentClass = "box__middle-center";
	#parentElement;
	// DOM classes
	#shipSpriteClass = "ship-sprite";
	#shipAndWeaponsHolderClass = "ship-weapons-slots__holder";
	#weaponSlotsHolderClass = "weapon-slots__holder";
	#weaponSlotsClass = "weapon-slots";
	#weaponSlotClass = "weapon-slot";
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
	#weaponSprite = "weapon-sprite";

	// Filter
	#weaponPopUpFilterClass = "weapon-filter";
	#weaponPopUpFilterButtonClass = "weapon-filter__button";
	#weaponPopUpFilterHideButtonClass = "weapon-filter__button--hide";
	#weaponPopUpFilterButtonsClass = "weapon-filter__buttons";

	// Weapon Hover Additional Information
	// #hoverAdditionalInformationHolderClass = "hover-additional-information-holder";
	#hoverAdditionalInformationClass = "hover-additional-information";
	// Weapon Pop Up
	//   #weaponPopUpHolderClass = "weapon-pop-up__holder";
	#weaponPopUpClass = "weapon-pop-up";

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
	#dNoneClass = "d-none";
	#weaponPopUpActiveClass = "weapon--active";
	#unselectableClass = "unselectable";

	// weapon sprite
	#weaponSpriteGunClass = "weapon-sprite--gun";
	#weaponSpriteBaseClass = "weapon-sprite--base";
	//
	#targetRem = 10; // rem for shipSpriteSize / WeaponSlotsPosition / shipGAP
	#weaponArc = "weapon-arc";
	#weaponArcSprite = "weapon-arc__sprite";

	// Regular
	weaponArcAndAngleChangeCoords() {
		const weaponArcs = document.querySelectorAll(`.${this.#weaponArc}`);

		weaponArcs.forEach((wpnArc) => {
			const secondaryArc = wpnArc.querySelector(`.${this.#weaponArcSprite}`);
			//
			const { arc, angle } = wpnArc.dataset;
			const halfArc = arc / 2;
			let reverseAngle = -angle;
			//
			wpnArc.style.setProperty("--after-rotate", `${halfArc}deg`);
			wpnArc.style.setProperty("--before-rotate", `-${halfArc}deg`);
			wpnArc.style.setProperty("--weapon-angle", `${reverseAngle}deg`);
			//
			secondaryArc.style.setProperty("--arc-mask-color", `${arc}deg`);
			secondaryArc.style.setProperty("--arc-mask-transparent", `${arc}deg`);
		});
	}
	weaponSlotChangePosition(data) {
		//! Should Not be here
		const { viewOffset, center, width, height } = data.currentShip;
		const allWeaponSlotsElements = document.querySelectorAll(`.${this.#weaponSlotClass}`);
		const weaponSlots = data.currentShipBuild._baseWeaponSlots;
		const centerX = center[0] - width;
		const centerY = center[1] - height;

		//
		allWeaponSlotsElements.forEach((el) => {
			const { id } = el.dataset;
			const [currentWeaponSlotData] = weaponSlots.filter((slot) => slot.id === id);
			const currentWeaponSlotLocationData = currentWeaponSlotData.locations;
			const posX = currentWeaponSlotLocationData[1];
			const posY = currentWeaponSlotLocationData[0];
			// const weaponSlotHeight = el.clientHeight;
			// const weaponSlotWidth = el.clientWidth;

			const posLeft = -posX - centerX;
			const posTop = -posY - centerY;

			const posLeftRem = posLeft / this.#targetRem;
			const posTopRem = posTop / this.#targetRem;

			//
			el.style.left = `${posLeftRem}rem`;
			el.style.top = `${posTopRem}rem`;

			//? causes issue with pos for some reason
			// el.style.transform = `translate(-${weaponSlotWidth / 2}px,-${weaponSlotHeight / 2}px)`;
			//? worked fine before
		});
		// console.log(weaponSlots);
		// console.log(allWeaponSlotsElements);
	}
	weaponPopUpUpdatePos(btn) {
		//! I need to fix position of hover
		// TODO
		const target = `.${this.#weaponPopUpClass}`;
		const targetElement = document.querySelector(target);
		const hoverContainerElement = targetElement.querySelector(`.${this.#hoverAdditionalInformationClass}`);
		const tableContainerElement = targetElement.querySelector(`.${this.#weaponPopUpTableClass}`);

		const shipSprite = document.querySelector(`.${this.#shipSpriteClass}`);
		const shipSpriteWidth = Number.parseInt(shipSprite.width) + 20;

		// const offsetToRightBy = 13 * this.#targetRem;
		// const offsetToRightBy = 1;

		// const offsetToLeftBy = 22;
		// const offsetPadding = 16;
		//
		// // const containerFlexboxGapValue = (shipSpriteWidth + offsetPadding * 6) / this.#targetRem;
		// const shipCenterPx = shipSpriteWidth / 2;
		// const offsetToRightTable = Math.floor(
		//   (shipCenterPx + offsetToRightBy) / this.#targetRem
		// );
		// const offsetToLeftHoverContainer = Math.floor(
		//   (shipCenterPx - offsetToLeftBy) / this.#targetRem
		// );

		// issue is here
		// weapon-pop-up__table
		tableContainerElement.style.left = `${shipSpriteWidth}px`;
		hoverContainerElement.style.right = `${2}rem`;

		// targetElement.style.gap = `${Math.floor(containerFlexboxGapValue)}rem`;
	}
	weaponSlotActiveClass(btn) {
		const allWeaponSlots = document.querySelectorAll(`.${this.#weaponSlotClass}`);
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
		// TODO
		//! This should not be here.
		//! calculations should be done in viewModel
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
			styleSheet.sheet.insertRule(`.${className} { width:${spriteWidthRem}rem; height:${spriteHeightRem}rem;}`, styleSheet.sheet.cssRules.length);
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
					<button class="${this.#weaponSlotClass} ${this.#weaponSizeClass}--${weaponSize} ${this.#weaponTypeClass}--${weaponType}" 
					data-id="${currentWeaponSlot.id}">
						<div class="${this.#weaponSpriteParent}">
							${this.#weaponTypeBackgroundMarkup(currentWeaponSlot)}
						</div>
            <div class="${this.#weaponArc}" data-id="${currentWeaponSlot.id}" data-arc="${currentWeaponSlot.arc}" data-angle="${
			currentWeaponSlot.angle
		}">${this.#weaponArcRenderMarkup()}</div>
					</button>`;
		return markup;
	}
	#weaponArcRenderMarkup() {
		// const { id, arc, angle } = currentWeaponSlot;
		// console.log(`Arc: ${arc}`);
		// console.log(`Angle: ${angle}`);

		return `<div class="${this.#weaponArcSprite}"></div>`;
	}
	// TODO is this a copy?
	#weaponTypeBackgroundMarkup = (currentWeaponSlot) => {
		const weaponType = currentWeaponSlot.type.toLowerCase();
		const weaponSize = currentWeaponSlot.size.toLowerCase();
		return this.#weaponBackgroundSprite(weaponType, weaponSize);
	};

	#weaponBackgroundSpriteMarkUpAndSelector(weaponType, weaponSize) {
		const weaponMarkup = (size, type, oppacity) => {
			return `<div class="${this.#weaponBackgroundSpriteClass} ${this.#weaponBackgroundSpriteSizeClass}--${size} ${
				this.#weaponBackgroundSpriteTypeClass
			}--${type} ${this.#weaponBackgroundSpriteOppacityClass}--${oppacity}"></div>`;
		};
		const weaponTypeSelector = () => {
			if (weaponType === "ballistic" || weaponType === "energy" || weaponType === "missile") {
				return weaponSize === "small"
					? weaponMarkup("small", weaponType, "full")
					: weaponSize === "medium"
					? weaponMarkup("small", weaponType, "medium") + weaponMarkup("medium", weaponType, "full")
					: weaponSize === "large"
					? weaponMarkup("small", weaponType, "light") + weaponMarkup("medium", weaponType, "medium") + weaponMarkup("large", weaponType, "full")
					: console.warn("error with weaponSizeLogic");
			}
			if (weaponType === "composite") {
				return weaponMarkup(weaponSize, weaponType, "full") + weaponMarkup(weaponSize, weaponType, "full");
			}
			if (weaponType === "hybrid") {
				return weaponMarkup(weaponSize, weaponType, "full") + weaponMarkup(weaponSize, weaponType, "full");
			}
			if (weaponType === "decorative") {
				return "";
			}
			if (weaponType === "synergy") {
				return weaponMarkup(weaponSize, weaponType, "full") + weaponMarkup(weaponSize, weaponType, "full");
			}
		};
		return weaponTypeSelector();
	}
	#weaponBackgroundSprite(weaponType, weaponSize) {
		return `<div class="${this.#weaponBackgroundSpriteParentClass}">${this.#weaponBackgroundSpriteMarkUpAndSelector(weaponType, weaponSize)}</div>`;
	}
	#weaponIconMarkup(weaponObject, weaponSlot) {
		const turretSprite = weaponObject.additionalWeaponData.turretSprite;
		const turretGunSprite = weaponObject.additionalWeaponData.turretGunSprite;
		const markupForGunSprite = turretGunSprite
			? `<img src="./starsectorData/${turretGunSprite}" alt="gun sprite" class="${this.#weaponSpriteGunClass}" />`
			: "";

		const weaponSize = weaponSlot ? weaponSlot[0].toLowerCase() : weaponObject.additionalWeaponData.size.toLowerCase();

		const weaponType = weaponSlot ? weaponSlot[1].toLowerCase() : weaponObject.additionalWeaponData.type.toLowerCase();

		const markup = `
				<div class="${this.#weaponSpriteParent}">
					${this.#weaponBackgroundSprite(weaponType, weaponSize)}
					<div class="${this.#weaponSprite}">
						<img src="./starsectorData/${turretSprite}" alt="weapon base sprite" class="${this.#weaponSpriteBaseClass}"/>
						${markupForGunSprite}
					</div>
				</div>`;
		return markup;
	}

	// Render
	render(data) {
		this.#data = data;
		if (!this.#parentElement) this.#parentElement = document.querySelector(`.${this.#parentClass}`);

		const markup = `
				<div class="${this.#weaponPopUpClass} ${this.#dNoneClass}"></div>
                <ul class="${this.#shipAndWeaponsHolderClass}">
                  	<li class="${this.#weaponSlotsHolderClass}">
                    	<ul class="${this.#weaponSlotsClass}"></ul>
                  	</li>
                  	<img src="./starsectorData/${this.#data.currentShip.spriteName}" alt="ship" class="${this.#shipSpriteClass}" />
                </ul>
                  `;

		this.clearRender(this.#parentElement);
		this.#parentElement.insertAdjacentHTML("afterbegin", markup);
	}
	//! Here

	weaponSlotRender(baseWeaponSlots) {
		const localParent = `.${this.#weaponSlotsClass}`;
		const markup = baseWeaponSlots.map((slot) => this.#weaponSlotMarkUp(slot)).join("");
		return [markup, localParent];
	}
	weaponPopUpRender() {
		const localParent = `.${this.#weaponPopUpClass}`;
		document.querySelector(`.${this.#weaponPopUpClass}`).classList.remove(`${this.#dNoneClass}`);

		const markup = `
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
    `;
		return [markup, localParent];
	}

	weaponPopUpTableHeader() {
		const localParent = `.${this.#weaponPopUpTableClass} thead`;

		const markup = `
					<tr class="${this.#weaponPopUpTableHeaderClass}">
						<th></th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="name">
							<div>
								<p>Name</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="type">
							<div>
								<p>Type</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="range">
							<div>
								<p>Range</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} ${this.#unselectableClass}" data-category="cost">
							<div>
								<p>Cost</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
					</tr>
				`;

		return [markup, localParent];
	}
	weaponPopUpTableContentRender(weaponArray, currentInstalledWeapons, [currentWeaponSlot] = []) {
		const localParent = `.${this.#weaponPopUpTableClass} tbody`;
		//
		const weaponTypeStringConversion = (damageType) => {
			const convertedString = damageType
				.split("_")
				.map((word) => {
					return word[0] + word.slice(1).toLowerCase();
				})
				.join(" ")
				.toUpperCase();

			if (convertedString === "HIGH EXPLOSIVE") return "EXPLOSIVE";
			if (convertedString === "FRAGMENTATION") return "FRAGMEN";

			return convertedString;
		};

		const checkIfCorrectWeapon = (wpnObj) => {
			const [test] = currentInstalledWeapons.filter((wpn) => {
				if (wpn[0] === currentWeaponSlot.id && wpn[1] === wpnObj.id) {
					// console.log("checkIfCorrectWeapon"); // Not Working
					return true;
				}
			});
			if (test) return true;
		};
		//
		const activeClass = (wpnObj) => {
			// console.log("Testing Active Class"); // Not Working

			if (checkIfCorrectWeapon(wpnObj)) {
				// console.log(wpnObj);
				// console.log("Add Active Class");
				return ` ${this.#weaponPopUpActiveClass}`;
			}
			return "";
		};
		//
		const markup = weaponArray
			.map((weaponObj) => {
				if (Number.parseInt(weaponObj.OPs) === 0 || !weaponObj.OPs) return "";

				const weaponType = weaponObj.additionalWeaponData.type.toLowerCase();
				const weaponSize = weaponObj.additionalWeaponData.size.toLowerCase();

				const markup = `
						<tr class="${this.#weaponElementClass} ${this.#weaponSizeClass}--${weaponSize} ${this.#weaponTypeClass}--${weaponType}${activeClass(weaponObj)}" data-id="${
					weaponObj.id
				}">
							<td class="${this.#weaponElementIconClass}">${this.#weaponIconMarkup(weaponObj)}</td>
							<td class="${this.#weaponElementNameClass}">${weaponObj.name}</td>
							<td class="${this.#weaponTypeClass} ${this.#weaponTypeClass}--${weaponObj.type.toLowerCase()}">${weaponTypeStringConversion(weaponObj.type)}</td>
							<td class="${this.#weaponElementRangeClass}">${weaponObj.range}</td>
							<td class="${this.#weaponElementCostClass}">${weaponObj.OPs}</td>
						</tr>`;
				return markup;
			})
			.join("");

		return [markup, localParent];
	}
	weaponTypeStrings(weaponType) {
		return weaponType === "all"
			? "ALL"
			: weaponType === "kinetic"
			? "KINETIC"
			: weaponType === "energy"
			? "ENERGY"
			: weaponType === "explosive"
			? "HIGH_EXPLOSIVE"
			: weaponType === "frag"
			? "FRAGMENTATION"
			: console.warn("issue with weapon types");
	}
	weaponPopUpHoverAdditionalInformationRender(weaponObject) {
		const localParent = `.${this.#hoverAdditionalInformationClass}`;
		document.querySelector(localParent).classList.remove(this.#dNoneClass);
		//

		const turnRateRating = () => {
			const turnRate = weaponObject.turn_rate;

			// if (!accuracy) return "";
			return turnRate > 40
				? `Excellent  (${turnRate})`
				: turnRate > 25
				? `Very Fast  (${turnRate})`
				: turnRate >= 20
				? `Fast (${turnRate})`
				: turnRate >= 15
				? `Slow (${turnRate})`
				: turnRate < 15
				? `Very Slow (${turnRate})`
				: "Error";
		};
		const ammoElement = () => {
			const ammoCap = weaponObject.ammo;

			const markup = `
				<li class="weapon-ammo-size">
					<p>Ammo Size:</p>
					<p>${ammoCap}</p>
				</li>
				<li class="weapon-ammo-per-sec">
					<p>Ammo Per Sec:</p>
					<p>${ammoSec}</p>
				</li>`;

			if (ammoCap) return markup;
			return "";
		};
		const accuracyRating = () => {
			const accuracy = weaponObject.spread_shot;

			// if (!accuracy) return "";
			return accuracy < 0.25 || !accuracy
				? `Perfect  (${accuracy ? accuracy : `< 0.25`})`
				: accuracy <= 1
				? `Good (${accuracy})`
				: accuracy <= 2
				? `Poor (${accuracy})`
				: accuracy <= 3
				? `Very Poor (${accuracy})`
				: accuracy <= 10
				? `Terrible (${accuracy})`
				: "Error";
		};
		const damageTypeEffect = () => {
			return weaponObject.type === this.weaponTypeStrings("kinetic")
				? "200% vs Shields / 50% vs Armor"
				: weaponObject.type === this.weaponTypeStrings("energy")
				? "100% vs Shields / 100% vs Armor"
				: weaponObject.type === this.weaponTypeStrings("explosive")
				? "50% vs Shields / 200% vs Armor"
				: weaponObject.type === this.weaponTypeStrings("frag")
				? "25% vs Shields / 25% vs Armor"
				: "Test";
		};

		const weaponBurstSize = () => {
			const burstSize = weaponObject.burst_size;
			if (burstSize < 2 || !burstSize) return "";
			const markup = `
				<li class="weapon-burst-size">
					<p>Burst Size:</p>
					<p>${burstSize}</p>
				</li>`;
			return markup;
		};
		const roundFloat = (num) => {
			return Math.round(num * 100) / 100;
		};
		// Properties
		const ammoSec = weaponObject.ammo_sec ?? 1;
		const burstSize = weaponObject.burst_size ?? 1;
		const fluxShot = weaponObject.energy_shot;
		const damagePerShot = weaponObject.damage_shot;
		const chargeDown = weaponObject.chargedown;
		const chargeUp = weaponObject.chargeup;
		const burstDelay = weaponObject.burst_delay ?? 0;

		//
		const refireDelay = chargeDown + chargeUp + burstDelay * (burstSize - 1);
		const damagePerSecond = Math.round((damagePerShot * burstSize) / refireDelay);
		const fluxPerSecond = Math.round(fluxShot / refireDelay);
		const fluxPerDamage = roundFloat(fluxShot / damagePerShot);
		// Strings
		const burstSizeString = weaponObject.burst_size && weaponObject.burst_size > 1 ? `x${weaponObject.burst_size}` : "";
		const damageString = `${weaponObject.damage_shot}${burstSizeString}`;
		const refireDelayString = roundFloat(refireDelay);
		const weaponDescription = weaponObject.description.split(".");
		const shortWeaponDescription = weaponDescription[0];
		//
		const weaponType = weaponObject.additionalWeaponData.type.toLowerCase();
		const weaponSize = weaponObject.additionalWeaponData.size.toLowerCase();

		const primaryDataMarkUp = `
    <div class="d-grid weapon-primary-data">
          <div class="weapon-primary-data__icon">
            <li class="${this.#weaponElementIconClass} ${this.#weaponSizeClass}--${weaponSize} ${this.#weaponTypeClass}--${weaponType}" data-id="${
			weaponObject.id
		}">${this.#weaponIconMarkup(weaponObject)}</li>
          </div>
          <div class="weapon-primary-data_content">
            <li class="weapon-role">
              <p>Primary Role:</p>
              <p>${weaponObject.primaryRoleStr}</p>
            </li>
            <li class="weapon-mount-type">
              <p>Mount Type:</p>
              <div>
                <p>${weaponObject.additionalWeaponData.size}</p>
                <p>${weaponObject.additionalWeaponData.type}</p>
              </div>
            </li>
            <li class="weapon-cost">
              <p>Ordinance Point Cost (OP):</p>
              <p>${weaponObject.OPs}</p>
            </li>
            <li class="weapon-range">
              <p>Range:</p>
              <p>${weaponObject.range}</p>
            </li>
            <li class="weapon-damage">
              <p>Damage:</p>
              <p>${damageString}</p>
            </li>
            <li class="weapon-damage-sec">
              <p>Damage / sec:</p>
              <p>${damagePerSecond}</p>
            </li>
            <li class="weapon-flux-sec">
              <p>Flux / sec:</p>
              <p>${fluxPerSecond}</p>
            </li>
            <li class="weapon-flux-shot">
              <p>Flux / shot:</p>
              <p>${fluxShot}</p>
            </li>
            <li class="weapon-flux-damage">
              <p>Flux / damage:</p>
              <p>${fluxPerDamage}</p>
            </li>
          </div>
          </div>
    `;
		const markup = `
			<ul>
				<li class="weapon-name">
					<p>Weapon Name</p>
					<p>${weaponObject.name}</p>
				</li>
				<li class="weapon-description">
					<p>${shortWeaponDescription}.</p>
				</li>
				<li class="weapon-divider">
					<p>Primary Data</p>
				</li>
        ${primaryDataMarkUp}
        
				<li class="weapon-divider">
					<p>Anciliary Data</p>
				</li>
				<li class="weapon-damage-type">
					<p>Damage Type:</p>
					<div>
						<p>${weaponObject.type}</p>
						<p>${damageTypeEffect()}</p>
					</div>
				</li>
				<li class="weapon-accuracy">
					<p>Accuracy:</p>
					<p>${accuracyRating()}</p>
				</li>
				<li class="weapon-turn-rate">
					<p>Turn rate:</p>
					<p>${turnRateRating()}</p>
				</li>
				${weaponBurstSize()}
				${ammoElement()}
				<li class="weapon-refire-delay">
					<p>Refire delay:</p>
					<p>${refireDelayString}</p>
				</li>
			</ul>
		`;
		return [markup, localParent];
	}
	weaponPopUpFormRemover() {
		const target = document.querySelector(`.${this.#weaponPopUpClass}`);
		target.textContent = "";
	}
	weaponPopUpCloseOnHover() {
		this.weaponPopUpFormRemover();
	}
	weaponPopUpTurnCurrentActiveWeaponInactive(btn) {
		btn.classList.remove(`${this.#weaponPopUpActiveClass}`);
	}
	addCurrentWeaponSpriteToShipRender(slotId, slotSize, slotType, weaponObject) {
		const localParent = `[data-id="${slotId}"]`;
		const markup = `${this.#weaponIconMarkup(weaponObject, [slotSize, slotType])}`;

		return [markup, localParent];
	}
	removeCurrentWeaponSpriteToShipRender(id) {
		// console.log(id);
		const parentTarget = `[data-id="${id}"]`;
		const elementTarget = `${this.#weaponSprite}`;

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
		const eventTarget = `.${this.#weaponSlotClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpFilterHandler(callback) {
		const localParent = `.${this.#weaponPopUpFilterClass}`;
		const eventTarget = `.${this.#weaponPopUpFilterButtonClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpHideButtonHandler(callback) {
		const localParent = `.${this.#weaponPopUpFilterClass}`;
		const eventTarget = `.${this.#weaponPopUpFilterHideButtonClass}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}

	weaponPopUpHideWhenClickOutsideHandler() {
		const localParent = document.querySelector(".build-maker__work-area");
		const eventTarget = localParent.querySelector(`.${this.#weaponPopUpTableBodyClass}`);
		const elementTarget = localParent.querySelector(`.${this.#weaponPopUpClass}`);
		const actionType = "click";

		document.addEventListener(
			actionType,
			function (e) {
				if (!eventTarget.contains(e.elementTarget)) {
					elementTarget.textContent = "";
				}
			},
			{ once: true }
		);
	}
}

export default new BuilderCenterView();
