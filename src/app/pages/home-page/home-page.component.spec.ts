import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { TextCardComponent } from '../../components/text-card/text-card.component';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import HomePageComponent from './home-page.component';

class MockProductService {
  getFeaturedProducts() {
    return of([
      { id: 1, name: 'Product 1', price: 100, image: 'image1.jpg' },
      { id: 2, name: 'Product 2', price: 200, image: 'image2.jpg' },
    ]);
  }

  getRecentProducts() {
    return of([
      { id: 3, name: 'New Product 1', price: 150, image: 'image3.jpg' },
      { id: 4, name: 'New Product 2', price: 250, image: 'image4.jpg' },
    ]);
  }

  getSaleProducts() {
    return of([
      {
        id: 5,
        name: 'Sale Product 1',
        price: 80,
        originalPrice: 120,
        image: 'image5.jpg',
      },
      {
        id: 6,
        name: 'Sale Product 2',
        price: 90,
        originalPrice: 180,
        image: 'image6.jpg',
      },
    ]);
  }
}

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomePageComponent,
        ProductCardComponent,
        TextCardComponent,
        AsyncPipe,
      ],
      providers: [{ provide: ProductService, useClass: MockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize product observables', () => {
    fixture.detectChanges();
    expect(component.featuredProducts).toBeDefined();
    expect(component.recentProducts).toBeDefined();
    expect(component.saleProducts).toBeDefined();
  });

  it('should render why buy section with text cards', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const sections = fixture.debugElement.queryAll(By.css('section'));
    const whyBuySection = sections[1];

    expect(whyBuySection).toBeTruthy();

    const textCards = whyBuySection.queryAll(By.directive(TextCardComponent));
    expect(textCards.length).toBe(3);
  }));

  it('should call scrollToNewArrivals when button is clicked', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const scrollSpy = spyOn(component, 'scrollToNewArrivals');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const verNovedadesButton = buttons[0];

    verNovedadesButton.triggerEventHandler('click', null);
    expect(scrollSpy).toHaveBeenCalled();
  }));

  it('should call scrollToNewCollection when button is clicked', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const scrollSpy = spyOn(component, 'scrollToNewCollection');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const explorarButton = buttons[1];

    explorarButton.triggerEventHandler('click', null);
    expect(scrollSpy).toHaveBeenCalled();
  }));
});
