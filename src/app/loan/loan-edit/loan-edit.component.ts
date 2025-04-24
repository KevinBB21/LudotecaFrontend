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


@Component({
  selector: 'app-loan-edit',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './loan-edit.component.html',
  styleUrl: './loan-edit.component.scss'
})
export class LoanEditComponent implements OnInit {
  loan: Loan = new Loan();
  client: Client[] = [];
  game: Game[] = [];

  constructor(
      public dialogRef: MatDialogRef<LoanEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private loanService: LoanService,
      private clientService: ClientService,
      private gameService: GameService
  ) {}

  ngOnInit(): void {
      this.loan = this.data.loan ? Object.assign({}, this.data.loan) : new Game();
      this.loan = this.data.loan ? Object.assign({}, this.data.loan) : new Client();

      this.clientService.getAllClients().subscribe((clients) => {
          this.client = clients;

          if (this.loan.client != null) {
              const clientFilter: Client[] = clients.filter(
                  (client) => client.id == this.data.loan.client.id
              );
              if (clientFilter != null) {
                  this.loan.client = clientFilter[0];
              }
          }
      });

      this.gameService.getAllGames().subscribe((games) => {
          this.game = games;

          if (this.game != null) {
              const gameFilter: Game[] = games.filter(
                  (game) => game.title == this.data.loan.game.title
              );
              if (gameFilter != null) {
                  this.loan.game = gameFilter[0];
              }
          }
      });
  }

  onSave() {
      this.loanService.saveLoan(this.loan).subscribe((result) => {
          this.dialogRef.close();
      });
  }

  onClose() {
      this.dialogRef.close();
  }
}