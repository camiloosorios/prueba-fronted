import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interfaces';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-details-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailsPageComponent implements OnInit {
  readonly productService = inject(ProductService);
  readonly favoriteService = inject(FavoriteService);
  readonly cartService = inject(CartService);
  readonly route = inject(ActivatedRoute);
  product = signal<Product | null>(null);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(+productId!).subscribe({
      next: (product) => {
        this.product.set(product);
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
    });
  }
}
