import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteService } from '../../services/favorite.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../interfaces/product.interfaces';
import FavoritesPageComponent from './favorites-page.component';

describe('FavoritesPageComponent', () => {
  let component: FavoritesPageComponent;
  let fixture: ComponentFixture<FavoritesPageComponent>;
  let favoriteService: jasmine.SpyObj<FavoriteService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 100,
      description: 'Description 1',
      category: 'category1',
      image: 'image1.jpg',
    },
    {
      id: 2,
      title: 'Product 2',
      price: 200,
      description: 'Description 2',
      category: 'category2',
      image: 'image2.jpg',
    },
  ];

  beforeEach(async () => {
    const favoriteSpy = jasmine.createSpyObj(
      'FavoriteService',
      ['getTotal', 'remove', 'moveToCart'],
      {
        favoriteProducts: jasmine.createSpy().and.returnValue([]),
      }
    );

    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent, RouterTestingModule, CurrencyPipe],
      providers: [{ provide: FavoriteService, useValue: favoriteSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPageComponent);
    component = fixture.componentInstance;
    favoriteService = TestBed.inject(
      FavoriteService
    ) as jasmine.SpyObj<FavoriteService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when empty', () => {
    beforeEach(() => {
      favoriteService.getTotal.and.returnValue(0);
      favoriteService.favoriteProducts.and.returnValue([]);
      fixture.detectChanges();
    });

    it('should display empty state', () => {
      const emptyState = fixture.debugElement.query(By.css('.h-\\[65vh\\]'));
      expect(emptyState).toBeTruthy();

      const title = fixture.debugElement.query(By.css('h2.text-4xl'));
      expect(title.nativeElement.textContent).toContain(
        'Tu lista de favoritos está vacía'
      );

      const button = fixture.debugElement.query(
        By.css('button[routerLink="/"]')
      );
      expect(button).toBeTruthy();
    });

    it('should not display favorites list', () => {
      const favoritesList = fixture.debugElement.query(By.css('.mt-10.mx-5'));
      expect(favoritesList).toBeNull();
    });
  });

  describe('with favorites', () => {
    beforeEach(() => {
      favoriteService.getTotal.and.returnValue(mockProducts.length);
      favoriteService.favoriteProducts.and.returnValue(mockProducts);
      fixture.detectChanges();
    });

    it('should display favorites count in title', () => {
      const title = fixture.debugElement.query(By.css('h2.text-3xl'));
      expect(title.nativeElement.textContent).toContain(
        `(${mockProducts.length})`
      );
    });

    it('should display all favorite products', () => {
      const productCards = fixture.debugElement.queryAll(
        By.css('.border.border-gray-300')
      );
      expect(productCards.length).toBe(mockProducts.length);
    });

    it('should display product details correctly', () => {
      const firstProduct = fixture.debugElement.query(
        By.css('.border.border-gray-300')
      );

      const title = firstProduct.query(By.css('h4'));
      expect(title.nativeElement.textContent).toContain(mockProducts[0].title);

      const price = firstProduct.query(By.css('.font-semibold'));
      expect(price.nativeElement.textContent).toContain('$100.00');

      const image = firstProduct.query(By.css('img'));
      expect(image.attributes['src']).toBe(mockProducts[0].image);
      expect(image.attributes['alt']).toBe(mockProducts[0].title);
    });

    it('should call remove when delete is clicked', () => {
      const deleteButton = fixture.debugElement.query(
        By.css('.hover\\:text-red-400')
      );
      deleteButton.triggerEventHandler('click', null);

      expect(favoriteService.remove).toHaveBeenCalledWith(mockProducts[0].id);
    });

    it('should call moveToCart when button is clicked', () => {
      const addToCartButton = fixture.debugElement.query(
        By.css('button.bg-\\[\\#38b2ac\\]')
      );
      addToCartButton.triggerEventHandler('click', null);

      expect(favoriteService.moveToCart).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should display continue shopping link', () => {
      const continueLink = fixture.debugElement.query(
        By.css('a[routerLink="/"]')
      );
      expect(continueLink).toBeTruthy();
    });
  });
});
