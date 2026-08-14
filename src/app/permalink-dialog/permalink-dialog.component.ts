import { Component, Inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'permalink-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Permalink</h2>
      <button
        mat-icon-button
        (click)="dialogRef.close()"
        class="close-button"
        matTooltip="Close"
      >
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-dialog-content>
      <div class="permalink-row">
        <span class="permalink-text">{{ data.permalink }}</span>
        <button mat-icon-button (click)="copyLink()" matTooltip="Copy link">
          <mat-icon>content_copy</mat-icon>
        </button>
      </div>
      <p *ngIf="copied" class="copied-msg">Copied!</p>
    </mat-dialog-content>
  `,
  styles: [
    `
      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px 0 24px;
      }
      .dialog-header h2 {
        margin: 0;
      }
      .close-button {
        margin-left: 8px;
      }
      .permalink-row {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: #f5f5f5;
        border-radius: 4px;
        padding: 12px;
      }
      .permalink-text {
        flex: 1;
        word-break: break-all;
        font-size: 0.95em;
        line-height: 1.4;
      }
      .copied-msg {
        color: green;
        font-size: 0.85em;
        margin-top: 4px;
      }
    `,
  ],
})
export class PermalinkDialogComponent {
  copied = false;

  constructor(
    public dialogRef: MatDialogRef<PermalinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { permalink: string }
  ) {}

  copyLink(): void {
    navigator.clipboard.writeText(this.data.permalink).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}
