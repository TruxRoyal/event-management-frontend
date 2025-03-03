import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventListComponent } from '../event-list/event-list.component';
import { EventDetailComponent } from '../event-details/event-details.component';
import { EventFormComponent } from '../event-form/event-form.component';
import { CalendarEvent } from '../../models/event';
import { EventService } from '../../services/event.service';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, EventListComponent, EventDetailComponent, EventFormComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendar: CalendarDay[] = [];
  weekdays: string[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  currentMonth: Date = new Date();
  selectedDate: Date | null = null;
  selectedEvent: CalendarEvent | null = null;
  showEventForm: boolean = false;
  newEventTitle: string = '';
  newEventDescription: string = '';
  newEventLocation: string = ''; 
  eventColors: string[] = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#673ab7', '#ff5722'];
  selectedColor: string = this.eventColors[0];
  events: CalendarEvent[] = [];
  eventsForSelectedDate: CalendarEvent[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.generateCalendar(); 
    this.loadEvents();
  }

  generateCalendar(): void {
    this.calendar = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.getTime() === today.getTime();

      const dayEvents = this.events?.length
      ? this.events.filter(event => {
      const eventDate = new Date(event.date_event + 'T00:00:00');
      return eventDate.getDate() === currentDate.getDate() &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
      })
      : []; 


      this.calendar.push({
        date: new Date(currentDate),
        isCurrentMonth,
        isToday,
        events: dayEvents
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  previousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  selectDate(day: CalendarDay): void {
    this.selectedDate = day.date;
    this.showEventForm = true;
    this.selectedEvent = null;
    this.eventsForSelectedDate = this.events.filter(event =>
      new Date(event.date_event).getDate() === day.date.getDate() &&
      new Date(event.date_event).getMonth() === day.date.getMonth() &&
      new Date(event.date_event).getFullYear() === day.date.getFullYear()
    );
  }

  selectEvent(event: CalendarEvent): void {
    this.selectedEvent = { ...event };
    this.newEventTitle = event.title_event;
    this.newEventDescription = event.description_event;
    this.newEventLocation = event.location_event;
    this.selectedColor = event.color || this.eventColors[0];
    this.selectedDate = new Date(event.date_event);
    this.showEventForm = true;
  }
  

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data || [];
        this.generateCalendar();
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
        this.events = [];
        this.generateCalendar();
      }
    );
  }
  

  addEvent(): void {
    if (this.selectedDate && this.newEventTitle.trim()) {
      const newEvent: CalendarEvent = {
        id_event: 0,
        title_event: this.newEventTitle,
        date_event: this.selectedDate.toISOString().split('T')[0],
        description_event: this.newEventDescription || '',
        location_event: this.newEventLocation || '',
        color: this.selectedColor
      };
  
      this.eventService.addEvent(newEvent).subscribe(() => {
        this.newEventTitle = '';
        this.newEventDescription = '';
        this.newEventLocation = '';
        this.selectedColor = this.eventColors[0];
        this.showEventForm = false;
        this.loadEvents(); 
      });
    }
  }
  
  editEvent(event: CalendarEvent): void {
    this.selectedEvent = { ...event };
    this.newEventTitle = event.title_event;
    this.newEventDescription = event.description_event;
    this.newEventLocation = event.location_event;
    this.selectedDate = new Date(event.date_event);
    this.selectedColor = event.color || this.eventColors[0];
    this.showEventForm = true; 
  }
  
  deleteEvent(event: CalendarEvent, $event: MouseEvent): void {
    $event.stopPropagation();
    this.events = this.events.filter(e => e.id_event !== event.id_event);
    this.generateCalendar();
  }

  formatMonth(date: Date): string {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  closeForm(): void {
    this.showEventForm = false;
    this.generateCalendar();
  }

  resetForm(): void {
    this.newEventTitle = '';
    this.newEventDescription = '';
    this.newEventLocation = '';
    this.selectedColor = this.eventColors[0];
    this.selectedEvent = null;
    this.showEventForm = false;
  }
  
}
