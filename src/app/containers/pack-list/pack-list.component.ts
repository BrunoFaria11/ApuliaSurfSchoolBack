import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../core/services/client-service';
import { Pack } from '../../../core/models/pack/pack';
import { Reservation } from '../../../core/models/reservations/reservation';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacksService } from '../../../core/services/pack-service';
import { GetPacksByClientCommand } from '../../../core/models/pack/get-packs-by-client-command';
import { RegisterReservationCommand } from '../../../core/models/pack/register-reservation-command';
import { CreatePackCommand } from '../../../core/models/pack/create-pack-command';
import { MarkAsPaidCommand } from '../../../core/models/pack/mark-as-paid-command';

@Component({
  selector: 'app-pack-list',
  templateUrl: './pack-list.component.html',
  styleUrls: ['./pack-list.component.scss']  // Corrigido 'styleUrl' para 'styleUrls'
})
export class PackListComponent implements OnInit {

  angForm!: FormGroup;
  angFormToCreatePack!: FormGroup;
  clientId!: string;
  time = 'morning';
  packs: Pack[] = [];
  minDate: string = this.formatDate(new Date());
  selectedPack: { id: string; type: string } = { id: '', type: '' };
  searchParams: GetPacksByClientCommand = { uuid: '' };
  showAlertSuccess = false;
  showAlertError = false;
  error = '';
  registerReservationCommand: RegisterReservationCommand = {
    packId: '',
    type: '',
    time: '',
    notes: '',
    date: new Date(),
  };
  createPackCommand: CreatePackCommand = {
    type: '',
    clientId: '',
    totalAvailableClasses: 0,
    time: '',
    notes: '',
    date: new Date(),
  };
  markAsPaidCommand: MarkAsPaidCommand = {
    uuid: ''
  };
  angFormToCreatePackSubmited = false;
  angFormSubmited = false;
  alert: { success: boolean; message: string } = { success: false, message: '' };

  packsType = [
    { type: 'Pack 3 aulas Surf (55€)', max: 3 },
    { type: 'Pack 3 aulas Bodyboard (55€)', max: 3 },
    { type: 'Pack 5 aulas Surf (75€)', max: 5 },
    { type: 'Pack 5 aulas Bodyboard (75€)', max: 5 },
    { type: 'Pack 10 aulas Surf (110€)', max: 10 },
    { type: 'Pack 10 aulas Bodyboard (110€)', max: 10 },
  ];

  times: string[] = [];

  constructor(
    private packService: PacksService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.createForms();
  }

  createForms() {
    this.angForm = this.fb.group({
      classDate: ['', Validators.required],
      hour: ['', Validators.required],
      comments: ['']
    });

    this.angFormToCreatePack = this.fb.group({
      type: ['', Validators.required],
      classDate: ['', Validators.required],
      hour: ['', Validators.required],
      comments: ['']
    });
  }

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('clientId') ?? '';
    this.getPacks();
    this.generateTimes();
  }

  getPacks() {
    this.searchParams.uuid = this.clientId;
    this.packService.getPacksByClient(this.searchParams).subscribe({
      next: (response: any) => {
        this.packs = response.data.map((item: any) => {
          const reservations: Reservation[] = item.reservations?.map((res: any) =>
            new Reservation(item.uuid, item.clientId, moment(res.date).format('DD-MM-YYYY'), res.type, res.time, res.notes, res.isValidated, res.date < new Date(), item.id, item.isPaid, item.client.name, item.client.phoneNumber, item.isCanceled)
          ) || [];
          return new Pack(item.uuid, item.classesAttended, item.totalAvailableClasses, item.type, item.isActive, reservations, moment(item.creationDate).format('DD-MM-YYYY'), item.isPaid);
        });
      },
      error: () => this.showAlert(false, 'Erro ao buscar packs. Tente novamente mais tarde.')
    });
  }

  submitReservation() {
    this.angFormSubmited = true;
    if (this.angForm.valid) {
      this.angFormSubmited = false;

      const formValues = this.angForm.value;
      const { hour, comments, classDate } = formValues;
      this.registerReservationCommand = {
        ...this.registerReservationCommand,
        packId: this.selectedPack.id,
        type: this.selectedPack.type,
        time: hour,
        notes: comments,
        date: classDate
      };

      this.packService.registerReservation(this.registerReservationCommand).subscribe({
        next: () => {
          this.resetForm(this.angForm);
          this.getPacks();
          this.showAlert(true, 'Aula registada com sucesso.');
        },
        error: () => this.showAlert(false, 'Erro ao registar aula. Tente novamente mais tarde.')
      });
    }
  }

  submitPack() {
    this.angFormToCreatePackSubmited = true;

    if (this.angFormToCreatePack.valid) {
      this.angFormToCreatePackSubmited = false;

      const formValues = this.angFormToCreatePack.value;
      const { type, hour, comments, classDate } = formValues;

      this.createPackCommand = {
        ...this.createPackCommand,
        clientId: this.clientId,
        type,
        time: hour,
        notes: comments,
        date: classDate,
        totalAvailableClasses: this.packsType.find(x => x.type == type)?.max ?? 0
      };

      this.packService.createPack(this.createPackCommand).subscribe({
        next: () => {
          this.resetForm(this.angFormToCreatePack);
          this.getPacks();
          this.showAlert(true, 'Pack criado com sucesso.');
        },
        error: () => this.showAlert(false, 'Erro ao criar pack. Tente novamente mais tarde.')
      });
    }
  }

  selectPack(packId: string, type: string) {
    this.selectedPack = { id: packId, type };
  }


  formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  changeTime(e: any) {
    this.time = e.target.value;
  }

  markAsPaid(packId: string) {
    this.markAsPaidCommand.uuid = packId;
    this.packService.markAsPaid(this.markAsPaidCommand).subscribe({
      next: () => {
        this.resetForm(this.angFormToCreatePack);
        this.getPacks();
        this.showAlert(true, 'Pack marcado como pago com sucesso.');
      },
      error: () => this.showAlert(false, 'Erro ao marcar pack como pago. Tente novamente mais tarde.')
    });
  }

  resetForm(form: FormGroup) {
    form.reset();
    const modalCloseButton = document.querySelector(`#closeModal${form === this.angForm ? '' : 'Pack'}`);
    if (modalCloseButton) (modalCloseButton as HTMLButtonElement).click();
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

  showAlert(success: boolean, message: string) {
    if (success) {
      this.showAlertSuccess = true
    } else {
      this.showAlertError = true
    }
    this.alert = { success, message };
  }
}
