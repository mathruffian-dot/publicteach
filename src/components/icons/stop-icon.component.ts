import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stop-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="rustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#dc2626; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#991b1b; stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle
        cx="50" cy="50" r="48"
        fill="none"
        stroke="#991b1b"
        stroke-width="3"
      />
       <rect
        x="28" y="28" width="44" height="44"
        fill="url(#rustGradient)"
        rx="4"
        class="transition-transform duration-300 group-hover:scale-110"
      />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopIconComponent {}
