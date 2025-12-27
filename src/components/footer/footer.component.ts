import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SendIconComponent } from '../icons/send-icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, SendIconComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  sessionActive = input.required<boolean>();
  remindForEngagement = input.required<boolean>();
  engagementChange = output<string>();
  noteAdd = output<string>();

  noteText = signal('');
  engagementLevel = signal('中');

  engagementOptions = [
    { value: '高', color: 'bg-green-500', label: '高' },
    { value: '中', color: 'bg-yellow-500', label: '中' },
    { value: '低', color: 'bg-red-500', label: '低' },
  ];

  setEngagement(level: string) {
    if(!this.sessionActive()) return;
    this.engagementLevel.set(level);
    this.engagementChange.emit(level);
  }

  sendNote() {
    if (this.sessionActive() && this.noteText().trim()) {
      this.noteAdd.emit(this.noteText());
      this.noteText.set('');
    }
  }
}
