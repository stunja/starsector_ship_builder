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

  //
  #weaponTypeClass = "weapon__type";
  #weaponSizeClass = "weapon__size";
  #weaponOpacityClass = "weapon__opacity";

  #weaponBackgroundSpriteParentClass = "weapon-background-sprite-parent";
  #weaponBackgroundSpriteClass = "weapon-background-sprite";
  #weaponBackgroundSpriteTypeClass = "weapon-background-sprite__type";
  #weaponBackgroundSpriteSizeClass = "weapon-background-sprite__size";
  #weaponBackgroundSpriteOppacityClass = "weapon-background-sprite__opacity";

  // Filter
  #weaponPopUpFilterClass = "weapon__filter";
  #weaponPopUpFilterButtonClass = "filter__button";

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
  #weaponElementIconClass = "weapon__icon";
  #weaponElementRangeClass = "weapon__range";
  #weaponElementCostClass = "weapon__const";

  // general
  #dNoneClass = "d-none";

  //
  #targetRem = 10; // rem for shipSpriteSize / WeaponSlotsPosition / shipGAP

  // Regular
  weaponSlotChangePosition() {
    const { viewOffset, center, width, height } = this.#data.currentShip;
    const allWeaponSlotsElements = document.querySelectorAll(`.${this.#weaponSlotClass}`);
    const weaponSlots = this.#data.currentShipBuild._baseWeaponSlots;
    const centerX = center[0] - width;
    const centerY = center[1] - height;

    //
    allWeaponSlotsElements.forEach(el => {
      const { id } = el.dataset;
      const [currentWeaponSlotData] = weaponSlots.filter(slot => slot.id === id);
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
    const target = `.${this.#weaponPopUpClass}`;
    const targetElement = document.querySelector(target);
    const hoverContainerElement = targetElement.querySelector(`.hover-additional-information`);
    const tableContainerElement = targetElement.querySelector(`.weapon-pop-up__table`);
    //
    const offsetToRightBy = 13 * this.#targetRem;
    const offsetToLeftBy = 22;
    // const offsetPadding = 16;
    //
    const shipSprite = document.querySelector(".ship-sprite");
    const shipSpriteWidth = Number.parseInt(shipSprite.width);
    //
    // const containerFlexboxGapValue = (shipSpriteWidth + offsetPadding * 6) / this.#targetRem;
    const shipCenterPx = shipSpriteWidth / 2;
    const offsetToRightTable = Math.floor((shipCenterPx + offsetToRightBy) / this.#targetRem);
    const offsetToLeftHoverContainer = Math.floor((shipCenterPx - offsetToLeftBy) / this.#targetRem);

    tableContainerElement.style.left = `${offsetToRightTable}rem`;
    hoverContainerElement.style.right = `${12}rem`;

    // targetElement.style.gap = `${Math.floor(containerFlexboxGapValue)}rem`;
  }
  weaponSlotActiveClass(btn) {
    const allWeaponSlots = document.querySelectorAll(`.${this.#weaponSlotClass}`);
    allWeaponSlots.forEach(weaponSlot => {
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
    // console.log(currentShip);
    // const spriteCenterPos = currentShip.center;
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
					<button class="${this.#weaponSlotClass} ${this.#weaponSizeClass}--${weaponSize} ${this.#weaponTypeClass}--${weaponType}" 
					data-id="${currentWeaponSlot.id}">
						${this.#weaponTypeBackgroundMarkup(currentWeaponSlot)}
					</button>`;
    return markup;
  }
  #weaponAngleSprite() {
    //! I need to implement later
    // console.log(angle: 24 arc: 100);
  }
  #weaponTypeBackgroundMarkup = currentWeaponSlot => {
    const weaponType = currentWeaponSlot.type.toLowerCase();
    const weaponSize = currentWeaponSlot.size.toLowerCase();
    return this.#weaponBackgroundSprite(weaponType, weaponSize);
  };
  #weaponBackgroundSprite(weaponType, weaponSize) {
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
          ? weaponMarkup("small", weaponType, "light") +
            weaponMarkup("medium", weaponType, "medium") +
            weaponMarkup("large", weaponType, "full")
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
    //
    return `<div class="${this.#weaponBackgroundSpriteParentClass}">
					${weaponTypeSelector()}
				</div>`;
  }
  #weaponIconMarkup(weaponObject) {
    //
    const turretSprite = weaponObject.additionalWeaponData.turretSprite;
    const turretGunSprite = weaponObject.additionalWeaponData.turretGunSprite;
    const markupForGunSprite = turretGunSprite
      ? `<img src="./starsectorData/${turretGunSprite}" alt="gun sprite" class="weapon-sprite--gun" />`
      : "";

    const weaponType = weaponObject.additionalWeaponData.type.toLowerCase();
    const weaponSize = weaponObject.additionalWeaponData.size.toLowerCase();
    const markup = `
				<div class="${this.#weaponElementClass}__icon--wrapper-parent">
					${this.#weaponBackgroundSprite(weaponType, weaponSize)}
					<div class="${this.#weaponElementClass}__icon--wrapper">
						<img src="./starsectorData/${turretSprite}" alt="weapon base sprite" class="weapon-sprite--base"/>
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
  weaponSlotRender() {
    const localParent = `.${this.#weaponSlotsClass}`;
    const weaponSlots = this.#data.currentShipBuild._baseWeaponSlots;
    const markup = weaponSlots.map(slot => this.#weaponSlotMarkUp(slot)).join("");
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
  weaponPopUpFilterRender(currentWeaponTypes) {
    const localParent = `.${this.#weaponPopUpFilterClass}`;
    // console.log(currentWeaponTypes);
    const weaponTypeStringConversion = damageType =>
      damageType
        .split("_")
        .map(word => {
          return word[0] + word.slice(1).toLowerCase();
        })
        .join(" ");

    const weaponTypeButton = weaponType => {
      if (weaponType)
        return `
            <li>
              <button class="${this.#weaponPopUpFilterButtonClass}" data-id="${weaponType}">${weaponTypeStringConversion(
          weaponType
        )}</button>
            </li>`;
    };
    const addWeaponTypesMarkUp = currentWeaponTypes.map(wpnType => weaponTypeButton(wpnType)).join("");
    const markup = `
                <li><button class="${
                  this.#weaponPopUpFilterButtonClass
                } active" data-id="ALL">All Types</button></li>${addWeaponTypesMarkUp}`;

    return [markup, localParent];
  }
  weaponPopUpTableHeader() {
    const localParent = `.${this.#weaponPopUpTableClass} thead`;

    const markup = `
					<tr class="${this.#weaponPopUpTableHeaderClass}">
						<th></th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} unselectable" data-category="name">
							<div>
								<p>Name</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} unselectable" data-category="type">
							<div>
								<p>Type</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} unselectable" data-category="range">
							<div>
								<p>Range</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
						<th class="${this.#weaponPopUpTableHeaderClass} ${this.#tableHeaderElementClass} unselectable" data-category="cost">
							<div>
								<p>Cost</p><ion-icon name="chevron-down-outline" class="icon-generic"></ion-icon>
							</div>
						</th>
					</tr>
				`;

    return [markup, localParent];
  }
  weaponPopUpTableContentRender(weaponArray) {
    const localParent = `.${this.#weaponPopUpTableClass} tbody`;
    const weaponTypeStringConversion = damageType => {
      const convertedString = damageType
        .split("_")
        .map(word => {
          return word[0] + word.slice(1).toLowerCase();
        })
        .join(" ")
        .toUpperCase();

      if (convertedString === "HIGH EXPLOSIVE") return "EXPLOSIVE";
      if (convertedString === "FRAGMENTATION") return "FRAGMEN";

      return convertedString;
    };
    const weaponTypeMarkUp = weaponObj => {
      const markup = `
				<div class="${this.#weaponElementClass}__type ${this.#weaponElementClass}__type--${weaponObj.type.toLowerCase()}">
					<p>
						${weaponTypeStringConversion(weaponObj.type)}
					</p>
				</div>`;
      return markup;
    };
    const markup = weaponArray
      .map(weaponObj => {
        if (Number.parseInt(weaponObj.OPs) === 0 || !weaponObj.OPs) return "";

        const weaponType = weaponObj.additionalWeaponData.type.toLowerCase();
        const weaponSize = weaponObj.additionalWeaponData.size.toLowerCase();

        const markup = `
						<tr class="${this.#weaponElementClass} ${this.#weaponSizeClass}--${weaponSize} ${this.#weaponTypeClass}--${weaponType}" data-id="${
          weaponObj.id
        }">
							<td class="${this.#weaponElementIconClass}">${this.#weaponIconMarkup(weaponObj)}</td>
							<td>${weaponObj.name}</td>
							<td>${weaponTypeMarkUp(weaponObj)}</td>
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
    const roundFloat = num => {
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
    // <tr class="${this.#weaponElementClass} ${this.#weaponSizeClass}--${weaponSize} ${this.#weaponTypeClass}--${weaponType}" data-id="${
    //   weaponObj.id
    // }">
    const primaryDataMarkUp = `
    <div class="d-grid weapon-primary-data">
          <div class="weapon-primary-data__icon">
            <li class="${this.#weaponElementIconClass} ${this.#weaponSizeClass}--${weaponSize} ${
      this.#weaponTypeClass
    }--${weaponType}" data-id="${weaponObject.id}">${this.#weaponIconMarkup(weaponObject)}</li>
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
}

export default new BuilderCenterView();
// <img src="./starsectorData/${
//   this.#data.currentShip.spriteName
// }" alt="ship" class="build-maker__ship-image" />

// shipRender() {
//   const localParent = ".box__middle-center";
//   const markup = `
//     <img src="./starsectorData/${this.#data.currentShip.spriteName}"
//     alt="ship" class="build-maker__ship-image" />
//   `;
//   return [markup, localParent];
// }
// const posXOffset = posX + workAreaSize.offsetWidth / 2;
// const posYOffset = posY + workAreaSize.offsetHeight / 2;

// el.style.top = `${posY + workAreaSize.offsetHeight / 2}px`;
// el.style.left = `${posX + workAreaSize.offsetWidth / 2}px`;
// const workAreaSize = document.querySelector(".box__middle-center");
// console.log(workAreaSize.offsetWidth);
// const windowWidth = workAreaSize.clientWidth;
// const windowHeight = workAreaSize.clientHeight;
// weaponSlots.forEach(slot => {
//   if (slot.mount.toLowerCase() === "hidden") return;
//   // const slotElement = allWeaponSlotsElements.map(el=>el.id===dataset)
// });
// <div class="weapon-slots"></div>
// const localParent = ".weapon-slots";
// el.style.bottom = `${posY - viewOffset / 2}px`;
// el.style.right = `${posX}px`;
// console.log(posX, posY);
// console.log(`viewOffset : ${viewOffset}`); // zero on legion
// console.log(`Center: ${center[0]}, ${center[1]}`); // 150 legion // 149 Legion
//
// console.log(centerX);
// console.log(this.#data.currentShip);
// console.log(centerX);
//
// usableWeaponsMarkUpRender(weaponSlot, usableWeapons) {
// 	const weaponTypeStringConversion = (damageType) => {
// 		return damageType
// 			.split("_")
// 			.map((word) => {
// 				return word[0] + word.slice(1).toLowerCase();
// 			})
// 			.join(" ")
// 			.toUpperCase();
// 	};

// 	const markup = usableWeapons
// 		.map((currentWeapon) => {
// 			const turretSprite = currentWeapon.additionalWeaponData.turretSprite;

// 			const turretGunSprite = currentWeapon.additionalWeaponData.turretGunSprite;
// 			const markupForGunSprite = turretGunSprite ? `<img src="./starsectorData/${turretGunSprite}" alt="gun sprite" class="weapon-sprite--gun" />` : "";
// 			// console.log(weapon.tags);
// 			if (Number.parseInt(currentWeapon.OPs) === 0 || !currentWeapon.OPs) return;
// 			const markup = `
// 			<ul class="${this.#weaponElement} weapon-id--${currentWeapon.id}">
// 				<li class="${this.#weaponElement}__icon">
// 					<div class="${this.#weaponElement}__icon--wrapper">
// 						<img src="./starsectorData/${turretSprite}" alt="weapon base sprite" class="weapon-sprite--base"/>
// 						${markupForGunSprite}
// 					</div>
// 				</li>
// 				<div class="${this.#weaponElement}__content">
// 					<li	class="${this.#weaponElement}__name">${currentWeapon.name}</li>
// 						<li class="${this.#weaponElement}__role">${currentWeapon.primaryRoleStr}</li>
// 						<li class="${this.#weaponElement}__range">Range: ${currentWeapon.range}</li>
// 					<li class="${this.#weaponElement}__type">
// 						<p class="${this.#weaponElement}__type--${currentWeapon.type.toLowerCase()}">${weaponTypeStringConversion(currentWeapon.type)}</p>
// 					</li>
// 				</div>
// 				<li class="${this.#weaponElement}__cost">${currentWeapon.OPs}</li>
//       		</ul>`;
// 			return markup;
// 		})
// 		.join("");
// 	return markup;
// };
