import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interfaces';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favorites = signal<Product[]>([]);
  private readonly cartService = inject(CartService);

  get favoriteProducts() {
    return this.favorites;
  }

  add(product: Product): void {
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

  moveToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.remove(product.id);
  }
}
