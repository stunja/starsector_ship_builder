import classNames from "../helper/DomClassNames";
import View from "./view";

class AdditionalInfoView extends View {
	_localParent = `.${classNames.additionalInfoContainer}`;

	generateMarkup() {
		const markup = "additional info";

		return markup;
	}
}
export default new AdditionalInfoView();
