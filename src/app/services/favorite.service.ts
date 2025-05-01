import { Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interfaces';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favorites = signal<Product[]>([]);

  get favoriteProducts() {
    return this.favorites;
  }

  add(product: Product): void {
    console.log(product);
    const current = this.favorites();
    const exists = current.some((p) => p.id === product.id);

    if (!exists) {
      this.favorites.set([...current, product]);
    }
  }

  remove(productId: number): void {
    const updated = this.favorites().filter((p) => p.id !== productId);
    this.favorites.set(updated);
  }

  clear(): void {
    this.favorites.set([]);
  }

  isFavorite(productId: number): boolean {
    return this.favorites().some((p) => p.id === productId);
  }

  getTotal(): number {
    return this.favorites().length;
  }
}
