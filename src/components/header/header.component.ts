import { Component, ChangeDetectionStrategy, input, output, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartIconComponent } from '../icons/start-icon.component';
import { StopIconComponent } from '../icons/stop-icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, StartIconComponent, StopIconComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  sessionActive = input.required<boolean>();
  sessionToggle = output<boolean>();
  subjectChange = output<string>();

  currentTime = signal('');
  private timeInterval: any;

  subjects = ['國文', '英文', '數學', '自然', '社會', '藝文', '綜合', '體育'];

  constructor() {
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    this.updateTime();
  }

  updateTime() {
    this.currentTime.set(new Date().toLocaleTimeString('zh-TW', { hour12: false }));
  }

  toggle() {
    this.sessionToggle.emit(!this.sessionActive());
  }

  onSubjectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.subjectChange.emit(target.value);
  }
  
  ngOnDestroy() {
    clearInterval(this.timeInterval);
  }
}
