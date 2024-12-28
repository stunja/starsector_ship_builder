import classNames from "../../helper/DomClassNames";

class ShipInfoContainerView {
	render(state) {
		const localParent = `.${classNames.shipInfoContainer}`;
		const markup = `${this.#infoMarkup()}`;

		return [markup, localParent];
	}
	#infoMarkup() {
		//! NEXT FEATURE
		// console.log(currentShip);
		return `<p>Hello</p>`;
	}
}
export default new ShipInfoContainerView();
