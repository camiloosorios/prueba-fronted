import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { CartItem, Product } from '../interfaces/product.interfaces';

describe('CartService', () => {
  let service: CartService;
  const mockProduct1: Product = {
    id: 1,
    title: 'Product 1',
    price: 100,
    description: 'Description 1',
    category: 'category1',
    image: 'image1.jpg',
  };
  const mockProduct2: Product = {
    id: 2,
    title: 'Product 2',
    price: 200,
    description: 'Description 2',
    category: 'category2',
    image: 'image2.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    service.clearCart();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToCart', () => {
    it('should add new product to cart', () => {
      service.addToCart(mockProduct1);
      expect(service.cart().length).toBe(1);
      expect(service.cart()[0].product).toEqual(mockProduct1);
      expect(service.cart()[0].quantity).toBe(1);
    });

    it('should increment quantity when adding existing product', () => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct1);
      expect(service.cart().length).toBe(1);
      expect(service.cart()[0].quantity).toBe(2);
    });

    it('should not exceed maximum quantity (10)', () => {
      for (let i = 0; i < 15; i++) {
        service.addToCart(mockProduct1);
      }
      expect(service.cart()[0].quantity).toBe(10);
    });

    it('should handle multiple different products', () => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);
      expect(service.cart().length).toBe(2);
    });
  });

  describe('decreaseQuantity', () => {
    beforeEach(() => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct1);
    });

    it('should decrease quantity of existing product', () => {
      service.decreaseQuantity(mockProduct1.id);
      expect(service.cart()[0].quantity).toBe(1);
    });

    it('should not decrease below 1', () => {
      service.decreaseQuantity(mockProduct1.id);
      service.decreaseQuantity(mockProduct1.id);
      expect(service.cart()[0].quantity).toBe(1);
    });

    it('should do nothing for non-existent product', () => {
      const initialCart = service.cart();
      service.decreaseQuantity(999);
      expect(service.cart()).toEqual(initialCart);
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);
    });

    it('should remove specified product', () => {
      service.removeFromCart(mockProduct1.id);
      expect(service.cart().length).toBe(1);
      expect(service.cart()[0].product.id).toBe(mockProduct2.id);
    });

    it('should do nothing if product not in cart', () => {
      const initialCart = service.cart();
      service.removeFromCart(999);
      expect(service.cart()).toEqual(initialCart);
    });
  });

  describe('clearCart', () => {
    it('should empty the cart', () => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);
      service.clearCart();
      expect(service.cart().length).toBe(0);
    });
  });

  describe('calculations', () => {
    beforeEach(() => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);
    });

    it('should calculate total items correctly', () => {
      expect(service.getTotalItems()).toBe(3);
    });

    it('should calculate total price correctly', () => {
      expect(service.getTotalPrice()).toBe(400);
    });

    describe('getShippingPrice', () => {
      it('should return free shipping for orders >= $50', () => {
        expect(service.getShippingPrice()).toBe(0);
      });

      it('should return $10 shipping for orders < $50', () => {
        service.clearCart();
        service.addToCart({ ...mockProduct1, price: 49 });
        expect(service.getShippingPrice()).toBe(10);
      });
    });
  });

  describe('cart signal', () => {
    it('should be reactive to changes', () => {
      const cartValues: CartItem[][] = [];

      cartValues.push([...service.cart()]);

      service.addToCart(mockProduct1);
      cartValues.push([...service.cart()]);
      service.clearCart();
      cartValues.push([...service.cart()]);

      expect(cartValues.length).toBe(3);
      expect(cartValues[0].length).toBe(0);
      expect(cartValues[1].length).toBe(1);
      expect(cartValues[2].length).toBe(0);
    });
  });
});
