import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';
import { CartService } from './cart.service';
import { Product } from '../interfaces/product.interfaces';
import { effect } from '@angular/core';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let cartService: CartService;

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
    TestBed.configureTestingModule({
      providers: [
        FavoriteService,
        {
          provide: CartService,
          useValue: jasmine.createSpyObj('CartService', ['addToCart']),
        },
      ],
    });

    service = TestBed.inject(FavoriteService);
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('favoriteProducts signal', () => {
    it('should initialize as empty array', () => {
      expect(service.favoriteProducts().length).toBe(0);
    });
  });

  describe('add()', () => {
    it('should add product to favorites', () => {
      service.add(mockProduct1);
      expect(service.favoriteProducts().length).toBe(1);
      expect(service.favoriteProducts()[0]).toEqual(mockProduct1);
    });

    it('should not add duplicate products', () => {
      service.add(mockProduct1);
      service.add(mockProduct1);
      expect(service.favoriteProducts().length).toBe(1);
    });

    it('should allow adding different products', () => {
      service.add(mockProduct1);
      service.add(mockProduct2);
      expect(service.favoriteProducts().length).toBe(2);
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      service.add(mockProduct1);
      service.add(mockProduct2);
    });

    it('should remove specified product', () => {
      service.remove(mockProduct1.id);
      expect(service.favoriteProducts().length).toBe(1);
      expect(service.favoriteProducts()[0].id).toBe(mockProduct2.id);
    });

    it('should do nothing if product not in favorites', () => {
      const initialFavorites = service.favoriteProducts();
      service.remove(999);
      expect(service.favoriteProducts()).toEqual(initialFavorites);
    });
  });

  describe('clear()', () => {
    it('should empty the favorites list', () => {
      service.add(mockProduct1);
      service.add(mockProduct2);
      service.clear();
      expect(service.favoriteProducts().length).toBe(0);
    });
  });

  describe('isFavorite()', () => {
    it('should return true for favorite products', () => {
      service.add(mockProduct1);
      expect(service.isFavorite(mockProduct1.id)).toBeTrue();
    });

    it('should return false for non-favorite products', () => {
      expect(service.isFavorite(mockProduct1.id)).toBeFalse();
    });
  });

  describe('getTotal()', () => {
    it('should return correct count of favorites', () => {
      expect(service.getTotal()).toBe(0);
      service.add(mockProduct1);
      expect(service.getTotal()).toBe(1);
      service.add(mockProduct2);
      expect(service.getTotal()).toBe(2);
    });
  });

  describe('moveToCart()', () => {
    beforeEach(() => {
      service.add(mockProduct1);
      (cartService.addToCart as jasmine.Spy).calls.reset();
    });

    it('should add product to cart', () => {
      service.moveToCart(mockProduct1);
      expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct1);
    });

    it('should remove product from favorites', () => {
      service.moveToCart(mockProduct1);
      expect(service.isFavorite(mockProduct1.id)).toBeFalse();
    });

    it('should not fail if product not in favorites', () => {
      service.moveToCart(mockProduct2);
      expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct2);
      expect(service.favoriteProducts().length).toBe(1);
    });
  });
});
