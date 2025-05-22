import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client.service';
import { Client } from '../model/Client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-edit',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  standalone: true,
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent {
  client: Client = new Client();
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ClientEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client },
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.client = this.data.client ? Object.assign({}, this.data.client) : new Client();
  }

  onSave() {
    this.errorMessage = null;
    this.clientService.saveClient(this.client).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar el cliente';
      }
    });
  }
  preventSpaces(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === ' ' && (!inputElement.value || inputElement.selectionStart === 0)) {
      event.preventDefault();
    }

    if (event.key === ' ' && inputElement.selectionStart !== null) {
      const currentValue = inputElement.value;
      const cursorPosition = inputElement.selectionStart;

      if (currentValue[cursorPosition - 1] === ' ') {
        event.preventDefault();
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}
