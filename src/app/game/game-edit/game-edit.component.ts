import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from '../game.service';
import { Game } from '../model/Game';
import { AuthorService } from '../../author/author.service';
import { Author } from '../../author/model/Author';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/model/Category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-game-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule ],
    templateUrl: './game-edit.component.html',
    styleUrl: './game-edit.component.scss',
})
export class GameEditComponent implements OnInit {
    game: Game = new Game();
    authors: Author[] = [];
    categories: Category[] = [];
    errorMessage: string | null = null; // Variable para almacenar el mensaje de error


    constructor(
        public dialogRef: MatDialogRef<GameEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private gameService: GameService,
        private categoryService: CategoryService,
        private authorService: AuthorService
    ) {}

    ngOnInit(): void {
        this.game = this.data.game ? Object.assign({}, this.data.game) : new Game();

        this.categoryService.getCategories().subscribe((categories) => {
            this.categories = categories;

            if (this.game.category != null) {
                const categoryFilter: Category[] = categories.filter(
                    (category) => category.id == this.data.game.category.id
                );
                if (categoryFilter != null) {
                    this.game.category = categoryFilter[0];
                }
            }
        });

        this.authorService.getAllAuthors().subscribe((authors) => {
            this.authors = authors;

            if (this.game.author != null) {
                const authorFilter: Author[] = authors.filter(
                    (author) => author.id == this.data.game.author.id
                );
                if (authorFilter != null) {
                    this.game.author = authorFilter[0];
                }
            }
        });
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
    this.errorMessage = null; 
    this.gameService.saveGame(this.game).subscribe({
        next: () => {
            this.dialogRef.close();
        },
        error: (error: HttpErrorResponse) => {
            if (error.status === 400) {
                
                if (typeof error.error === 'string') {
                    this.errorMessage = error.error; 
                } else if (error.error?.message) {
                    this.errorMessage = error.error.message; 
                } else {
                    this.errorMessage = 'Falta la eleccion de un autor o un cliente para el juego.';
                }
            } else if (error.status === 500) {
                this.errorMessage = 'Falta la eleccion de un autor o un cliente para el juego.'; 
                
            }
        }
    });
}

    onClose() {
        this.dialogRef.close();
    }
}