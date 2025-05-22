import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorService } from '../author.service';
import { Author } from '../model/Author';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-author-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './author-edit.component.html',
    styleUrl: './author-edit.component.scss',
})
export class AuthorEditComponent implements OnInit {
    author: Author = new Author();
    errorMessage: string | null = null;

    constructor(
        public dialogRef: MatDialogRef<AuthorEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private authorService: AuthorService
    ) { }

    ngOnInit(): void {
        this.author = this.data.author ? Object.assign({}, this.data.author) : new Author();
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
        this.errorMessage = null; // Reinicia el mensaje de error antes de guardar
        this.authorService.saveAuthor(this.author).subscribe({
            next: () => {
                this.dialogRef.close();
            },
            error: (error) => {
                if (error.error?.message) {
                    this.errorMessage = error.error.message;
                } else if (typeof error.error === 'string') {
                    this.errorMessage = error.error;
                } else {
                    this.errorMessage = 'No se pudo guardar el autor. Inténtalo de nuevo.';
                }
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}