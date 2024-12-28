import classNames from "../../helper/DomClassNames";

class AdditionalInfoContainerView {
	render() {
		const localParent = `.${classNames.additionalInfoContainer}`;
		const markup = "additional info";

		return [markup, localParent];
	}
}
export default new AdditionalInfoContainerView();
