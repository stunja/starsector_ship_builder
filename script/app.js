import ViewModel from "./viewModel";
import { Model } from "./model";
import BuilderController from "./controller/BuilderController";
import View from "./allViews/view";

export default class App {
	constructor() {
		this.initialize();
	}
	async initialize() {
		try {
			const model = new Model();
			const viewModel = new BuilderController(model);
			// const view = new View(viewModel);

			await model.loadData();
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
