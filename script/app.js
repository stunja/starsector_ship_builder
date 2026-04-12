import { Model } from "./model";
import BuilderController from "./components/BuilderController";

export default class App {
	constructor(shipName) {
		// shipName is a insertable value to create a newShip, for example Search => create new Ship
		this.initialize(shipName);
	}
	async initialize(shipName) {
		try {
			const model = new Model();

			// make sure it is before viewModel
			await model.loadData(shipName);

			const viewModel = new BuilderController(model);
		} catch (err) {
			console.error("Error initialize the Ship Builder", err);
			// I can add inner HTML with an error
		}
	}
}
// Usage
window.addEventListener("DOMContentLoaded", () => {
	new App();
});

//! DELETE LATER
if (import.meta.hot) {
	import.meta.hot.accept(() => {
		window.location.reload();
	});
}
