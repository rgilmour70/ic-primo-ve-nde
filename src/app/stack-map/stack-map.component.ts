import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
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
export class StackMapComponent implements OnInit, AfterViewInit {
  @Input() protected hostComponent!: { location: PrimoLocation };
  @ViewChild('overlay') overlayRef!: ElementRef<HTMLCanvasElement>;

  callNumber: string = '';
  location: string = '';
  locationCode: string = '';
  isAvailable: boolean = true;
  needsMap: boolean = false;
  result: ICBlob | ICLocation | undefined;

  ngOnInit(): void {
    this.callNumber = this.hostComponent.location.callNumber;
    this.location = this.hostComponent.location.subLocation;
    this.locationCode = this.hostComponent.location.subLocationCode;
    this.isAvailable =
      this.hostComponent.location.availabilityStatus === 'available';
    this.result = this.lookupStackLocation(this.locationCode, this.callNumber);
    this.needsMap = Boolean(this.isAvailable && this.callNumber);
  }

  ngAfterViewInit(): void {
    if (this.result) {
      this.drawMarker(this.result);
    }
  }

  hasMessage(value: ICBlob | ICLocation | undefined): value is ICBlob {
    // test if something is an ICBlob
    return !!value && 'message' in value;
  }

  get floor(): string | undefined {
    if (!this.result) return undefined;
    return 'floor' in this.result
      ? this.result.floor
      : this.result.id?.slice(0, 1);
  }

  get stack(): string | undefined {
    if (!this.result) return undefined;
    if (this.hasMessage(this.result)) return undefined; // ICBlob has no "stack"
    return this.result.id!.split('.')[1];
  }

  get stackSide(): string | undefined {
    if (!this.result) return undefined;
    if (this.hasMessage(this.result)) return undefined;
    return this.result.id!.slice(-1) === 'e' ? 'east' : 'west';
  }

  get locationMessage(): string | undefined {
    if (!this.result) return undefined;
    if (this.hasMessage(this.result)) return undefined;
    return `This item is on floor ${this.floor} at stack ${this.stack}, ${this.stackSide} side.`;
  }

  get floorMapSrc(): string {
    return `/assets/images/floorMaps/floor_${this.floor}@2x.png`;
  }

  private findLocation(callNumber: string): ICLocation | undefined {
    const normalizedCallNumber = normalizeLC(callNumber);
    if (!normalizedCallNumber) {
      // console.warn(`Could not normalize call number: ${callNumber}`);
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

  private drawMarker(loc: ICBlob | ICLocation): void {
    const ctx = this.overlayRef.nativeElement.getContext('2d');
    if (!ctx) return;
    const scale = 2;
    ctx.clearRect(0, 0, 1200, 704);
    ctx.fillStyle = 'fuchsia';
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(
      loc.x * scale,
      loc.y * scale,
      loc.width * scale,
      loc.height * scale
    );
  }
}
