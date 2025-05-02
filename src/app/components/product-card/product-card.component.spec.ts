import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Product } from '../../interfaces/product.interfaces';

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'test category',
    image: 'test.jpg',
  };

  beforeEach(async () => {
    const cartSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    const favoriteSpy = jasmine.createSpyObj('FavoriteService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        ProductCardComponent,
        RouterTestingModule,
        CurrencyPipe,
        TitleCasePipe,
      ],
      providers: [
        { provide: CartService, useValue: cartSpy },
        { provide: FavoriteService, useValue: favoriteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    favoriteServiceSpy = TestBed.inject(
      FavoriteService
    ) as jasmine.SpyObj<FavoriteService>;

    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display product image', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img.attributes['src']).toBe(mockProduct.image);
    expect(img.attributes['alt']).toBe(mockProduct.title);
  });

  it('should display product title', () => {
    const title = fixture.debugElement.query(
      By.css('p.hover\\:text-\\[\\#38b2ac\\]')
    );
    expect(title.nativeElement.textContent.trim()).toBe(
      mockProduct.title.slice(0, 66)
    );
  });

  it('should display product category', () => {
    const category = fixture.debugElement.query(By.css('p.bg-gray-200'));
    expect(category.nativeElement.textContent.trim()).toBe('Test Category');
  });

  it('should display product price', () => {
    const price = fixture.debugElement.query(By.css('p.font-semibold'));
    expect(price.nativeElement.textContent.trim()).toBe('$100.00');
  });

  describe('with tag input', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('tag', 'oferta');
      fixture.detectChanges();
    });

    it('should display tag', () => {
      const tag = fixture.debugElement.query(By.css('h1'));
      expect(tag.nativeElement.textContent.trim()).toBe('Oferta');
      expect(tag.nativeElement.classList).toContain('bg-red-400');
    });
  });

  describe('with discount', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('discount', true);
      fixture.detectChanges();
    });

    it('should display discount info', () => {
      const originalPrice = fixture.debugElement.query(
        By.css('p.font-semibold')
      );
      const discountedPrice = fixture.debugElement.query(By.css('del'));
      const discountPercentage = fixture.debugElement.query(
        By.css('p.text-red-400')
      );

      expect(originalPrice.nativeElement.textContent.trim()).toBe('$100.00');
      expect(discountedPrice).toBeTruthy();
      expect(discountPercentage.nativeElement.textContent.trim()).toContain(
        '% off'
      );
    });
  });

  it('should call addToCart', () => {
    const button = fixture.debugElement.query(
      By.css('button.bg-\\[\\#38b2ac\\]')
    );
    button.triggerEventHandler('click', null);
    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should call addToFavorites', () => {
    const button = fixture.nativeElement.querySelector('#add-to-favorites');
    button.click();

    expect(favoriteServiceSpy.add).toHaveBeenCalled();
  });

  it('should have correct product link', () => {
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.css('#product-link'));
    expect(link.nativeElement.getAttribute('ng-reflect-router-link')).toBe(
      '/products/1'
    );
  });
});
