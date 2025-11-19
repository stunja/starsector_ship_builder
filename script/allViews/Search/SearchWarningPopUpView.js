import View from "../view";
//
import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
//
const STRINGS = {
	HEADER: (currentShip) =>
		`Do you want switch from your current design to ${currentShip.name}?`,
	TEXT: "You are trying to select new ship. This action cannot be undone, all previous your progress is going to be lost, and new empty ship frame will be selected. Try saving first.",
	WARNING_TEXT: "Warning: This is irreversible.",
	BUTTONS: {
		CONTINUE: "Design a New Ship",
		RETURN: "Return Back",
	},
};
class SearchWarningPopUpView extends View {
	_localParent = `.${CLASS_NAMES.POP_UP._BASE}`;

	generateMarkup() {
		const currentShip = this._data;

		const markup = `
					<div class="${CLASS_NAMES.POP_UP.WARNING_WRAPPER}">
						<div class="${CLASS_NAMES.POP_UP.OVERLAY}">
							<div class="${CLASS_NAMES.POP_UP.WARNING}">
								<h3>${STRINGS.HEADER(currentShip)}</h3>
								<p>${STRINGS.TEXT}</p>
								<div class="${CLASS_NAMES.POP_UP.WARNING_BAR}">
									<span class="${CLASS_NAMES.ICON._BASE}"></span>
									<p>${STRINGS.WARNING_TEXT}</p>
								</div>
								<div class="${CLASS_NAMES.POP_UP.WARNING_WRAPPER_BUTTONS}">
									<button class="${CLASS_NAMES.button} 
									${CLASS_NAMES.BUTTON.SECONDARY} ${CLASS_NAMES.POP_UP.WARNING_BUTTON}"
									${UI_DATASETS.MAIN_POPUP.WIPE_WARNING.RETURN}
									>
										${STRINGS.BUTTONS.RETURN}
									</button>
									<button class="${CLASS_NAMES.button} ${CLASS_NAMES.POP_UP.WARNING_BUTTON}" 
									${UI_DATASETS.MAIN_POPUP.WIPE_WARNING.CONTINUE}>
										${STRINGS.BUTTONS.CONTINUE}
									</button>
								</div>
							</div>
						</div>
					</div>`;
		return markup;
	}
}
export default new SearchWarningPopUpView();
