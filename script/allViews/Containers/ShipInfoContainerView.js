// View
import View from "../view";
// Helper
import classNames from "../../helper/DomClassNames";

class ShipInfoContainerView extends View {
	_localParent = `.${classNames.shipInfoContainer}`;

	generateMarkup() {
		const markup = this.#infoMarkup(this._data);

		return markup;
	}
	#infoMarkup(data) {
		const { _currentShip, userShipBuild } = data.userState;
		const { name, designation, techManufacturer } = _currentShip;
		const { hullSize } = userShipBuild;

		const hullSizeString = () => hullSize.toLowerCase().replace("_", " ");

		return `
				<div>
					<h5 class="${classNames.shipInfoTitle}">
						${name}
					</h5>
					<div class="${classNames.shipInfoDetails}">
						<p>${hullSizeString()}</p>
						<p>${designation}</p>
						<p>${techManufacturer}</p>
					</div>
				</div>`;
	}
}
export default new ShipInfoContainerView();
