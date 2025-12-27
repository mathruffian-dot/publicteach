import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeachingState, TeachingAction } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-summary-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryModalComponent {
  // Input data for the summary
  subject = input.required<string>();
  startTime = input.required<Date | null>();
  totalTime = input.required<string>();
  states = input.required<TeachingState[]>();
  actions = input.required<TeachingAction[]>();
  engagementLog = input.required<{ time: string, level: string }[]>();
  qualitativeNotes = input.required<string[]>();

  // Output event
  closeModal = output<void>();

  private generateReportText(): string {
    const s = this.startTime() ? new Date(this.startTime()!).toLocaleString('zh-TW') : 'N/A';
    
    let report = `## Chronos 觀課報告 ##\n\n`;
    report += `科目: ${this.subject()}\n`;
    report += `觀課開始時間: ${s}\n`;
    report += `總時長: ${this.totalTime()}\n`;
    report += `=========================\n\n`;

    report += `### 教學模式 (States) ###\n`;
    this.states().forEach(state => {
      report += `- ${state.name}: ${this.formatTime(state.time)}\n`;
    });
    report += `\n`;

    report += `### 教學行為 (Actions) ###\n`;
    this.actions().forEach(action => {
      if (action.count > 0) {
        report += `- ${action.name}: ${action.count} 次, 總計 ${this.formatTime(action.time)}\n`;
      }
    });
    report += `\n`;

    report += `### 學生專注度紀錄 ###\n`;
    this.engagementLog().forEach(log => {
      report += `- [${log.time}] ${log.level}\n`;
    });
    report += `\n`;

    report += `### 質性紀錄 ###\n`;
    this.qualitativeNotes().forEach(note => {
      report += `- ${note}\n`;
    });
    report += `\n=========================\n`;
    report += `報告生成時間: ${new Date().toLocaleString('zh-TW')}`;
    
    return report;
  }

  copyReport() {
    const reportText = this.generateReportText();
    navigator.clipboard.writeText(reportText).then(() => {
      alert('紀錄已複製到剪貼簿！');
    }).catch(err => {
      console.error('Could not copy text: ', err);
      alert('複製失敗，請檢查瀏覽器權限。');
    });
  }

  downloadReport() {
    const reportText = this.generateReportText();
    const blob = new Blob(['\uFEFF' + reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `Chronos觀課報告-${this.subject()}-${dateStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  formatTime(totalSeconds: number): string {
    if (totalSeconds === 0) return '0秒';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let timeString = '';
    if (hours > 0) timeString += `${hours}時`;
    if (minutes > 0) timeString += `${minutes}分`;
    if (seconds > 0 || timeString === '') timeString += `${seconds}秒`;
    return timeString;
  }
}