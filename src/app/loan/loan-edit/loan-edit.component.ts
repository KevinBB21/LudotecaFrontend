import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanService } from '../loan.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Client } from '../../client/model/Client';
import { Loan } from '../model/Loan';
import { Game } from '../../game/model/Game';
import { ClientService } from '../../client/client.service';
import { GameService } from '../../game/game.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
    selector: 'app-loan-edit',
    standalone: true,
    imports: [MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule],
    templateUrl: './loan-edit.component.html',
    styleUrl: './loan-edit.component.scss'
})
export class LoanEditComponent implements OnInit {
    loan: Loan = new Loan();
    client: Client[] = [];
    game: Game[] = [];
    errorMessage: string | null = null;


    constructor(
        public dialogRef: MatDialogRef<LoanEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loanService: LoanService,
        private clientService: ClientService,
        private gameService: GameService
    ) { }

    ngOnInit(): void {
        if (this.data.loan) {
            this.loan = Object.assign({}, this.data.loan);
        } else {
            this.loan = {
                id: undefined,
                client: undefined,
                game: undefined,
                fechainic: undefined,
                fechafin: undefined
            } as unknown as Loan;
        }

        this.clientService.getAllClients().subscribe((clients) => {
            this.client = clients;

            if (this.loan.client != null) {
                const clientFilter: Client[] = clients.filter(
                    (client) => client.id == this.loan.client.id
                );
                if (clientFilter.length > 0) {
                    this.loan.client = clientFilter[0];
                }
            }
        });

        this.gameService.getAllGames().subscribe((games) => {
            this.game = games;

            if (this.loan.game != null) {
                const gameFilter: Game[] = games.filter(
                    (game) => game.id == this.loan.game.id
                );
                if (gameFilter.length > 0) {
                    this.loan.game = gameFilter[0];
                }
            }
        });
    }

    onSave() {
        this.errorMessage = null; // Reinicia el mensaje de error
        this.loanService.saveLoan(this.loan).subscribe({
            next: () => {
                this.dialogRef.close();
            },
            error: (error) => {
                if (error.error?.message) {
                    this.errorMessage = error.error.message;
                } else if (typeof error.error === 'string') {
                    this.errorMessage = error.error;
                } else {
                    this.errorMessage = 'No se pudo realizar la reserva. Inténtalo de nuevo.';
                }
            }
        });
    }


    onClose() {
        this.dialogRef.close();
    }
}