import View from "./view.js";

class BuilderRightView extends View {
  #data;
  #parentElement = document.querySelector(".box__full-right");
  shieldDataRender = (ship) => {
    const shieldFluxSec = ship.flux_dissipation * ship.shield_upkeep;

    return ` 
        <ul class="flex-flexEnd-gap box__middle-right__cloak-flux">
            <li class="shield_arc">
                <h5>Shield Arc</h5>
                <p>${ship.shield_arc}</p>
            </li>
            <li class="shield_flux-per-sec">
                <h5>Shield Flux / Sec</h5>
                <p>${shieldFluxSec}</p>
            </li>
            <li class="shield_flux-per-dmg">
                <h5>Shield Flux / Dmg</h5>
                <p>${ship.shield_efficiency}</p>
            </li>
        </ul>`;
  };
  phaseDataRender = (ship) => {
    return `
        <ul class="flex-flexEnd-gap box__middle-right__cloak-flux">
            <li class="cloak-flux__per-sec">
            <h5>Cloak Flux / Sec</h5>
            <p>320</p>
            </li>
            <li class="cloak-flux__activation">
                <h5>Cloak Activation</h5>
                <p>0</p>
            </li>
        </ul>`;
  };
  hullmodsRender = (ship) => {
    const hullMods = ship.hullMods;
    // const renderHullMods = `
    //             <li class="flex-flexEnd-gap hull-mods__first">
    //               <h5>Expanded Magazines</h5>
    //               <p>30</p>
    //               <button>-</button>
    //               <img src="./starsectorData/graphics/hullmods/expanded_magazines2.png"
    //               alt="hull mod pic" />
    //             </li>`;
    return hullMods.buildInHullMods.map(
      (currentMod) => `
                <li class="flex-flexEnd-gap hull-mods__first">
                  <h5>${currentMod.name}</h5>
                  <img src="./starsectorData/${currentMod.sprite_}"
                  alt="${currentMod.short}" />
                </li>`
    );
  };
  updateText = (target, value) => {
    document.querySelector(`${target}`).textContent = `${value}`;
  };

  capacitorAndCapacityRender = (currentBuild) =>
    `
              <li class="flex-flexEnd-gap ship-capacitors__edit">
                <h5 class="ship-capacitors__edit__title">Capacitors</h5>
                <button class="button-circle ship-capacitors__edit--minus" value="shipCapacitorsMinus">-</button>
                <h5 class="ship-capacitors__edit__value">${currentBuild.activeCapacitors}</h5>
                <button class="button-circle ship-capacitors__edit--plus" value="shipCapacitorsPlus">+</button>
              </li>
              <li class="ship-capacitors__flux-capacity">
                <h5 class="flux-capacity__title">Flux Capacity</h5>
                <p class="flux-capacity__value">${currentBuild.currentFluxCapacity}</p>
              </li>
            `;

  ventsAndDissapationRender = (currentBuild) =>
    `    
                <li class="flex-flexEnd-gap ship-vents__edit">
                  <h5>Vents</h5>
                  <button class="button-circle ship-vents__edit--minus" value="shipVentsMinus">-</button>
                  <h5 class="ship-vents__edit__value">${currentBuild.activeVents}</h5>
                  <button class="button-circle ship-vents__edit--plus" value="shipVentsPlus">+</button>
                </li>
                <li class="ship-vents__flux-dissapation">
                  <h5>Flux Dissapation</h5>
                  <p class="ship-vents__flux-dissapation__value">${currentBuild.currentFluxDissapation}</p>
                </li>
          `;
  render(data) {
    this.#data = data;
    if (!this.#parentElement) this.#assignParentElement();

    const { currentShip, currentShipBuild } = this.#data;

    const isPhased = currentShip.shield_type === "PHASE" ? true : false;
    const weaponFluxSec = 999999; //! rework or complete remove

    const markup = `
                    <ul class="ordinance-graph">
                      <li>
                        <h5 class="ordinance-graph__title">
                          [Current / Total] Ordinance Points
                        </h5>
                      </li>
                      <li class="ordinance-graph__body">
                        <div class="ordinance-graph__points">
                          <h5 class="ordinance-graph__points__current-points">${
                            currentShipBuild.currentOrdinancePoints
                          }</h5>
                          <span></span>
                          <h5>${currentShipBuild.maxOrdinancePoints}</h5>
                        </div>
                      </li>
                    </ul>
                    <div class="box__full-right__top-content-group">
                      <ul class="flex-flexEnd-gap box__top-right__speed-armor-hull">
                        <li class="speed-armor-hull__speed">
                          <h5>Top Speed</h5>
                          <p>${currentShip.max_speed}</p>
                        </li>
                        <li class="speed-armor-hull__armor">
                          <h5>Armor</h5>
                          <p>${currentShip.armor_rating}</p>
                        </li>
                        <li class="speed-armor-hull__hull">
                          <h5>Hull</h5>
                          <p>${currentShip.hitpoints}</p>
                        </li>
                      </ul>
                      <ul class="flex-flexEnd-gap box__middle-right__ship-capacitors">
                        ${this.capacitorAndCapacityRender(currentShipBuild)}
                      </ul>
                      <ul class="flex-flexEnd-gap box__middle-right__ship-vents">
                        ${this.ventsAndDissapationRender(currentShipBuild)}
                      </ul>
                      ${
                        !isPhased
                          ? this.shieldDataRender(currentShip)
                          : this.phaseDataRender(currentShip)
                      }
                      <ul class="flex-flexEnd-gap">
                        <li>
                          <h5>Weapon Flux / sec</h5>
                          <p>${weaponFluxSec}</p>
                        </li>
                      </ul>
                    </div>
                    <div class="hull-mods">
                      <h3 class="hull-mods__header">Hull features & mods</h3>
                      <ul class="hull-mods__container">
                        ${this.hullmodsRender(currentShipBuild)}
                      </ul>
                      <ul class="flex-flexEnd-gap hull-mods__buttons">
                        <li>
                          <button>Add Hull Mod</button>
                        </li>
                        <li>
                          <button>S-Mods</button>
                        </li>
                      </ul>
                    </div>
          `;
    this.clearRender(this.#parentElement);
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  #assignParentElement() {
    this.#parentElement = document.querySelector(".box__full-right");
  }
  #clearInput() {
    this.#parentElement.querySelector(".search-form__input").value = "";
  }
  addVentsHandler(inputFunction) {
    this.#parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".ship-capacitors__edit");
      if (!btn) return;
      inputFunction();
    });
  }
}
export default new BuilderRightView();

//   const phaseData =
// <dt>Peak CR Sec:</dt>
// <dd>${ship.peak_CR_sec}</dd>
// <dt>CR loss/sec:</dt>
// <dd>${ship.CR_loss_sec}</dd>

// addHandlerUpdateServings(handler) {
//   this._parentElement.addEventListener('click', function (e) {
//     const btn = e.target.closest('.btn--update-servings');
//     if (!btn) return;
//     const { updateTo } = btn.dataset;
//     if (+updateTo > 0) handler(+updateTo);
//   });
// }
