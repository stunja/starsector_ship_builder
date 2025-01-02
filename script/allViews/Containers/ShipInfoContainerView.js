import classNames from "../../helper/DomClassNames";
import View from "../view";

class ShipInfoContainerView extends View {
	_localParent = `.${classNames.shipInfoContainer}`;

	generateMarkup() {
		const data = this._data;

		const markup = `${this.#infoMarkup()}`;

		return markup;
	}
	#infoMarkup() {
		//! NEXT FEATURE
		// console.log(currentShip);
		return `<p>Ship Name</p>`;
	}
}
export default new ShipInfoContainerView();
