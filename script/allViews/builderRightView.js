import View from "./view.js";
import { calculateHullModCost } from "../helper/helperFunction.js";
import classNames from "../helper/DomClassNames.js";

class BuilderRightView extends View {
	#data;
	// parents probably don`t work due to async
	#parentElement = document.querySelector(".box__full-right");
	// ordinancePointsRenderTextClass = "ordinance-graph__points__current-points";

	constructor() {
		super();
		// this.speedArmorHullParent = "box__top-right__speed-armor-hull";
		// this.shipCapacitorParent = "box__middle-right__ship-capacitors";
		this.shipVentAndDissipationParent = "box__middle-right__ship-vents";
		// this.ordinancePointsParent = "ordinance-graph";
		this.phaseDataParent = "box__middle-right__cloak-flux";
		this.shieldDataParent = "box__middle-right__shield";
		this.weaponFluxParent = "box__middle-right__weaponFlux";
	}

	// ordinancePointsRender() {
	// 	const { currentShipBuild } = this.#data;
	// 	const markup = `
	//          <li>
	//            <h5 class="ordinance-graph__title">
	//              [Current / Total] Ordinance Points
	//            </h5>
	//          </li>
	//          <li class="ordinance-graph__body">
	//            <div class="ordinance-graph__points">
	//              <h5 class="${this.ordinancePointsRenderTextClass}">${currentShipBuild.currentOrdinancePoints}</h5>
	//              <span> / </span>
	//              <h5 class="ordinance-graph__points__max-points">${currentShipBuild.maxOrdinancePoints}</h5>
	//            </div>
	//          </li>
	//         `;
	// 	return [markup, `.${this.ordinancePointsParent}`];
	// }
	// speedArmorHullRender() {
	// 	const { currentShipBuild } = this.#data;
	// 	const markup = `
	//         <li class="speed-armor-hull__speed">
	//           <h5>Top Speed</h5>
	//           <p>${currentShipBuild.currentSpeed}</p>
	//         </li>
	//         <li class="speed-armor-hull__armor">
	//           <h5 class="speed-armor-hull__armor-title">Armor</h5>
	//           <p class="speed-armor-hull__armor-value">${currentShipBuild.currentArmor}</p>
	//         </li>
	//         <li class="speed-armor-hull__hull">
	//           <h5>Hull</h5>
	//           <p>${currentShipBuild.currentHitPoints}</p>
	//         </li>
	//       `;
	// 	return [markup, `.${this.speedArmorHullParent}`];
	// }
	// shipCapacitorsRender() {
	// 	const { currentShipBuild } = this.#data;
	// 	const markup = `
	//       <li class="flex-flexEnd-gap ship-capacitors__edit">
	//         <h5 class="ship-capacitors__edit__title">Capacitors</h5>
	//         <button class="button button-circle unselectable ship-capacitors__edit--minus" data-button-value="-1">-</button>
	//         <h5 class="ship-capacitors__edit__value">${currentShipBuild.activeCapacitors}</h5>
	//         <button class="button button-circle unselectable ship-capacitors__edit--plus" data-button-value="+1">+</button>
	//       </li>
	//       <li class="ship-capacitors__flux-capacity">
	//         <h5 class="flux-capacity__title">Flux Capacity</h5>
	//         <p class="flux-capacity__value">${currentShipBuild.currentFluxCapacity}</p>
	//       </li>
	//       `;

