import View from "./view.js";
import CLASS_NAMES from "../helper/ui/class_names.js";

class BuilderView extends View {
	_localParent = `body`;

	generateMarkup() {
		const markup = `${this.#builderMarkup()}`;
		return markup;
	}
	#builderMarkup() {
		return `
         <div class="${CLASS_NAMES.buildMakerContainer}">
            <nav class="${CLASS_NAMES.nav}"></nav>
            <main class="${CLASS_NAMES.buildMaker}">
                <section class="${CLASS_NAMES.hullModsPopUp}"></section>
                <section class="${CLASS_NAMES.gridContainer} ${CLASS_NAMES.shipInfoContainer}"></section>
                <section class="${CLASS_NAMES.gridContainer} ${CLASS_NAMES.fighterContainer}"></section>
                <section class="${CLASS_NAMES.gridContainer} ${CLASS_NAMES.builderButtonsContainer}"></section>
                <section class="${CLASS_NAMES.gridContainer} ${CLASS_NAMES.additionalInfoContainer}"></section>
                <section class="${CLASS_NAMES.gridContainer} ${CLASS_NAMES.shipAreaContainer}"></section>
                <section class="${CLASS_NAMES.gridContainer} ${CLASS_NAMES.statsContainer}"></section>
            </main>
        </div>
        `;
	}
}
export default new BuilderView();
