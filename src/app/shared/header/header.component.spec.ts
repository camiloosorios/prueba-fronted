import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { signal, Signal, WritableSignal } from '@angular/core';
import { Product } from '../../interfaces/product.interfaces';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

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

  let mockCartService: {
    cart: Signal<any[]>;
  };

  let mockFavoriteService: {
    favoriteProducts: WritableSignal<Product[]>;
    getTotal: jasmine.Spy;
  };

  beforeEach(async () => {
    mockCartService = {
      cart: signal([]),
    };

    mockFavoriteService = {
      favoriteProducts: signal([]),
      getTotal: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: FavoriteService, useValue: mockFavoriteService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should display favorite icon with count when there are favorites', () => {
    mockFavoriteService.favoriteProducts.set([mockProduct1, mockProduct2]);
    mockFavoriteService.getTotal.and.returnValue(2);

    fixture.detectChanges();

    const favoriteLink = fixture.debugElement.query(
      By.css('a[routerLink="favorites"]')
    );
    const badge = favoriteLink.query(By.css('div'));

    expect(favoriteLink).toBeTruthy();
    expect(badge).toBeTruthy();
    expect(badge.nativeElement.textContent.trim()).toBe('2');
  });

  it('should not display favorite badge when no favorites', () => {
    mockFavoriteService.favoriteProducts.set([]);
    mockFavoriteService.getTotal.and.returnValue(0);

    fixture.detectChanges();

    const favoriteLink = fixture.debugElement.query(
      By.css('a[routerLink="favorites"]')
    );
    const badge = favoriteLink.query(By.css('div'));

    expect(favoriteLink).toBeTruthy();
    expect(badge).toBeNull();
  });
});
