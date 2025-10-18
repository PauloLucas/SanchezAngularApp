import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-dial-radio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dial-radio.component.html',
  styleUrl: './dial-radio.component.scss'
})
export class DialRadioComponent {
  @Input() totalPages = 1;
  private _page = signal(1);

  @Input() set page(value: number) {
    this._page.set(this.clamp(value));
  }
  get page(): number {
    return this._page();
  }

  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  tickLeft = (p: number) =>
    this.totalPages > 1 ? ((p - 1) * 100) / (this.totalPages - 1) : 0;

  needleLeft = () =>
    this.totalPages > 1 ? ((this._page() - 1) * 100) / (this.totalPages - 1) : 0;


  private dragging = false;

  startDrag(ev: PointerEvent) {
    this.dragging = true;
    (ev.target as HTMLElement).setPointerCapture?.(ev.pointerId);
  }

  @HostListener('document:pointermove', ['$event'])
  onMove(ev: PointerEvent) {
    if (!this.dragging) return;
    this.setFromClientX(ev.clientX);
  }

  @HostListener('document:pointerup')
  @HostListener('document:lostpointercapture')
  endDrag() { if (this.dragging) { this.dragging = false; } }

  onTrackClick(ev: MouseEvent) {
    this.setFromClientX(ev.clientX);
  }

  step(delta: 1 | -1) {
    this.toPage(this.page + delta);
  }

  private setFromClientX(clientX: number) {
    const track = (document.querySelector('app-radio-tuner .track') || document.querySelector('.track')) as HTMLElement;
    if (!track || this.totalPages < 1) return;
    const rect = track.getBoundingClientRect();
    const pct = (clientX - rect.left) / rect.width;
    const page = Math.round(pct * (this.totalPages - 1)) + 1;
    this.toPage(page);
  }

  private toPage(p: number) {
    const clamped = this.clamp(p);
    if (clamped !== this.page) {
      this._page.set(clamped);
      this.pageChange.emit(clamped);
    }
  }

  private clamp(v: number) {
    if (this.totalPages < 1) return 1;
    return Math.max(1, Math.min(this.totalPages, Math.trunc(v || 1)));
  }
}
