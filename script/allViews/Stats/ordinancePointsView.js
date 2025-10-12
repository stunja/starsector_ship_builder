import View from "../view";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names";

const STRING = {
	GRAPH_TITLE: "[Current / Total] Ordinance Points",
};
class OrdinancePointsView extends View {
	_localParent = `.${CLASS_NAMES.ordinancePointsGraph}`;

	#userShipBuild;
	generateMarkup() {
		this.#userShipBuild = this._data;

		return this.#ordinancePointsMarkup();
	}
	#ordinancePointsMarkup = () =>
		`<li>
          <h5 class="${CLASS_NAMES.ordinanceGraphTitle}">
            ${STRING.GRAPH_TITLE}
          </h5>
        </li>
        <li class="${CLASS_NAMES.ordinanceGraphBody}">
          <div class="${CLASS_NAMES.ordinanceGraphPoints}">
            <h5 class="${CLASS_NAMES.ordinancePointsRenderTextClass}">
              ${this.#userShipBuild.ordinancePoints || 0}
            </h5>
            <span> / </span>
            <h5 class="${CLASS_NAMES.ordinanceGraphPointsMaxPoints}">
              ${this.#userShipBuild.maxOrdinancePoints}
            </h5>
          </div>
        </li>`;
}
export default new OrdinancePointsView();
