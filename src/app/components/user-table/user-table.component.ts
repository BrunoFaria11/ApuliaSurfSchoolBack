import { Component, Input } from '@angular/core';
import { Client } from '../../../core/models/clients/client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../core/services/client-service';
import { UpdateClientCommand } from '../../../core/models/clients/update-client-command';
import data from '../../../environments/phoneindicators.json';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent {
  @Input() clients!: Client[];
  @Input() isSearched!: boolean;
  @Input() notFound!: boolean;

  angFormUpdateClient!: FormGroup;
  showAlertSuccess = false;
  showAlertError = false;
  showErrorMsg = false;
  error = '';
  listPhoneIndicators: any = data;
  angFormUpdateClientSubmited = false;
  userSelected = '';

  updateClientCommand: UpdateClientCommand = {
    uuid: '',
    name: '',
    phoneNumber: '',
    experienceLevel: '',
    notes: '',
  }

  constructor(private clientService: ClientService, private fb: FormBuilder) {
    this.createClientForm();
  }

  createClientForm() {
    this.angFormUpdateClient = this.fb.group({
      name: ['', Validators.required],
      phoneIndicator: ['', Validators.required],
      level: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[- +()0-9]+$'), Validators.minLength(5)]],
      notes: [''],
    });
  }

  onClickSubmit() {
    this.angFormUpdateClientSubmited = true;

    if (this.angFormUpdateClient.invalid) return;

    const formValues = this.angFormUpdateClient.value;
    const { name, level, phoneIndicator, phone, notes } = formValues;
    this.updateClientCommand = {
      ...this.updateClientCommand,
      uuid: this.userSelected,
      name,
      phoneNumber: phoneIndicator + phone,
      experienceLevel: level,
      notes,
    };

    this.clientService.updateClient(this.updateClientCommand).subscribe({
      next: (response: any) => {
        this.angFormUpdateClientSubmited = false;
        this.showAlertSuccess = true;

        this.clients = this.clients.map(obj =>
          obj.Id === this.userSelected ? { ...obj, Notes: response.data.notes, Name: response.data.name, PhoneNumber: response.data.phoneNumber, Level: response.data.experienceLevel , LevelColor: response.data.experienceLevelColor } : obj
        );

        this.clearForm();
        setTimeout(() => this.showAlertSuccess = false, 3000);
      },
      error: (error: any) => {
        this.error = error.error.text || 'Erro ao editar cliente.';
        this.showAlertError = true;
        this.clearForm();
      }
    });
  }

  selectUser(clientId: string) {
    this.userSelected = clientId;
    let client = this.clients.find(x => x.Id == clientId);

    this.listPhoneIndicators.forEach((element: any) => {
      let i = client?.PhoneNumber.substring(0, element.dial_code.length) ?? '';
      if (i == element.dial_code) {
        this.angFormUpdateClient.controls['phoneIndicator'].setValue(element.dial_code);
        this.angFormUpdateClient.controls['phone'].setValue(client?.PhoneNumber.replace(i, ''));
      }
    });

    this.angFormUpdateClient.controls['name'].setValue(client?.Name);
    this.angFormUpdateClient.controls['level'].setValue(client?.Level);
    this.angFormUpdateClient.controls['notes'].setValue(client?.Notes);
  }

  clearForm() {
    this.angFormUpdateClient.reset();
    const modalCloseButton = document.getElementById("closeModal") as HTMLInputElement;
    if (modalCloseButton) modalCloseButton.click();
  }
}
