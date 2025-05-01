import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component'),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart-page/cart-page.component'),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/product-details-page/product-details-page.component'),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page.component'),
  },
];
