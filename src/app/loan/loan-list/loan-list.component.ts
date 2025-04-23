import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoanService } from '../loan.service';
import { Loan } from '../model/Loan';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';


@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule,MatPaginator],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss'
})
export class LoanListComponent implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game_id', 'client_id', 'fechainic', 'fechafin', 'action'];

  constructor(private loanService: LoanService, public dialog: MatDialog) {}

  ngOnInit(): void {
      this.loadPage();
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

      this.loanService.getLoans(pageable).subscribe((data) => {
          this.dataSource.data = data.content;
          this.pageNumber = data.pageable.pageNumber;
          this.pageSize = data.pageable.pageSize;
          this.totalElements = data.totalElements;
      });
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
              title: 'Eliminar autor',
              description:
                  'Atención si borra el autor se perderán sus datos.<br> ¿Desea eliminar el autor?',
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
