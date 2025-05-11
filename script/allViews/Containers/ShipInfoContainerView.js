import classNames from "../../helper/DomClassNames";
import View from "../view";

class ShipInfoContainerView extends View {
	_localParent = `.${classNames.shipInfoContainer}`;

	generateMarkup() {
		this.#processData(this._data);

		const markup = this.#infoMarkup();

		return markup;
	}
	#processData(data) {
		const { dataState, userState } = data;
		const { allDescriptions } = dataState;
		const { _currentShip } = userState;
		console.log(_currentShip);
		console.log(allDescriptions);
	}
	#infoMarkup() {
		//! NEXT FEATURE
		// console.log(currentShip);
		return `<p>Ship Name</p>`;
	}
}
export default new ShipInfoContainerView();
