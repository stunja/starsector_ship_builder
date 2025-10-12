// View
import View from "./view";
// Helper
import CLASS_NAMES from "../helper/ui/class_names";

class AdditionalInfoView extends View {
	_localParent = `.${CLASS_NAMES.additionalInfoContainer}`;

	generateMarkup() {
		const markup = "additional info";

		return markup;
	}
}
export default new AdditionalInfoView();
