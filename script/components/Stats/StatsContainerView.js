import classNames from "../../helper/DomClassNames";

class StatsContainerView {
	render() {
		const localParent = `.${classNames.statsContainer}`;
		const markup = `${this.#markup()}`;

		return [markup, localParent];
	}
	#markup() {
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
