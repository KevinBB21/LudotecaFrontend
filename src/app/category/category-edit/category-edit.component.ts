import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../category.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../model/Category';

@Component({
    selector: 'app-category-edit',
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
    templateUrl: './category-edit.component.html',
    styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit {
    category: Category = new Category();

    constructor(
        public dialogRef: MatDialogRef<CategoryEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {category : Category},
        private categoryService: CategoryService
    ) {}

    ngOnInit(): void {
      this.category = this.data.category ? Object.assign({}, this.data.category) : new Category();
    }

    preventSpaces(event: KeyboardEvent): void {
        const inputElement = event.target as HTMLInputElement;
    
        // Evitar espacios al principio
        if (event.key === ' ' && (!inputElement.value || inputElement.selectionStart === 0)) {
            event.preventDefault();
        }
    
        // Evitar múltiples espacios consecutivos
        if (event.key === ' ' && inputElement.selectionStart !== null) {
            const currentValue = inputElement.value;
            const cursorPosition = inputElement.selectionStart;
    
            if (currentValue[cursorPosition - 1] === ' ') {
                event.preventDefault();
            }
        }
    }

    onSave() {
        this.categoryService.saveCategory(this.category).subscribe(() => {
            this.dialogRef.close();
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}