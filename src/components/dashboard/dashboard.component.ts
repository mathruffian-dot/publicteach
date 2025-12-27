import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Icon Components
import { PresentationIconComponent } from '../icons/presentation-icon.component';
import { GroupIconComponent } from '../icons/group-icon.component';
import { LabIconComponent } from '../icons/lab-icon.component';
import { DeviceIconComponent } from '../icons/device-icon.component';
import { ThumbUpIconComponent } from '../icons/thumb-up-icon.component';
import { ThumbDownIconComponent } from '../icons/thumb-down-icon.component';
import { QuestionOpenIconComponent } from '../icons/question-open-icon.component';
import { QuestionClosedIconComponent } from '../icons/question-closed-icon.component';
import { WalkIconComponent } from '../icons/walk-icon.component';

export interface TeachingState {
  name: string;
  active: boolean;
  time: number;
  icon: string;
}

export interface TeachingAction {
  name: string;
  count: number;
  icon: string;
  active: boolean;
  time: number;
}

export interface LogEntry {
  timestamp: Date;
  event: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PresentationIconComponent, GroupIconComponent, LabIconComponent, DeviceIconComponent,
    ThumbUpIconComponent, ThumbDownIconComponent, QuestionOpenIconComponent, QuestionClosedIconComponent, WalkIconComponent
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  sessionActive = input.required<boolean>();
  teachingStates = input.required<TeachingState[]>();
  teachingActions = input.required<TeachingAction[]>();
  logStream = input.required<LogEntry[]>();

  stateToggle = output<string>();
  actionToggle = output<string>();

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  formatLogTime(date: Date): string {
    return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }

  onStateClick(stateName: string) {
    if (this.sessionActive()) {
      this.stateToggle.emit(stateName);
    }
  }

  onActionClick(actionName: string) {
    if (this.sessionActive()) {
      this.actionToggle.emit(actionName);
    }
  }
}