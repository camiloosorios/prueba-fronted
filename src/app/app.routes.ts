import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home-page/home-page.component'),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart-page/cart-page.component'),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites-page/favorites-page.component'),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-details-page/product-details-page.component'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
