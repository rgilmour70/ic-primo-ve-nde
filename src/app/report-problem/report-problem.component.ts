import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { Observable, Subscription, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  createFeatureSelector,
  createSelector,
  select,
  Store,
} from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

const selectSearchState = createFeatureSelector<any>('Search');

const selectSearchEntities = createSelector(
  selectSearchState,
  (state) => state.entities
);

const selectFullDisplayState = createFeatureSelector<any>('full-display');
const selectFullviewRecordId = createSelector(
  selectFullDisplayState,
  (state) => state.selectedRecordId
);

const selectFullviewRecord = createSelector(
  selectFullviewRecordId,
  selectSearchEntities,
  (recordId, searchEntities) => searchEntities[recordId]
);

// This part is just for the call number, which needs
// the delivery data rather than full display
const selectDeliveryState = createFeatureSelector<any>('Delivery');
const selectDeliveryEntities = createSelector(
  selectDeliveryState,
  (state) => state.entities
);
const selectFullviewDelivery = createSelector(
  selectFullviewRecordId,
  selectDeliveryEntities,
  (recordId, deliveryEntities) => deliveryEntities[recordId]
);

@Component({
  selector: 'custom-report-problem',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './report-problem.component.html',
  styleUrl: './report-problem.component.scss',
})
export class ReportProblemComponent implements OnInit, OnDestroy {
  @Input() hostComponent: any;
  record$: Observable<any>;
  delivery$: Observable<any>;
  reportFormUrl: string = '';
  private sub!: Subscription;

  constructor(private store: Store) {
    this.record$ = this.store.pipe(select(selectFullviewRecord));
    this.delivery$ = this.store.pipe(select(selectFullviewDelivery));
  }

  ngOnInit(): void {
    this.sub = this.getRecordSource().subscribe(({ record, delivery }) => {
      this.buildReportUrl(record, delivery);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get shouldShowButton(): boolean {
    const searchResult = this.hostComponent?.searchResult;
    return !!searchResult && Object.keys(searchResult).length > 0;
  }

  private getRecordSource(): Observable<{ record: any; delivery: any }> {
    const searchResult = this.hostComponent?.searchResult;
    const isListContext =
      !!searchResult && Object.keys(searchResult).length > 0;

    if (isListContext) {
      return of({ record: searchResult, delivery: null });
    }

    return combineLatest([this.record$, this.delivery$]).pipe(
      map(([record, delivery]) => ({ record, delivery }))
    );
  }

  private buildReportUrl(record: any, delivery: any): void {
    const addata = record?.pnx?.addata ?? {};
    const callNumber = delivery?.delivery?.bestlocation?.callNumber ?? '';
    const recordId = record?.pnx?.control?.recordid?.[0] ?? '';
    const mmsid = recordId.substring(4);
    const permalink =
      'https://ithaca.primo.exlibrisgroup.com/discovery/fulldisplay?docid=' +
      recordId +
      '&context=PC&vid=01ITHACACOL_INST:01ITHACACOL_V1';
    const base = 'https://library.ithaca.edu/forms/primo_problems.php';

    const params = new URLSearchParams({
      origin: 'primo',
      callNumber,
      mmsid,
      permalink,
    });

    const reserved = ['origin', 'callNumber', 'mmsid', 'permalink'];

    Object.keys(addata)
      .filter((field) => field !== 'abstract' && !reserved.includes(field))
      .forEach((field) => {
        const value = Array.isArray(addata[field])
          ? addata[field][0]
          : addata[field];
        params.set(field, value);
      });

    this.reportFormUrl = `${base}?${params.toString()}`;
  }
}
