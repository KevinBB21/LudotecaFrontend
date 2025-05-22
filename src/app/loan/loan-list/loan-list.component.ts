import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoanService } from '../loan.service';
import { Loan } from '../model/Loan';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';
import { GameService } from '../../game/game.service';
import { ClientService } from '../../client/client.service';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule, // Correct module for datepicker
    MatNativeDateModule, // Required for date functionality
    MatInputModule,      // For matInput in the datepicker
    MatFormFieldModule,  // For mat-form-field
    MatSelectModule,     // For mat-select
    MatTableModule,      // For mat-table
    MatPaginatorModule,],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss'
})
export class LoanListComponent implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game_id', 'client_id', 'fechainic', 'fechafin', 'action'];
  games: Game[] = [];
  clients: Client[] = [];
  filterGame: Game | null = new Game();
  filterClient: Client | null = new Client();
  filterDate: Date | undefined = undefined; // Cambiado a undefined

  constructor(private loanService: LoanService, public dialog: MatDialog, private gameService: GameService, private clientService: ClientService) { }
  @Input() loan: Loan = new Loan();

  ngOnInit(): void {
    this.loadPage();
    this.gameService.getGames().subscribe(
      games => { this.games = games }
    )

    this.clientService.getClient().subscribe(
      clients => { this.clients = clients }
    );

  }
  loadPage(event?: PageEvent) {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    const gameId = this.filterGame != null ? this.filterGame.id : undefined;
    const clientId = this.filterClient != null ? this.filterClient.id : undefined;

    const date = this.filterDate || undefined;

    this.loanService.getLoans(pageable, gameId, clientId, date).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }
  onCleanFilter(): void {
    this.filterGame = null;
    this.filterClient = null;
    this.filterDate = undefined;

    this.onSearch();
  }

  onSearch(): void {
    this.loadPage();

  }

  createLoan() {
    const dialogRef = this.dialog.open(LoanEditComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  deleteLoan(loan: Loan) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar Prestamo',
        description:
          'Atención usted va a borrar el prestamo.<br> ¿Desea eliminar el prestamo?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loanService.deleteLoan(loan.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }
}