import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Character, RetornoApiResponse } from "../models/sanchez.types";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class SanchezApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://rickandmortyapi.com/api';

  getCharacters(pesq: { page? : number; name? : string } = {}): Observable<RetornoApiResponse> {
    let params = new HttpParams();
    if (pesq.page) params = params.set('page', String(pesq.page));
    if (pesq.name && pesq.name.trim()) params = params.set('name', pesq.name.trim());
    return this.http.get<RetornoApiResponse>(`${this.baseUrl}/character`, { params });
  }

  getCharactersById(id: number):Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/character/${id}`);
  }

  getCharactersFavorites(ids: number[]): Observable<Character[] | Character> {
    const path = ids.length === 1 ? `${ids[0]}` : `[${ids.join(',')}]`;
    return this.http.get<Character[] | Character>(`${this.baseUrl}/character/${path}`);
  }

}