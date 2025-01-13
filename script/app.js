import { Model } from "./model";
import BuilderController from "./components/BuilderController";

export default class App {
	constructor() {
		this.initialize();
	}
	async initialize() {
		try {
			const model = new Model();

			// make sure it is before viewModel
			await model.loadData();

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
