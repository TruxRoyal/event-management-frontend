import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { CalendarEvent } from '../../models/event';
import { EventDetailComponent } from '../event-details/event-details.component';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, EventDetailComponent, EventFormComponent],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  @Input() events: CalendarEvent[] = [];
  @Output() eventSelected = new EventEmitter<CalendarEvent>(); 
  @Output() editEventRequest = new EventEmitter<CalendarEvent>();
  selectedEvent: CalendarEvent | null = null; 

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => this.events = data,
      (error) => console.error('Error al obtener eventos:', error)
    );
  }

  onEditEvent(event: CalendarEvent): void {
    this.editEventRequest.emit(event);
  }

  selectEvent(event: CalendarEvent): void {
    this.selectedEvent = event;
    this.eventSelected.emit(event);
  }
}
