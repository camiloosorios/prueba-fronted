import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Product } from '../../interfaces/product.interfaces';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, TitleCasePipe, RouterLink],
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input.required<Product>();
  tag = input<string | null>();
  discount = input<boolean | null>();
  discountValue = Math.floor(Math.random() * (70 - 5 + 1)) + 5;

  cartService = inject(CartService);
  favoriteService = inject(FavoriteService);
}
