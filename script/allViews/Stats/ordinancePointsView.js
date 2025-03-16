import classNames from "../../helper/DomClassNames";
import View from "../view";

const STRING = {
	GRAPH_TITLE: "[Current / Total] Ordinance Points",
};
class OrdinancePointsView extends View {
	_localParent = `.${classNames.ordinancePointsGraph}`;

	#userShipBuild;
	generateMarkup() {
		this.#userShipBuild = this._data;

		return this.#ordinancePointsMarkup();
	}
	#ordinancePointsMarkup = () =>
		`<li>
          <h5 class="${classNames.ordinanceGraphTitle}">
            ${STRING.GRAPH_TITLE}
          </h5>
        </li>
        <li class="${classNames.ordinanceGraphBody}">
          <div class="${classNames.ordinanceGraphPoints}">
            <h5 class="${classNames.ordinancePointsRenderTextClass}">
              ${this.#userShipBuild.ordinancePoints || 0}
            </h5>
            <span> / </span>
            <h5 class="${classNames.ordinanceGraphPointsMaxPoints}">
              ${this.#userShipBuild.maxOrdinancePoints}
            </h5>
          </div>
        </li>`;
}
export default new OrdinancePointsView();
