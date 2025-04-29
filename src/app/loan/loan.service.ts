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

    getLoans(pageable: Pageable, gameId?: number, clientId?: number, date?: Date): Observable<LoanPage> {
        let url = this.baseUrl;
        const params = [];
        if (gameId) params.push(`gameId=${gameId}`);
        if (clientId) params.push(`clientId=${clientId}`);
        if (date) {
            // Formatea la fecha a 'yyyy-MM-dd' antes de agregarla como parámetro
            const formattedDate = this.TypeDate(date);
            params.push(`date=${formattedDate}`);
        }
        if (params.length) url += '?' + params.join('&');
        return this.http.post<LoanPage>(url, { pageable: pageable });
    }

        TypeDate(date: Date) : string { 
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return date.toLocaleDateString('en-CA', options);
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
