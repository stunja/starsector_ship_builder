import View from "./view.js";

class BuilderCenterView extends View {
  #data;
  #parentElementTop = document.querySelector(".box__top-center");
  #parentElementMiddle = document.querySelector(".box__middle-center");

  #renderTopBox() {
    if (!this.#parentElementTop)
      this.#parentElementTop = document.querySelector(".box__top-center");

    const markup = `<h5>Additional Information DropDown</h5>`;
    this.clearRender(this.#parentElementTop);
    this.#parentElementTop.insertAdjacentHTML("afterbegin", markup);
  }
  #renderCenterBox() {
    if (!this.#parentElementMiddle)
      this.#parentElementMiddle = document.querySelector(".box__middle-center");

    const markup = `
            <h5>Main Working Area</h5>
            <img src="./starsectorData/${
              this.#data.currentShip.spriteName
            }" alt="ship" class="build-maker__ship-image" />
    `;
    this.clearRender(this.#parentElementMiddle);
    this.#parentElementMiddle.insertAdjacentHTML("afterbegin", markup);
  }

  renderRow(data) {
    this.#data = data;

    this.#renderTopBox();
    this.#renderCenterBox();
  }
}
export default new BuilderCenterView();
