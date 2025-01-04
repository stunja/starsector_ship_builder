import View from "./view";
import classNames from "../helper/DomClassNames";
import DataSet from "../helper/DataSet";
//
const BUTTON_NAMES = {
	STRIP: "Strip Everything",
	SAVE: "Save the ship",
};
const BUTTON_DATASET = {
	STRIP: "strip",
	SAVE: "save",
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
                    	<button class="${classNames.button} ${classNames.builderButton}" 
							${DataSet.dataBuilderButtonType}="${BUTTON_DATASET.STRIP}">
							${BUTTON_NAMES.STRIP}
						</button>
					<li>
					<li>
                    	<button class="${classNames.button} ${classNames.builderButton}" 
							${DataSet.dataBuilderButtonType}="${BUTTON_DATASET.SAVE}">
							${BUTTON_NAMES.SAVE}
						</button>
					<li>
                </ul>
                    `;
	}
}
export default new BuilderButtonsView();
