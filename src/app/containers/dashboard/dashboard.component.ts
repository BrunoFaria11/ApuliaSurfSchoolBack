import { Component } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { Reservation } from '../../../core/models/reservations/reservation';
import { ReservationService } from '../../../core/services/reservation-service';
import moment from 'moment';
import { UUIDReservationCommand } from '../../../core/models/reservations/mark-reservation-as-paid-command';
import { MarkReservationAsValidatedCommand } from '../../../core/models/reservations/mark-as-validated-command';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  calendarView!: CalendarView;
  showViews!: boolean;
  reservations: Reservation[] = [];
  dashboard: any = {};

  clientId!: string;
  angFormToValidate!: FormGroup;
  angFormToValidateSubmited = false;

  angFormSubmited = false;
  showAlertSuccess = false;
  showAlertError = false;
  error = '';
  minDate: string = this.formatDate(new Date());
  alert: { success: boolean; message: string } = { success: false, message: '' };

  markAsPaidCommand: UUIDReservationCommand = {
    uuid: ''
  };
  cancelCommand: UUIDReservationCommand = {
    uuid: ''
  };
  markAsValidatedCommand: MarkReservationAsValidatedCommand = {
    uuid: '',
    time: '',
    date: '',
    notes: ''
  };

  reservationsType = [
    'Aula Surf (20€)',
    'Aula Bodyboard (20€)',
    '1 Pessoa (40€)',
    '2 Pessoas (70€)',
    '3 Pessoas (100€)',
    'Surf (15€)',
    'Bodyboard (15€)',
    'Fato (10€)'
  ]

  times: string[] = [];

  reservationSelected = "";
  reservationDateSelected = "";

  constructor(
    private reservationService: ReservationService,
    private fb: FormBuilder
  ) {
    this.calendarView = CalendarView.Day
    this.showViews = false;
  }

  ngOnInit() {

    this.createForms();
    this.getReservations();
    this.generateTimes();
    this.getDashboard();
  }

  generateTimes(): void {
    for (let hour = 8; hour <= 20; hour++) {
      const formattedTime = this.formatTime(hour);
      this.times.push(formattedTime);
    }
  }

  formatTime(hour: number): string {
    const hourString = hour < 10 ? '0' + hour : hour.toString();
    return `${hourString}:00`;
  }

  createForms() {
    this.angFormToValidate = this.fb.group({
      classDate: ['', Validators.required],
      hour: ['', Validators.required],
      comments: ['']
    });
  }

  getDashboard() {
    this.dashboard = {};
    this.reservationService.getDashboard().subscribe((response: any) => {
      this.dashboard = response.data;
      this.dashboard.lastYear = new Date().getFullYear() - 1;
      this.dashboard.thisYear = new Date().getFullYear();
      this.dashboard.lastMonth = this.getMonthName(new Date().getMonth() - 1, 'pt-PT');
      this.dashboard.thisMonth = this.getMonthName(new Date().getMonth(), 'pt-PT');
    })
  }

  getMonthName(monthNumber: number, locale: string = 'en-US'): string {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString(locale, { month: 'long' });
  }

  getReservations() {
    this.reservations = [];
    this.reservationService.getAllPending().subscribe((response: any) => {
      var reservationRequest = response.data;
      reservationRequest.forEach((item: any) => {
        let reservation = new Reservation(item.uuid, item.clientId, (moment(item.date)).format('DD-MM-YYYY'), item.type, item.time, item.notes, item.isValidated, new Date((moment(item.date)).format('DD-MM-YYYY')) <= new Date((moment(new Date())).format('DD-MM-YYYY')), item.packId, item.isPaid, item.client.name, item.client.phoneNumber,  item.isCanceled);
        this.reservations.push(reservation);
      });
    })
  }

  markAsPaid(reservationId: string) {
    this.markAsPaidCommand.uuid = reservationId;
    this.reservationService.markAsPaid(this.markAsPaidCommand).subscribe({
      next: () => {
        this.getReservations();
        this.showAlert(true, 'Reserva marcada como paga com sucesso.');
      },
      error: () => this.showAlert(false, 'Erro ao marcar Reserva como pago. Tente novamente mais tarde.')
    });
  }

  markAsValidated() {
    this.angFormToValidateSubmited = true;
    if (this.angFormToValidate.valid) {
      this.angFormToValidateSubmited = false;

      const formValues = this.angFormToValidate.value;
      const { hour, comments, classDate } = formValues;
      this.markAsValidatedCommand = {
        ...this.markAsValidatedCommand,
        uuid: this.reservationSelected,
        time: hour,
        notes: comments,
        date: classDate
      };

      this.reservationService.markAsValidated(this.markAsValidatedCommand).subscribe({
        next: () => {
          this.resetForm(this.angFormToValidate);
          this.getReservations();
          this.showAlert(true, 'Reserva confirmada com sucesso.');
        },
        error: () => this.showAlert(false, 'Erro ao confirmar reserva. Tente novamente mais tarde.')
      });

    }
  }

  formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  resetForm(form: FormGroup) {
    form.reset();
    const modalCloseButton = document.querySelector(`#closeModalValidate`);
    if (modalCloseButton) (modalCloseButton as HTMLButtonElement).click();
  }

  showAlert(success: boolean, message: string) {
    if (success) {
      this.showAlertSuccess = true
    } else {
      this.showAlertError = true
    }
    this.alert = { success, message };
  }

  selectReservation(reservationId: string) {
    this.reservationSelected = reservationId;
    let reservation = this.reservations.find(x => x.idReservation == reservationId);
    var date = reservation?.date ?? '';
    debugger
    let parts = date.split('-');

    let day = +parts[0];
    let month = +parts[1] - 1;
    let year = +parts[2];

    this.angFormToValidate.controls['hour'].setValue(reservation?.hour != 'morning' && reservation?.hour != 'afternoon' ? reservation?.hour : '');
    this.angFormToValidate.controls['classDate'].setValue(new Date(year, month, day).toISOString().substring(0, 10));
  }

  cancel(reservationId: string) {
    this.cancelCommand.uuid = reservationId;
    this.reservationService.Cancel(this.cancelCommand).subscribe({
      next: () => {
        this.getReservations();
        this.showAlert(true, 'Reserva cancelada com sucesso.');
      },
      error: () => this.showAlert(false, 'Erro ao cancelar Reserva. Tente novamente mais tarde.')
    });
  }
}
