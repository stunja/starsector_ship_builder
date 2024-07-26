import View from "./view.js";

class BuilderLeftView extends View {
  #data;
  #parentElementTop = document.querySelector(".box__top-left");
  #parentElementMiddle = document.querySelector(".box__middle-left");
  #parentElementBottom = document.querySelector(".box__bottom-left");

  renderRow(data) {
    this.#data = data;

    this.#renderTopBox();
    this.#renderCenterBox();
    this.#renderBottomBox();
  }
  #renderTopBox() {
    if (!this.#parentElementTop)
      this.#parentElementTop = document.querySelector(".box__top-left");

    const markup = `${this.#crewReadinessGraph()}`;
    this.clearRender(this.#parentElementTop);
    this.#parentElementTop.insertAdjacentHTML("afterbegin", markup);
  }
  #renderCenterBox() {
    if (!this.#parentElementMiddle)
      this.#parentElementMiddle = document.querySelector(".box__middle-left");

    const markup = `${this.#pilotIconRender()}${this.#fighterBayRender()}`;
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
  #pilotIconRender = () => {
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
  };
  #fighterBayRender = () => {
    const { currentShip } = this.#data;
    const fighterBayCount = Number(currentShip.fighter_bays);

    if (fighterBayCount === 0) return "";
    const currentFighterCost = "";

    const createFighterBay = () =>
      `
        <div class="fighter-bay__container">
          <figure class="small-image-box fighter-bay">
            <a href="#" class="fighter-bay__empty">
              <h5 class="fighter-bay__ordinance-points">${currentFighterCost}</h5>
            </a>
          </figure>
        </div>
      `;

    const fighterBays = Array(fighterBayCount)
      .fill()
      .map(createFighterBay)
      .join("");

    return `
            <ul class="box__middle-left__fighter-bays">
              <li class="fighter-bays__header"><h5>Fighter Bays</h5></li>
              <li class="fighter-bays--wrapper">
                ${fighterBays}
              </li>
            </ul>

    `;
  };

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
}
export default new BuilderLeftView();
