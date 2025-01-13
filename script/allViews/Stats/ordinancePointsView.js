import classNames from "../../helper/DomClassNames";
import View from "../view";

const STRING = {
	GRAPH_TITLE: "[Current / Total] Ordinance Points",
};
class OrdinancePointsView extends View {
	_localParent = `.${classNames.ordinancePointsGraph}`;

	generateMarkup() {
		const userShipBuild = this._data;

		const markup = `
           <li>
             <h5 class="${classNames.ordinanceGraphTitle}">
               ${STRING.GRAPH_TITLE}
             </h5>
           </li>
           <li class="${classNames.ordinanceGraphBody}">
             <div class="${classNames.ordinanceGraphPoints}">
               <h5 class="${classNames.ordinancePointsRenderTextClass}">${userShipBuild.ordinancePoints}</h5>
               <span> / </span>
               <h5 class="${classNames.ordinanceGraphPointsMaxPoints}">${userShipBuild.maxOrdinancePoints}</h5>
             </div>
           </li>
          `;
		return markup;
	}
}
export default new OrdinancePointsView();
