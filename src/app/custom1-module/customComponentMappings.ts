import { StackMapComponent } from '../stack-map/stack-map.component';
import { OtherSearchComponent } from '../other-search/other-search.component';
import { ReportProblemComponent } from '../report-problem/report-problem.component';
// Define the map
export const selectorComponentMap = new Map<string, any>([
  ['nde-location-items-container-after', StackMapComponent],
  ['nde-top-bar-after', OtherSearchComponent],
  ['nde-record-actions-bottom', ReportProblemComponent],
]);
