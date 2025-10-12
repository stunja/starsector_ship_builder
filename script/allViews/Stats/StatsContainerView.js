import View from "../view";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names";

class StatsContainerView extends View {
	_localParent = `.${CLASS_NAMES.statsContainer}`;

	generateMarkup() {
		return `
        <ul class="${CLASS_NAMES.ordinancePointsGraph}"></ul>
            <div class="${CLASS_NAMES.topContentGroup}">
                <ul class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.speedArmorHullContainer}"></ul>
                <ul class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.shipCapacitorsContainer}"></ul>
                <ul class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.shipVents}"></ul>
                <div class="${CLASS_NAMES.phaseOrShieldContainer}"></div>
                <ul class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.weaponFlux}"></ul>
            </div>
        <div class="${CLASS_NAMES.hullMods}"></div>`;
	}
}
export default new StatsContainerView();
