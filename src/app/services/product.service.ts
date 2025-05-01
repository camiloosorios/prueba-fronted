import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/products/category/men's%20clothing`
    );
  }

  getRecentProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/products/category/women's%20clothing?limit=4`
    );
  }

  getSaleProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/products/category/jewelery?limit=4`
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}
