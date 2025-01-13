import View from "./view.js";
import classNames from "../helper/DomClassNames.js";

class BuilderView extends View {
	_localParent = `body`;

	generateMarkup() {
		const markup = `${this.#builderMarkup()}`;
		return markup;
	}
	#builderMarkup() {
		return `
         <div class="${classNames.buildMakerContainer}">
            <nav class="${classNames.nav}"></nav>
            <main class="${classNames.buildMaker}">
                <section class="${classNames.hullModsPopUp}"></section>
                <section class="${classNames.gridContainer} ${classNames.shipInfoContainer}"></section>
                <section class="${classNames.gridContainer} ${classNames.fighterContainer}"></section>
                <section class="${classNames.gridContainer} ${classNames.builderButtonsContainer}"></section>
                <section class="${classNames.gridContainer} ${classNames.additionalInfoContainer}"></section>
                <section class="${classNames.gridContainer} ${classNames.shipAreaContainer}"></section>
                <section class="${classNames.gridContainer} ${classNames.statsContainer}"></section>
            </main>
        </div>
        `;
	}
}
export default new BuilderView();
