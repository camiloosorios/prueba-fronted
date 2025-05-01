import { Injectable, signal } from '@angular/core';
import { CartItem, Product } from '../interfaces/product.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items = signal<CartItem[]>([]);

  get cart() {
    return this.items;
  }

  addToCart(product: Product): void {
    const current = this.items();
    const index = current.findIndex((item) => item.product.id === product.id);

    if (index !== -1) {
      const existingItem = current[index];
      if (existingItem.quantity < 10) {
        const updated = [...current];
        updated[index] = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        this.items.set(updated);
      }
    } else {
      this.items.set([...current, { product, quantity: 1 }]);
    }
  }

  decreaseQuantity(productId: number): void {
    const current = this.items();
    const index = current.findIndex((item) => item.product.id === productId);

    if (index !== -1 && current[index].quantity > 1) {
      const updated = [...current];
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity - 1,
      };
      this.items.set(updated);
    }
  }

  removeFromCart(productId: number): void {
    const updated = this.items().filter(
      (item) => item.product.id !== productId
    );
    this.items.set(updated);
  }

  clearCart(): void {
    this.items.set([]);
  }

  getTotalItems(): number {
    return this.items().reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items().reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );
  }

  getShippingPrice(): number {
    return this.getTotalPrice() >= 50 ? 0 : 10;
  }
}
