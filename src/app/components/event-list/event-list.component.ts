import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {
  events: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    const observer = {
      next: (events: Event[]) => {
        console.log('Eventos cargados', events);
        this.events = events;
      },
      error: (err: any) => {
        console.error('Error al obtener eventos', err);
      },
      complete: () => {
        console.log('Carga de eventos completos');
      }
    };

    this.eventService.getEvents()
      .pipe(
        tap(events => this.events = events),
      )
      .subscribe(observer);
  }
}
