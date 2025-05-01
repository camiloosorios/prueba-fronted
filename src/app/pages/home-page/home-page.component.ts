import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { TextCardComponent } from '../../components/text-card/text-card.component';
import { ProductService } from '../../services/product.service';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [ProductCardComponent, TextCardComponent, AsyncPipe],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePageComponent {
  productService = inject(ProductService);
  newArrivals = viewChild<ElementRef>('newArrivals');
  newCollection = viewChild<ElementRef>('newCollection');

  readonly featuredProducts = this.productService.getFeaturedProducts();
  readonly recentProducts = this.productService.getRecentProducts();
  readonly saleProducts = this.productService.getSaleProducts();

  scrollToNewCollection() {
    const element = this.newCollection()?.nativeElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToNewArrivals() {
    const element = this.newArrivals()?.nativeElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
