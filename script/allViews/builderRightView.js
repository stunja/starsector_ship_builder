import View from "./view.js";
import { calculateHullModCost } from "../helper/helperFunction.js";
import classNames from "../helper/DomClassNames.js";

class BuilderRightView extends View {
	#data;
	// parents probably don`t work due to async
	#parentElement = document.querySelector(".box__full-right");

	constructor() {
		super();
	}

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
                      <ul class="${classNames.flexFlexEndGap} ${classNames.speedArmorHullContainer}"></ul>
                      <ul class="${classNames.flexFlexEndGap} ${classNames.shipCapacitorsContainer}"></ul>
                      <ul class="${classNames.flexFlexEndGap} ${classNames.shipVents}"></ul>
					  <div class="${classNames.phaseOrShieldContainer}"></div>
                      <ul class="${classNames.flexFlexEndGap} ${classNames.weaponFlux}"></ul>
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
