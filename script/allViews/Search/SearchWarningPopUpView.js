import View from "../view";
//
import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
//
const BUTTON_DATASET = {
	CONTINUE: "continue",
	RETURN: "return",
};
const STRING = {
	CONTINUE: "Abandon Current Design",
	RETURN: "RETURN BACK",
};
const DESC = {
	HEADER: "Warning",
	TEXT: "All your progress is going to be lost, and new empty frame would be selected",
};
class SearchWarningPopUpView extends View {
	_localParent = `.${CLASS_NAMES.mainPopup}`;

	generateMarkup() {
		const markup = `
						<div class="${CLASS_NAMES.popUpWarning}">
							<p>${DESC.HEADER}</p>
							<p>${DESC.TEXT}</p>
							<div>
								<button class="${CLASS_NAMES.button} ${CLASS_NAMES.popUpWarningButton}" 
								${UI_DATASETS.MAIN_POPUP.WIPE_WARNING.CONTINUE}>
									${STRING.CONTINUE}
								</button>
								<button class="${CLASS_NAMES.button} ${CLASS_NAMES.popUpWarningButton}"
								${UI_DATASETS.MAIN_POPUP.WIPE_WARNING.RETURN}>
									${STRING.RETURN}
								</button>
							</div>
						</div>`;
		return markup;
	}
}
export default new SearchWarningPopUpView();
