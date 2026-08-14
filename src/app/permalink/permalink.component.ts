import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subscription, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  createFeatureSelector,
  createSelector,
  select,
  Store,
} from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { PermalinkDialogComponent } from '../permalink-dialog/permalink-dialog.component';
import { environment } from '../../environments/environment';

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

@Component({
  selector: 'custom-permalink',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './permalink.component.html',
  styleUrl: './permalink.component.scss',
})
export class PermalinkComponent implements OnInit, OnDestroy {
  @Input() hostComponent: any;
  record$: Observable<any>;
  permalink: string = '';
  private sub!: Subscription;

  constructor(private store: Store, private dialog: MatDialog) {
    this.record$ = this.store.pipe(select(selectFullviewRecord));
  }

  ngOnInit(): void {
    this.sub = this.getRecordSource().subscribe(({ record }) => {
      this.buildPermalink(record);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  openDialog(): void {
    this.dialog.open(PermalinkDialogComponent, {
      data: { permalink: this.permalink },
      width: '450px',
    });
  }

  private buildPermalink(record: any): void {
    const recordId = record?.pnx?.control?.recordid?.[0] ?? '';
    const context = record?.context ?? '';
    const vid = environment.viewId;
    this.permalink =
      'https://ithaca.primo.exlibrisgroup.com/nde/fulldisplay?docid=' +
      recordId +
      '&context=' +
      context +
      '&vid=' +
      vid;
  }

  private getRecordSource(): Observable<{ record: any }> {
    const searchResult = this.hostComponent?.searchResult;
    const isListContext =
      !!searchResult && Object.keys(searchResult).length > 0;

    if (isListContext) {
      return of({ record: searchResult });
    }

    return combineLatest([this.record$]).pipe(map(([record]) => ({ record })));
  }
}
