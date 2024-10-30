import { Component } from '@angular/core';
import { Reservation } from '../../../core/models/reservations/reservation';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation-service';
import moment from 'moment';
import { GetReservationByClientCommand } from '../../../core/models/reservations/get-reservation-by-client-command';
import { UUIDReservationCommand } from '../../../core/models/reservations/mark-reservation-as-paid-command';
import { MarkReservationAsValidatedCommand } from '../../../core/models/reservations/mark-as-validated-command';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateReservationCommand } from '../../../core/models/reservations/create-reservation-command';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrl: './lessons-list.component.scss'
})
export class LessonsListComponent {
  clientId!: string;
  angForm!: FormGroup;
  angFormToValidate!: FormGroup;
  angFormToValidateSubmited = false;

  angFormSubmited = false;
  showAlertSuccess = false;
  showAlertError = false;
  error = '';
  reservations: Reservation[] = [];
  minDate: string = this.formatDate(new Date());
  searchParams: GetReservationByClientCommand = { uuid: '' };
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

  registerReservationCommand: CreateReservationCommand = {
    clientId: '',
    type: '',
    time: '',
    notes: '',
    date: new Date(),
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
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.createForms();
    this.generateTimes();
  }

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('clientId') ?? '';
    this.getReservations();
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
    this.angForm = this.fb.group({

      type: ['', Validators.required],
      classDate: ['', Validators.required],
      hour: ['', Validators.required],
      comments: ['']
    });

    this.angFormToValidate = this.fb.group({
      classDate: ['', Validators.required],
      hour: ['', Validators.required],
      comments: ['']
    });
  }

  getReservations() {
    this.reservations = [];
    this.searchParams.uuid = this.clientId;
    this.reservationService.getByClient(this.searchParams).subscribe((response: any) => {
      var clientRequest = response.data;
      clientRequest.forEach((item: any) => {
        let isCompleted = new Date() >= new Date(item.date);
        let reservation = new Reservation(item.uuid, item.clientId, (moment(item.date)).format('DD-MM-YYYY'), item.type, item.time, item.notes, item.isValidated, isCompleted, item.packId, item.isPaid, item.client.name, item.client.phoneNumber, item.isCanceled);
        this.reservations.push(reservation);
      });
    })
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

  submitReservation() {
    this.angFormSubmited = true;
    if (this.angForm.valid) {
      this.angFormSubmited = false;

      const formValues = this.angForm.value;
      const { type, hour, comments, classDate } = formValues;
      this.registerReservationCommand = {
        ...this.registerReservationCommand,
        clientId: this.clientId,
        type,
        time: hour,
        notes: comments,
        date: classDate
      };

      this.reservationService.registerReservation(this.registerReservationCommand).subscribe({
        next: () => {
          this.resetForm(this.angForm);
          this.getReservations();
          this.showAlert(true, 'Aula registada com sucesso.');
        },
        error: () => this.showAlert(false, 'Erro ao registada aula. Tente novamente mais tarde.')
      });
    }
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
    const modalCloseButton = document.querySelector(`#closeModal${form === this.angForm ? '' : 'Validate'}`);
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
}
