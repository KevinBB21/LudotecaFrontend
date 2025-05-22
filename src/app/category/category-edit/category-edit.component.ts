import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../category.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../model/Category';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-category-edit',
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './category-edit.component.html',
    styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit {
    category: Category = new Category();
    errorMessage: string | null = null; // Variable para almacenar el mensaje de error

    constructor(
        public dialogRef: MatDialogRef<CategoryEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { category: Category },
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.category = this.data.category ? Object.assign({}, this.data.category) : new Category();
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

    onSave() {
        this.errorMessage = null; 

        if (!this.category.name || this.category.name.trim().length === 0) {
            this.errorMessage = 'El nombre no puede estar vacío ni contener solo espacios.';
            return;
        }

        this.categoryService.saveCategory(this.category).subscribe({
            next: () => {
                this.dialogRef.close();
            },
            error: (error: HttpErrorResponse) => {
                if (error.status === 400) {
                    this.errorMessage = error.error;
                } else if (error.status === 500) {
                    this.errorMessage = 'Error interno del servidor. Por favor, inténtelo más tarde.';
                } else {
                    this.errorMessage = 'Ha ocurrido un error inesperado.';
                }
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}