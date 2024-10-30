import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ClientService } from '../../../core/services/client-service';
import { Client } from '../../../core/models/clients/client';
import { CreateClient } from '../../../core/models/clients/create-client';
import { SearchClients } from '../../../core/models/clients/search-clients';
import data from '../../../environments/phoneindicators.json';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  angForm!: FormGroup;
  angFormCreateClient!: FormGroup;
  clients: Client[] = [];
  isSearched = false;
  notFound = false;
  showAlertSuccess = false;
  showAlertError = false;
  showErrorMsg = false;
  error = '';
  listPhoneIndicators: any = data;
  isLoadingSearch = false;
  isLoadingCreate = false;
  searchParams: SearchClients = {
    name: '',
    email: '',
    phone: ''
  };
  angFormCreateClientSubmited = false;

  constructor(private clientService: ClientService, private fb: FormBuilder) {
    this.createSearchForm();
    this.createClientForm();
  }

  createSearchForm() {
    this.angForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email, this.customSearchValidator()]],
      phone: ['', [Validators.pattern('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'), Validators.minLength(5), this.customSearchValidator()]]
    });
  }

  createClientForm() {
    this.angFormCreateClient = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneIndicator: ['+351', Validators.required],
      level: ['Iniciante', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[- +()0-9]+$'), Validators.minLength(5)]],
      notes: [''],
    });
  }

  onClickSearch() {
    if (!this.angForm.value.email && !this.angForm.value.name && !this.angForm.value.phone) {
      this.showErrorMsg = true;
      return;
    }

    this.isLoadingSearch = true;
    this.isSearched = false;
    this.clients = [];
    this.showErrorMsg = false;

    const model = this.angForm.value;

    this.searchParams.email = model.email ?? "";
    this.searchParams.name = model.name ?? "";
    this.searchParams.phone = model.phone ?? "";

    this.clientService.searchClients(this.searchParams).subscribe({
      next: (response: any) => {
        const clients = response.data;
        this.isSearched = true;
        if (clients && clients.length > 0) {
          this.clients = clients.map((clientR: any) => new Client(
            clientR.uuid, clientR.name, clientR.email, clientR.phoneNumber,
            clientR.activePacks, clientR.newLessons, clientR.totalPacks,
            clientR.totalLessons, clientR.experienceLevel, clientR.experienceLevelColor, clientR.notes
          ));
          this.notFound = false;
        } else {
          this.notFound = true;
        }
        this.isLoadingSearch = false;
      },
      error: () => {
        this.error = 'Erro ao buscar clientes. Tente novamente mais tarde.';
        this.isLoadingSearch = false;
      }
    });
  }

  onClickSubmit() {
    this.angFormCreateClientSubmited = true;

    if (this.angFormCreateClient.invalid) return;
    this.isLoadingCreate = true;
    const model = this.angFormCreateClient.value;
    let client = new CreateClient(model.name, model.email, model.phoneIndicator + model.phone, model.level,model.notes);

    this.clientService.createClient(client).subscribe({
      next: () => {
        this.angFormCreateClientSubmited = false;
        this.showAlertSuccess = true;
        this.clearForm();
        setTimeout(() => this.showAlertSuccess = false, 3000);
        this.isLoadingCreate = false;
      },
      error: (error: any) => {
        this.error = error.error.text || 'Erro ao adicionar cliente.';
        this.showAlertError = true;
        this.clearForm();
        this.isLoadingCreate = false;
      }
    });
  }

  clearForm() {
    this.angFormCreateClient.reset();
    const modalCloseButton = document.getElementById("closeModal") as HTMLInputElement;
    if (modalCloseButton) modalCloseButton.click();
  }

  private customSearchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const model = this.angForm?.value;
      return model && !model.email && !model.phone && !model.name ? { invalidSearch: 'Preencha pelo menos um campo para buscar' } : null;
    };
  }

  private hasSearchParams(): boolean {
    const model = this.angForm.value;
    return !!model.name || !!model.email || !!model.phone;
  }
}
