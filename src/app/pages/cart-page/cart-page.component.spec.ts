import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartService } from '../../services/cart.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import CartPageComponent from './cart-page.component';

describe('CartPageComponent', () => {
  let component: CartPageComponent;
  let fixture: ComponentFixture<CartPageComponent>;
  let cartService: jasmine.SpyObj<CartService>;

  const mockCartItems = [
    {
      product: {
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Description 1',
        category: 'category1',
        image: 'image1.jpg',
      },
      quantity: 2,
    },
    {
      product: {
        id: 2,
        title: 'Product 2',
        price: 200,
        description: 'Description 2',
        category: 'category2',
        image: 'image2.jpg',
      },
      quantity: 1,
    },
  ];

  beforeEach(async () => {
    const cartSpy = jasmine.createSpyObj(
      'CartService',
      [
        'addToCart',
        'decreaseQuantity',
        'removeFromCart',
        'getTotalPrice',
        'getShippingPrice',
      ],
      {
        cart: jasmine.createSpy().and.returnValue([]),
      }
    );

    await TestBed.configureTestingModule({
      imports: [CartPageComponent, RouterTestingModule, CurrencyPipe],
      providers: [{ provide: CartService, useValue: cartSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPageComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when empty', () => {
    beforeEach(() => {
      cartService.cart.and.returnValue([]);
      fixture.detectChanges();
    });

    it('should display empty state', () => {
      const emptyState = fixture.debugElement.query(By.css('.h-\\[65vh\\]'));
      expect(emptyState).toBeTruthy();

      const title = fixture.debugElement.query(By.css('h2.text-4xl'));
      expect(title.nativeElement.textContent).toContain(
        'Tu carrito está vacío'
      );

      const button = fixture.debugElement.query(
        By.css('button[routerLink="/"]')
      );
      expect(button).toBeTruthy();
    });

    it('should not display cart items', () => {
      const cartItems = fixture.debugElement.query(By.css('.grid-cols-1'));
      expect(cartItems).toBeNull();
    });
  });

  describe('with items', () => {
    beforeEach(() => {
      cartService.cart.and.returnValue(mockCartItems);
      cartService.getTotalPrice.and.returnValue(400);
      cartService.getShippingPrice.and.returnValue(0);
      fixture.detectChanges();
    });

    it('should display cart count in title', () => {
      const title = fixture.debugElement.query(By.css('h2.text-3xl'));
      expect(title.nativeElement.textContent).toContain(
        `(${mockCartItems.length})`
      );
    });

    it('should display all cart items', () => {
      const itemsContainer = fixture.debugElement.query(
        By.css('div.col-span-3')
      );
      const productCards = itemsContainer.queryAll(
        By.css('.border.border-gray-300')
      );
      expect(productCards.length).toBe(mockCartItems.length);
    });

    it('should display item details correctly', () => {
      const firstItem = fixture.debugElement.query(
        By.css('.border.border-gray-300')
      );

      const title = firstItem.query(By.css('a.text-lg.font-semibold'));
      expect(title.nativeElement.textContent.trim()).toBe(
        mockCartItems[0].product.title
      );

      const priceElement = firstItem.query(
        By.css('div.flex.flex-col.md\\:items-end > p.font-semibold')
      );
      expect(priceElement.nativeElement.textContent.trim()).toBe('$100.00');

      const quantity = firstItem.query(By.css('.mx-2.text-lg'));
      expect(quantity.nativeElement.textContent.trim()).toBe('2');

      const image = firstItem.query(By.css('img'));
      expect(image.attributes['src']).toBe(mockCartItems[0].product.image);
      expect(image.attributes['alt']).toBe(mockCartItems[0].product.title);
    });

    it('should call addToCart when increase quantity is clicked', () => {
      const firstItem = fixture.debugElement.query(
        By.css('.border.border-gray-300')
      );
      const increaseButton = firstItem.queryAll(
        By.css('button.bg-gray-100')
      )[1];
      increaseButton.triggerEventHandler('click', null);

      expect(cartService.addToCart).toHaveBeenCalledWith(
        mockCartItems[0].product
      );
    });

    it('should call decreaseQuantity when decrease is clicked', () => {
      const firstItem = fixture.debugElement.query(
        By.css('.border.border-gray-300')
      );
      const decreaseButton = firstItem.query(
        By.css('button.bg-gray-100:first-child')
      );
      decreaseButton.triggerEventHandler('click', null);

      expect(cartService.decreaseQuantity).toHaveBeenCalledWith(
        mockCartItems[0].product.id
      );
    });

    it('should call removeFromCart when delete is clicked', () => {
      const firstItem = fixture.debugElement.query(
        By.css('.border.border-gray-300')
      );
      const deleteButton = firstItem.query(By.css('.hover\\:text-red-500'));
      deleteButton.triggerEventHandler('click', null);

      expect(cartService.removeFromCart).toHaveBeenCalledWith(
        mockCartItems[0].product.id
      );
    });

    it('should display continue shopping link', () => {
      const continueLink = fixture.debugElement.query(
        By.css('a[routerLink="/"]')
      );
      expect(continueLink).toBeTruthy();
    });
  });

  describe('shipping costs', () => {
    it('should show free shipping when total >= 50', () => {
      cartService.cart.and.returnValue(mockCartItems);
      cartService.getTotalPrice.and.returnValue(400);
      cartService.getShippingPrice.and.returnValue(0);
      fixture.detectChanges();

      const summarySection = fixture.debugElement.query(By.css('.col-span-2'));

      const shippingRow = summarySection
        .queryAll(By.css('.flex.justify-between'))
        .find(
          (row) =>
            row.nativeElement.textContent.includes('Envio') ||
            row.nativeElement.textContent.includes('Envío')
        );

      expect(shippingRow).toBeTruthy();

      const shippingValue = shippingRow!.queryAll(By.css('p'))[1];
      expect(shippingValue.nativeElement.textContent.trim()).toBe('Gratis');
    });

    it('should show shipping cost when total < 50', () => {
      cartService.cart.and.returnValue([mockCartItems[0]]);
      cartService.getTotalPrice.and.returnValue(100);
      cartService.getShippingPrice.and.returnValue(10);
      fixture.detectChanges();

      const summarySection = fixture.debugElement.query(By.css('.col-span-2'));

      const shippingRow = summarySection
        .queryAll(By.css('.flex.justify-between'))
        .find(
          (row) =>
            row.nativeElement.textContent.includes('Envio') ||
            row.nativeElement.textContent.includes('Envío')
        );

      expect(shippingRow).toBeTruthy();

      const shippingValue = shippingRow!.queryAll(By.css('p'))[1];
      expect(shippingValue.nativeElement.textContent.trim()).toBe('$10.00');
    });
  });
});
