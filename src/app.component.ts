import { Component, ChangeDetectionStrategy, signal, effect, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import child components
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent, TeachingState, TeachingAction, LogEntry } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { SummaryModalComponent } from './components/modal/summary-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    SummaryModalComponent
  ]
})
export class AppComponent implements OnDestroy {
  // Core State Signals
  sessionActive = signal(false);
  sessionStartTime = signal<Date | null>(null);
  elapsedTime = signal(0);
  
  // App Data
  selectedSubject = signal('國文');
  logStream = signal<LogEntry[]>([]);
  teachingStates = signal<TeachingState[]>([
    { name: '講述教學', active: false, time: 0, icon: 'presentation' },
    { name: '小組討論', active: false, time: 0, icon: 'group' },
    { name: '實作/演算', active: false, time: 0, icon: 'lab' },
    { name: '數位運用', active: false, time: 0, icon: 'device' },
  ]);
  teachingActions = signal<TeachingAction[]>([
    { name: '正向鼓勵', count: 0, icon: 'thumbUp', active: false, time: 0 },
    { name: '糾正規範', count: 0, icon: 'thumbDown', active: false, time: 0 },
    { name: '開放提問', count: 0, icon: 'questionOpen', active: false, time: 0 },
    { name: '封閉提問', count: 0, icon: 'questionClosed', active: false, time: 0 },
    { name: '巡視走動', count: 0, icon: 'walk', active: false, time: 0 },
  ]);
  qualitativeNotes = signal<string[]>([]);
  engagementLog = signal<{ time: string, level: string }[]>([]);
  showSummaryModal = signal(false);

  private timerInterval: any;
  private lastInteractionTime = signal(Date.now());
  remindForEngagement = signal(false);
  
  // Computed Signal for Total Time
  totalSessionTimeFormatted = computed(() => this.formatTime(this.elapsedTime()));

  constructor() {
    effect(() => {
      if (this.sessionActive()) {
        this.startTimers();
      } else {
        this.stopTimers();
      }
    }, { allowSignalWrites: true });

    // Firebase Initialization Placeholder
    this.initializeFirebase();
  }

  ngOnDestroy() {
    this.stopTimers();
  }

  private initializeFirebase() {
    // const firebaseConfig = {
    //   apiKey: "YOUR_API_KEY",
    //   authDomain: "YOUR_AUTH_DOMAIN",
    //   projectId: "YOUR_PROJECT_ID",
    //   // ... other config
    // };
    // TODO: Initialize Firebase App here
    console.log("Firebase anitialization placeholder.");
  }
  
  private startTimers() {
    if (this.timerInterval) return;
    if(!this.sessionStartTime()) {
      this.sessionStartTime.set(new Date());
    }
    
    this.timerInterval = setInterval(() => {
      // Update total elapsed time
      this.elapsedTime.update(t => t + 1);

      // Update active teaching states
      this.teachingStates.update(states =>
        states.map(s => (s.active ? { ...s, time: s.time + 1 } : s))
      );

      // Update active teaching actions
      this.teachingActions.update(actions =>
        actions.map(a => (a.active ? { ...a, time: a.time + 1 } : a))
      );
      
      // Check for engagement reminder
      if (Date.now() - this.lastInteractionTime() > 5 * 60 * 1000) { // 5 minutes
          this.remindForEngagement.set(true);
      } else {
          this.remindForEngagement.set(false);
      }
    }, 1000);
  }

  private stopTimers() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  toggleSession(active: boolean) {
    this.sessionActive.set(active);
    if (active) {
      this.addLog('觀課開始');
      this.lastInteractionTime.set(Date.now());
    } else {
      this.addLog('觀課結束');
      this.showSummaryModal.set(true);
    }
  }

  handleSubjectChange(subject: string) {
      this.selectedSubject.set(subject);
      this.addLog(`科目變更為: ${subject}`);
  }

  handleStateToggle(stateName: string) {
    this.teachingStates.update(states =>
      states.map(s =>
        s.name === stateName ? { ...s, active: !s.active } : s
      )
    );
    const toggledState = this.teachingStates().find(s => s.name === stateName);
    this.addLog(`教學模式: ${stateName} - ${toggledState?.active ? '啟用' : '停用'}`);
    this.updateInteractionTime();
  }

  handleActionToggle(actionName: string) {
    let becameActive = false;
    this.teachingActions.update(actions =>
      actions.map(a => {
        if (a.name === actionName) {
          const newActiveState = !a.active;
          becameActive = newActiveState;
          return {
            ...a,
            active: newActiveState,
            count: newActiveState ? a.count + 1 : a.count, // Increment count on activation
          };
        }
        return a;
      })
    );
    this.addLog(`教學行為: ${actionName} - ${becameActive ? '啟用' : '停用'}`);
    this.updateInteractionTime();
  }

  handleEngagementChange(level: string) {
    const time = new Date().toLocaleTimeString('zh-TW', { hour12: false });
    this.engagementLog.update(log => [...log, { time, level }]);
    this.addLog(`學生專注度: ${level}`);
    this.updateInteractionTime();
  }

  handleNoteAdd(note: string) {
    if(!note.trim()) return;
    this.qualitativeNotes.update(notes => [...notes, note]);
    this.addLog(`質性紀錄: "${note}"`);
    this.updateInteractionTime();
  }

  handleCloseModal() {
    this.showSummaryModal.set(false);
  }
  
  private addLog(event: string) {
    const timestamp = new Date();
    this.logStream.update(logs => [{ timestamp, event }, ...logs].slice(0, 50)); // Keep last 50 logs
  }
  
  private updateInteractionTime() {
      this.lastInteractionTime.set(Date.now());
      this.remindForEngagement.set(false);
  }

  private formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}