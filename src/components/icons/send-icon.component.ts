import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-send-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendIconComponent {}
