import View from "./view.js";

class BuilderView extends View {
  #parentElement = document.querySelector("body");
  constructor(model) {
    super();
    this.model = model;
  }
  render() {
    const markup = `
        <div class="build-maker">
            <nav class="build-maker__nav"></nav>
            <main class="build-maker__work-area">
                <section class="box box__top box__top-left"></section>
                <section class="box box__top box__top-center"></section>
                <section class="box box__middle box__middle-left"></section>
                <section class="box box__middle box__middle-center"></section>
                <section class="box box__bottom box__bottom-left"></section>
                <section class="box box__full-right"></section>
            </main>
        </div>
    `;
    this.clearRender(this.#parentElement);
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
export default new BuilderView();
