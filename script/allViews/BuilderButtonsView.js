import classNames from "../helper/DomClassNames";
import View from "./view";
//
const BUTTON__NAMES = {
	STRIP: "Strip Everything",
	SAVE: "Save the ship",
};
class BuilderButtonsView extends View {
	_localParent = `.${classNames.builderButtonsContainer}`;

	generateMarkup() {
		const markup = `${this.#buttonsMarkup()}`;
		return markup;
	}
	#buttonsMarkup() {
		return `
                <ul>
					<li>
                    	<button class="${classNames.button}">${BUTTON__NAMES.STRIP}</button>
					<li>
					<li>
                    	<button class="${classNames.button}">${BUTTON__NAMES.SAVE}</button>
					<li>
                </ul>
                    `;
	}
}
export default new BuilderButtonsView();
