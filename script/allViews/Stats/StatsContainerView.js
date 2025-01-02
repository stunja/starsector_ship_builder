import classNames from "../../helper/DomClassNames";
import View from "../view";

class StatsContainerView extends View {
	_localParent = `.${classNames.statsContainer}`;

	generateMarkup() {
		return `
        <ul class="${classNames.ordinancePointsGraph}"></ul>
            <div class="${classNames.topContentGroup}">
                <ul class="${classNames.flexFlexEndGap} ${classNames.speedArmorHullContainer}"></ul>
                <ul class="${classNames.flexFlexEndGap} ${classNames.shipCapacitorsContainer}"></ul>
                <ul class="${classNames.flexFlexEndGap} ${classNames.shipVents}"></ul>
                <div class="${classNames.phaseOrShieldContainer}"></div>
                <ul class="${classNames.flexFlexEndGap} ${classNames.weaponFlux}"></ul>
            </div>
        <div class="${classNames.hullMods}"></div>`;
	}
}
export default new StatsContainerView();
