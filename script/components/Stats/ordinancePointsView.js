import classNames from "../../helper/DomClassNames";

class OrdinancePointsView {
	render(state) {
		const localParent = `.${classNames.ordinancePointsGraph}`;

		const currentShipBuild = state.currentShipBuild;

		const markup = `
           <li>
             <h5 class="${classNames.ordinanceGraphTitle}">
               [Current / Total] Ordinance Points
             </h5>
           </li>
           <li class="${classNames.ordinanceGraphBody}">
             <div class="${classNames.ordinanceGraphPoints}">
               <h5 class="${classNames.ordinancePointsRenderTextClass}">${currentShipBuild.currentOrdinancePoints}</h5>
               <span> / </span>
               <h5 class="${classNames.ordinanceGraphPointsMaxPoints}">${currentShipBuild.maxOrdinancePoints}</h5>
             </div>
           </li>
          `;
		return [markup, localParent];
	}
}
export default new OrdinancePointsView();
