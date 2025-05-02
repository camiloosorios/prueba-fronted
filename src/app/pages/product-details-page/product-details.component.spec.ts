import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../../interfaces/product.interfaces';
import { CurrencyPipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import ProductDetailsPageComponent from './product-details-page.component';

describe('ProductDetailsPageComponent', () => {
  let component: ProductDetailsPageComponent;
  let fixture: ComponentFixture<ProductDetailsPageComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let favoriteService: jasmine.SpyObj<FavoriteService>;
  let router: Router;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'test',
    image: 'test.jpg',
  };

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', [
      'getProductById',
    ]);
    const cartSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    const favoriteSpy = jasmine.createSpyObj('FavoriteService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailsPageComponent, RouterTestingModule, CurrencyPipe],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: CartService, useValue: cartSpy },
        { provide: FavoriteService, useValue: favoriteSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsPageComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    favoriteService = TestBed.inject(
      FavoriteService
    ) as jasmine.SpyObj<FavoriteService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load product details', fakeAsync(() => {
      productService.getProductById.and.returnValue(of(mockProduct));

      fixture.detectChanges();
      tick();

      expect(productService.getProductById).toHaveBeenCalledWith(1);
      expect(component.product()).toEqual(mockProduct);
    }));

    it('should handle error when loading product', fakeAsync(() => {
      const consoleSpy = spyOn(console, 'error');
      productService.getProductById.and.returnValue(
        throwError(() => new Error('Test Error'))
      );

      fixture.detectChanges();
      tick();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching product:',
        jasmine.any(Error)
      );
    }));
  });

  describe('Template', () => {
    beforeEach(fakeAsync(() => {
      productService.getProductById.and.returnValue(of(mockProduct));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should display product title', () => {
      const title = fixture.debugElement.query(By.css('h2'));
      expect(title.nativeElement.textContent).toContain(mockProduct.title);
    });

    it('should display formatted price', () => {
      const price = fixture.debugElement.query(By.css('p.text-xl'));
      expect(price.nativeElement.textContent).toContain('$100.00');
    });

    it('should display product description', () => {
      const desc = fixture.debugElement.query(By.css('p.text-gray-600'));
      expect(desc.nativeElement.textContent).toContain(mockProduct.description);
    });

    it('should display product image', () => {
      const img = fixture.debugElement.query(By.css('img'));
      expect(img.attributes['src']).toBe(mockProduct.image);
      expect(img.attributes['alt']).toBe(mockProduct.title);
    });

    it('should have back button with router link', () => {
      const backLink = fixture.debugElement.query(By.css('a[routerLink="/"]'));
      expect(backLink).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    beforeEach(fakeAsync(() => {
      productService.getProductById.and.returnValue(of(mockProduct));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should call addToCart when button is clicked', () => {
      const button = fixture.debugElement.query(
        By.css('button.bg-\\[\\#38b2ac\\]')
      );
      button.triggerEventHandler('click', null);

      expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('should call addToFavorites when button is clicked', () => {
      const button = fixture.debugElement.query(By.css('button.bg-white'));
      button.triggerEventHandler('click', null);

      expect(favoriteService.add).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('Product Details List', () => {
    it('should display product details list', fakeAsync(() => {
      productService.getProductById.and.returnValue(of(mockProduct));
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const detailsList = fixture.debugElement.queryAll(By.css('ul li'));
      expect(detailsList.length).toBe(7);
      expect(detailsList[0].nativeElement.textContent).toContain(
        'Materiales de alta calidad'
      );
    }));
  });
});
