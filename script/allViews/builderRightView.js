import View from "./view.js";
import classNames from "../helper/DomClassNames.js";

class BuilderRightView extends View {
	#data;
	// parents probably don`t work due to async
	#parentElement = document.querySelector(".box__full-right");

	constructor() {
		super();
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
                    <div class="${classNames.hullMods}"></div>
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
