import { Component } from '@angular/core';
import { EventFormComponent } from "./components/event-form/event-form.component.spec";

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header>
        <h1>Event Management Calendar</h1>
      </header>
      <main>
        <app-event-form></app-event-form>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    header {
      margin-bottom: 20px;
      text-align: center;
    }
    
    h1 {
      color: #673ab7;
    }
  `],
  imports: [EventFormComponent]
})
export class AppComponent {
  title = 'event-calendar';
}