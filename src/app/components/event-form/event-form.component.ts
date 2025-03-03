import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CalendarEvent } from '../../models/event';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  @Input() event: CalendarEvent | null = null;
  @Output() eventCreated = new EventEmitter<void>();

  newEvent: CalendarEvent = {
    title_event: '',
    date_event: '',
    description_event: '',
    location_event: '',
    color: '#4285f4'
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    if (this.event) {
      this.newEvent = {
        id_event: this.event.id_event,
        title_event: this.event.title_event,
        date_event: this.event.date_event,
        description_event: this.event.description_event,
        location_event: this.event.location_event,
        color: this.event.color
      };
    }
  }

  saveEvent(): void {
    if (this.event) {
      this.eventService.updateEvent(this.event.id_event!, this.newEvent).subscribe(() => {
        this.eventCreated.emit();
      });
    } else {
      this.eventService.addEvent(this.newEvent).subscribe(() => {
        this.eventCreated.emit();
      });
    }
  }
  
}
