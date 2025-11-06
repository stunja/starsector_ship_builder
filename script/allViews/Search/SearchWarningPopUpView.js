import View from "../view";
//
import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
//
const STRINGS = {
	HEADER: "Warning",
	TEXT: "All your progress is going to be lost, and new empty frame would be selected",
	BUTTONS: {
		CONTINUE: "Abandon Current Design",
		RETURN: "Return Back",
	},
};
class SearchWarningPopUpView extends View {
	_localParent = `.${CLASS_NAMES.mainPopup}`;

	generateMarkup() {
		const markup = `
						<div class="${CLASS_NAMES.popUpWarning}">
							<p>${STRINGS.HEADER}</p>
							<p>${STRINGS.TEXT}</p>
							<div>
								<button class="${CLASS_NAMES.button} ${CLASS_NAMES.popUpWarningButton}" 
								${UI_DATASETS.MAIN_POPUP.WIPE_WARNING.CONTINUE}>
									${STRINGS.BUTTONS.CONTINUE}
								</button>
								<button class="${CLASS_NAMES.button} ${CLASS_NAMES.popUpWarningButton}"
								${UI_DATASETS.MAIN_POPUP.WIPE_WARNING.RETURN}>
									${STRINGS.BUTTONS.RETURN}
								</button>
							</div>
						</div>`;
		return markup;
	}
}
export default new SearchWarningPopUpView();
