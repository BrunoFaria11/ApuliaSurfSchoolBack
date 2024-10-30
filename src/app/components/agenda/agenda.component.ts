import { Component, Input } from '@angular/core';
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
import { environment } from '../../../environments/environment';

const colors: Record<string, EventColor> = {
  "Iniciante": {
    primary: '#A8E6CF',
    secondary: '#A8E6CF',
  },
  "Nível A": {
    primary: '#AEDFF7',
    secondary: '#AEDFF7',
  },
  "Nível A+": {
    primary: '#7FBFFF',
    secondary: '#7FBFFF',
  },
  "Nível 2": {
    primary: '#FDD835',
    secondary: '#FDD835',
  },
  "Expert": {
    primary: '#E57373',
    secondary: '#E57373',
  },
};
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
})
export class AgendaComponent {
  @Input() calendarView!: CalendarView;
  @Input() showViews!: any;

  myScriptElement: HTMLScriptElement | undefined;
  array: any = [];
  item: any;
  activeId!: number;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen = false;

  reservations: Reservation[] = [];

  constructor(
    private reservationService: ReservationService,
  ) {
  }

  ngOnInit(): void {

    this.view =  this.calendarView;
    
    this.reservationService.getAll().subscribe(
      (response: any) => {
        const reservations = response.data;
        reservations.forEach((element: any) => {

          const model = element;
          this.array.push(model);

          const startDate = new Date(model.date);
          const endDate = new Date(model.date)

          startDate.setHours(this.convertTimeToDecimal(model.time));
          endDate.setHours(this.convertTimeToDecimal(model.time) + 2);

          var client = element.client;

          const item = {
            id: model.uuid,
            start: startDate,
            end: endDate,
            title:
              model.type +
              ' - ' + client.name +
              ' - ' + client.email +
              ' - ' + client.phoneNumber +
              ' - ' + model.time +
              ' - ' + (model.isPaid ? "PAGO" : "POR PAGAR"),
            color: { ...colors[client.experienceLevel] },
            allDay: false,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: false,
          };
          this.events.push(item);

          const date = new Date();
          this.dayClicked({ date: date, events: this.events });
          this.dayClicked({ date: date, events: this.events });
        });
      },
      err => {
        const error = (() => { try { return JSON.parse(err._body) } catch (something) { return err } })()
        console.log(error);
      });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }

  open(content: any, e: any) {
    this.item = this.array.filter((x:any) => x.uuid == e.id)[0];
     window.open(environment.appUrl + "/reservation/"+ this.item.client.uuid, '_blank');
  }

  convertTimeToDecimal(time: string): number {
    const [hours, minutes] = time.split(':').map(Number); // Converte 'hh' e 'mm' em números
    return hours + minutes / 60; // Soma as horas com os minutos em formato decimal
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
