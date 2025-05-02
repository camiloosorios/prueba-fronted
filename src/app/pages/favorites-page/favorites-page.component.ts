import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-favorites-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './favorites-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FavoritesPageComponent {
  favoriteService = inject(FavoriteService);
}