	// 	return [markup, `.${this.shipCapacitorParent}`];
	// }
	ventsAndDissipationRender() {
		const { currentShipBuild } = this.#data;
		const markup = `
              <li class="flex-flexEnd-gap ship-vents__edit">
                   <h5>Vents</h5>
                   <button class="button button-circle unselectable ship-vents__edit--minus" data-button-value="-1">-</button>
                   <h5 class="ship-vents__edit__value">${currentShipBuild.activeVents}</h5>
                   <button class="button button-circle unselectable ship-vents__edit--plus" data-button-value="+1">+</button>
              </li>
              <li class="ship-vents__flux-dissipation">
                   <h5>Flux Dissipation</h5>
                   <p class="ship-vents__flux-dissipation__value">${currentShipBuild.currentFluxDissipation}</p>
              </li>
          `;

		return [markup, `.${this.shipVentAndDissipationParent}`];
	}
	phaseDataRender() {
		const { currentShipBuild } = this.#data;
		const markup = `
              <li class="cloak-flux__per-sec">
                <h5>Cloak Flux / Sec</h5>
                <p>320</p>
              </li>
              <li class="cloak-flux__activation">
                  <h5>Cloak Activation</h5>
                  <p>0</p>
              </li>
          `;

		return [markup, `.${this.phaseDataParent}`];
	}
	shieldDataRender() {
		const { currentShipBuild } = this.#data;
		const shieldFluxSec =
			currentShipBuild._baseFluxDissipation *
			currentShipBuild.currentShieldUpkeep;
		// currentShipBuild.currentShipType === "shieldShip"
		//   ? currentShipBuild._baseFluxDissipation *
		//     currentShipBuild.currentShieldUpkeep
		//   : "---";
		//

		const markup = `
            <li class="shield_arc">
                <h5>Shield Arc</h5>
                <p>${currentShipBuild.currentShieldArc}</p>
            </li>
            <li class="shield_flux-per-sec">
                <h5>Shield Flux / Sec</h5>
                <p>${shieldFluxSec}</p>
            </li>
            <li class="shield_flux-per-dmg">
                <h5>Shield Flux / Dmg</h5>
                <p>${currentShipBuild.currentShieldEfficiency}</p>
            </li>
          `;

		return [markup, `.${this.shieldDataParent}`];
	}
	weaponFluxRender() {
		const { currentShipBuild } = this.#data;
		const weaponFluxSec = 999999; //! rework or complete remove

		const markup = `
            <li>
              <h5>Weapon Flux / sec</h5>
              <p>${weaponFluxSec}</p>
            </li>
          `;

		return [markup, `.${this.weaponFluxParent}`];
	}
	// Hull Mods
	hullModMarkUp() {
		const localParent = ".hullmods";
		const hideBuildInHullModIfUndefined = !this.#data.currentShipBuild.hullMods
			.buildInHullMods
			? "d-none"
			: "";
		const markup = `
                    <h3 class="hullmods__header">Hull features & mods</h3>
                    <ul class="hullmods__container">
                      <div class="hullmods__container__build-in-hullmods ${hideBuildInHullModIfUndefined}"></div>
                      <div class="hullmods__container__added-hullmods"></div>
                    </ul>
                    <ul class="flex-flexEnd-gap hullmods__buttons">
                      <li>
                        <button class="button hullmods__buttons__open-hullmod-menu" data-type="regular">Open HullMod Menu</button>
                      </li>
                      <li>
                        <button class="button hullmods__buttons-smods" data-type="smods">S-Mods</button>
                      </li>
                    </ul>
      `;
		return [markup, localParent];
	}
	buildInHullModRender() {
		const localParent = ".hullmods__container__build-in-hullmods";
		const hullMods = this.#data.currentShipBuild.hullMods;

		if (!hullMods.buildInHullMods)
			return [
				` <li class="flex-flexEnd-gap build-in-hullmods__hullmod"></li>`,
				localParent,
			];
		// if (!hullMods.buildInHullMods) return ["", localParent];
		const markup = hullMods.buildInHullMods
			.map(
				(currentMod) => `
                  <li class="flex-flexEnd-gap build-in-hullmods__hullmod">
                    <h5>${currentMod.name}</h5>
                    <img src="./starsectorData/${currentMod.sprite_}"
                    alt="${currentMod.short}" />
                  </li>`
			)
			.join("");
		return [markup, localParent];
	}
	addNewHullModRender() {
		const localParent = ".hullmods__container__added-hullmods";
		const { hullMods } = this.#data.currentShipBuild;
		const markup = hullMods.activeHullMods.map(
			(hullmod) => `
                  <li class="flex-flexEnd-gap added-hullmods__hullmod">
                    <h5>${hullmod.name}</h5>
                    <p>(${calculateHullModCost(hullmod)})</p>
                    <button class="button button-circle added-hullmod__remove-button" data-id="${
											hullmod.id
										}">-</button>
                    <img src="./starsectorData/${hullmod.sprite_}"
                    alt="${hullmod.short}" />
                  </li>`
		);
		return [markup, localParent];
	}
	// Render
	render(data) {
		this.#data = data;
		if (!this.#parentElement) this.#assignParentElement();

		const markup = `
                    <ul class="${classNames.ordinancePointsGraph}"></ul>
                    <div class="box__full-right__top-content-group">
                      <ul class="flex-flexEnd-gap ${classNames.speedArmorHullContainer}"></ul>
                      <ul class="flex-flexEnd-gap ${classNames.shipCapacitorsContainer}"></ul>
                      <ul class="flex-flexEnd-gap ${this.shipVentAndDissipationParent}"></ul>
                      <ul class="flex-flexEnd-gap ${this.phaseDataParent}"></ul>
                      <ul class="flex-flexEnd-gap ${this.shieldDataParent}"></ul>
                      <ul class="flex-flexEnd-gap ${this.weaponFluxParent}"></ul>
                    </div>
                    <div class="hullmods"></div>
          `;
		this.clearRender(this.#parentElement);
		this.#parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	//
	#assignParentElement() {
		this.#parentElement = document.querySelector(".box__full-right");
	}
}
export default new BuilderRightView();

/////////////////////
//   const phaseData =
// <dt>Peak CR Sec:</dt>
// <dd>${ship.peak_CR_sec}</dd>
// <dt>CR loss/sec:</dt>
// <dd>${ship.CR_loss_sec}</dd>
// renderHullModsSection(state) {
//   const markup = `
//                 <h3 class="hullmods__header">Hull features & mods</h3>
//                 <ul class="hullmods__container">
//                   ${this.hullmodsRender(this.#data.currentShipBuild)}
//                 </ul>
//                 <ul class="flex-flexEnd-gap hullmods__buttons">
//                   <li>
//                     <button class="hullmods__buttons-add" data-type="regular">Add Hull Mod</button>
//                   </li>
//                   <li>
//                     <button class="hullmods__buttons-smods" data-type="smods">S-Mods</button>
//                   </li>
//                 </ul>
//   `;
//   this.clearRender(this.#hullModsLocalParent);
//   this.#hullModsLocalParent.insertAdjacentHTML("afterbegin", markup);
// }
// hullmodsRender = (ship) => {
//   const hullMods = ship.hullMods;
//   const parentElement = document.querySelector(".hullmods__container");
//   console.log(parentElement);
//   // console.log(hullMods);
//   console.log("test");
//   const addHullModsMarkUp = hullMods.buildInHullMods.map(
//     (currentMod) => `
//               <li class="flex-flexEnd-gap hullmods__first">
//                 <h5>${currentMod.name}</h5>
//                 <img src="./starsectorData/${currentMod.sprite_}"
//                 alt="${currentMod.short}" />
//               </li>`
//   );

//   const buildInHullModsMarkUp = hullMods.buildInHullMods.map(
//     (currentMod) => `
//               <li class="flex-flexEnd-gap hullmods__first">
//                 <h5>${currentMod.name}</h5>
//                 <img src="./starsectorData/${currentMod.sprite_}"
//                 alt="${currentMod.short}" />
//               </li>`
//   );
//   const markup = `${buildInHullModsMarkUp}`;
//   return markup;
// };
// ${this.hullmodsRender(this.#data.currentShipBuild)}
// addHullModsHandler(inputFunction) {
//   this.#hullModsLocalParent.addEventListener("click", function (e) {
//     const btn = e.target.closest(".hullmods__buttons button");
//     if (!btn) return;
//     const { type } = btn.dataset;
//     inputFunction(type);
//   });
// }
// addVentsHandler(inputFunction) {
//   this.#ventsLocalParent.addEventListener("click", function (e) {
//     const btn = e.target.closest(".button-circle");
//     if (!btn) return;
//     const { buttonValue } = btn.dataset;
//     inputFunction(buttonValue);
//   });
// }
// addCapacitorsHandler(inputFunction) {
//   this.#capacitorLocalParent.addEventListener("click", function (e) {
//     const btn = e.target.closest(".button-circle");
//     if (!btn) return;
//     const { buttonValue } = btn.dataset;
//     inputFunction(buttonValue);
//   });
// }
// #capacitorLocalParent = document.querySelector(".ship-capacitors__edit");
// #ventsLocalParent = document.querySelector(".ship-vents__edit");
// #hullModsLocalParent = document.querySelector(".hullmods");
// #localSectionParents() {
// this.#capacitorLocalParent = document.querySelector(
//   ".ship-capacitors__edit"
// );
// this.#ventsLocalParent = document.querySelector(".ship-vents__edit");
// this.#hullModsLocalParent = document.querySelector(".hullmods");
//
// }
// #clearInput() {
//   this.#parentElement.querySelector(".search-form__input").value = "";
// }
// capacitorAndCapacityRender = (currentBuild) =>
//   `

//   `;

//                 ${this.speedArmorHull(currentShipBuild)}
// ${this.speedArmorHullParent}
//${this.renderGenericComponent(this.speedArmorHull())}
// ${this.capacitorAndCapacityRender(currentShipBuild)}

// ventsAndDissapationRender = (currentBuild) =>
//   `
//
//         `;
