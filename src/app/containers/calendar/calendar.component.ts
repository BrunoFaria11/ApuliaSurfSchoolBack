import { Component } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { ReservationService } from '../../../core/services/reservation-service';
import { Reservation } from '../../../core/models/reservations/reservation';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  calendarView: CalendarView;
  showViews: Boolean;

  constructor(){
    this.calendarView = CalendarView.Month
    this.showViews = true;
  }
}
