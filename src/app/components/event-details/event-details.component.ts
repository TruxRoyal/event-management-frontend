import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../models/event';
import { EventService } from '../../services/event.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailComponent {
  @Input() event!: CalendarEvent;
  @Output() onEdit = new EventEmitter<CalendarEvent>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() eventUpdated = new EventEmitter<void>();
  @Output() editEventRequest = new EventEmitter<CalendarEvent>();

  isEditing: boolean = false; 
  editedEvent: CalendarEvent = { ...this.event };

  constructor(private eventService: EventService) {}

  editEvent(): void {
    this.isEditing = true;
    this.editedEvent = { ...this.event };
  }

  saveEvent(): void {
    if (!this.editedEvent.id_event) {
      console.error("Error: id_event es undefined.");
      return;
    }
  
    this.eventService.updateEvent(this.editedEvent.id_event, this.editedEvent).subscribe(() => {
      this.eventUpdated.emit(); 
      this.isEditing = false; 
    });
  }
  

  cancelEdit(): void {
    this.isEditing = false;
  }

  deleteEvent(): void {
    if (confirm('¿Seguro que quieres eliminar este evento?')) {
      this.eventService.deleteEvent(this.event.id_event!).subscribe(() => {
        this.eventUpdated.emit();
      });
    }
  }
}
