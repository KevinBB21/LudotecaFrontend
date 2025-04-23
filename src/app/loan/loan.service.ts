import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Loan } from './model/Loan';
import { Pageable } from '../core/model/page/Pageable';
import { LoanPage } from './model/LoanPage';

@Injectable({
providedIn: 'root',
})
export class LoanService {
    constructor(
        private http: HttpClient
    ) {}

    private baseUrl = 'http://localhost:8080/loan';

     getLoans(pageable: Pageable): Observable<LoanPage> {
            return this.http.post<LoanPage>(this.baseUrl, { pageable: pageable });
        }
    
        saveLoan(loan: Loan): Observable<Loan> {
            const { id } = loan;
            const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
            return this.http.put<Loan>(url, loan);
        }
    
        deleteLoan(idLoan: number): Observable<void> {
            return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
        }
        getAllLoans(): Observable<Loan[]> {
            return this.http.get<Loan[]>(this.baseUrl);
        }
    }
