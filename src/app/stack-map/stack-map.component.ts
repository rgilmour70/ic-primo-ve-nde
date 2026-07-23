import { Component, Input, OnInit } from '@angular/core';
import stackMapDataGeneral from '../../assets/map-data-general.json';
import stackMapDataMusic from '../../assets/map-data-music.json';
import stackMapDataBlobs from '../../assets/map-data-blobs.json';
import { PrimoLocation } from './models/primo-location';
import { ICLocation } from './models/ic-location';
import { ICBlob, ICBlobs } from './models/ic-blob';
import { normalizeLC, sortLC } from './lc-utils/call-number-functions';

const icBlobs: ICBlobs = stackMapDataBlobs;

@Component({
  selector: 'custom-stack-map',
  standalone: true,
  imports: [],
  templateUrl: './stack-map.component.html',
  styleUrl: './stack-map.component.scss',
})
export class StackMapComponent implements OnInit {
  @Input() protected hostComponent!: { location: PrimoLocation };

  callNumber: string = '';
  location: string = '';
  locationCode: string = '';
  isAvailable: boolean = true;
  result: ICBlob | ICLocation | undefined = undefined;

  ngOnInit(): void {
    this.callNumber = this.hostComponent.location.callNumber;
    this.location = this.hostComponent.location.subLocation;
    this.locationCode = this.hostComponent.location.subLocationCode;
    this.isAvailable =
      this.hostComponent.location.availabilityStatus === 'available';
    this.result = this.lookupStackLocation(this.locationCode, this.callNumber);
  }

  hasMessage(value: ICBlob | ICLocation | undefined): value is ICBlob {
    return !!value && 'message' in value;
  }

  get floor(): string | undefined {
    if (!this.result) return undefined;
    return 'floor' in this.result
      ? this.result.floor
      : this.result.id?.slice(0, 1);
  }

  get floorMapSrc(): string {
    return `/assets/images/floorMaps/floor_${this.floor}@2x.png`;
  }

  private findLocation(callNumber: string): ICLocation | undefined {
    const normalizedCallNumber = normalizeLC(callNumber);
    if (!normalizedCallNumber) {
      console.warn(`Could not normalize call number: ${callNumber}`);
      return undefined;
    }
    let datasource =
      normalizedCallNumber.slice(0, 1) === 'M'
        ? stackMapDataMusic
        : stackMapDataGeneral;
    for (const entry of datasource) {
      const test = sortLC(entry.start, entry.end, callNumber);
      if (normalizeLC(test[1]) === normalizedCallNumber || test.length === 2) {
        return entry;
      }
    }
    return undefined;
  }

  private lookupStackLocation(
    locationCode: string,
    callNumber: string
  ): ICLocation | ICBlob | undefined {
    if (Object.keys(icBlobs).includes(locationCode)) {
      return icBlobs[locationCode];
    } else {
      return this.findLocation(callNumber);
    }
  }
}
// drawIndicator(
//   mapHeight: number,
//   mapWidth: number,
//   x: number,
//   y: number,
//   h: number,
//   w: number
// ): void {}
