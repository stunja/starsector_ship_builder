// View
import View from "./view";
// Helper
import CLASS_NAMES from "../helper/ui/class_names";
import DATASET from "../helper/ui/datasets";
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
	_localParent = `.${CLASS_NAMES.builderButtonsContainer}`;

	generateMarkup() {
		const markup = `${this.#buttonsMarkup()}`;
		return markup;
	}
	#buttonsMarkup() {
		return `
                <ul>
					<li>
                    	<button class="${CLASS_NAMES.button} ${CLASS_NAMES.builderButton}" 
							${DATASET.dataBuilderButtonType}="${BUTTON_DATASET.STRIP}">
							${BUTTON_NAMES.STRIP}
						</button>
					<li>
					<li>
                    	<button class="${CLASS_NAMES.button} ${CLASS_NAMES.builderButton}" 
							${DATASET.dataBuilderButtonType}="${BUTTON_DATASET.SAVE}">
							${BUTTON_NAMES.SAVE}
						</button>
					<li>
                </ul>
                    `;
	}
}
export default new BuilderButtonsView();
