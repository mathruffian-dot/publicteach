import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-start-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fcd34d; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f59e0b; stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle
        cx="50" cy="50" r="45"
        fill="none"
        stroke="#475569"
        stroke-width="4"
      />
      <circle
        class="animate-spin-slow"
        cx="50" cy="50" r="45"
        fill="none"
        stroke="#f59e0b"
        stroke-width="4"
        stroke-dasharray="10 15"
        stroke-linecap="round"
        style="transform-origin: 50% 50%;"
      />
      <polygon
        points="40,30 70,50 40,70"
        fill="url(#amberGradient)"
        class="transition-transform duration-300 group-hover:scale-110"
      />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartIconComponent {}
