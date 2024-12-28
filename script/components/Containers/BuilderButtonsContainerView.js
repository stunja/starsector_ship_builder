import classNames from "../../helper/DomClassNames";
const BUTTON__NAMES = {
	STRIP: "Strip Everything",
	SAVE: "Save the ship",
};
class BuilderButtonsContainerView {
	render(state) {
		const localParent = `.${classNames.builderButtonsContainer}`;
		const markup = `${this.#buttonsMarkup()}`;

		return [markup, localParent];
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
export default new BuilderButtonsContainerView();
