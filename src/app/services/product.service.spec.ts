import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product.interfaces';
import { environment } from '../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 100,
      description: 'Description 1',
      category: "men's clothing",
      image: 'image1.jpg',
    },
    {
      id: 2,
      title: 'Product 2',
      price: 200,
      description: 'Description 2',
      category: "women's clothing",
      image: 'image2.jpg',
    },
  ];
  const mockProduct: Product = mockProducts[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFeaturedProducts', () => {
    it('should return featured products', () => {
      service.getFeaturedProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(2);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/products/category/men's%20clothing`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle empty response', () => {
      service.getFeaturedProducts().subscribe((products) => {
        expect(products).toEqual([]);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/products/category/men's%20clothing`
      );
      req.flush([]);
    });

    it('should handle error', () => {
      const errorMessage = 'Error fetching featured products';
      service.getFeaturedProducts().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/products/category/men's%20clothing`
      );
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getRecentProducts', () => {
    it('should return recent products with limit', () => {
      service.getRecentProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(2);
      });
      const expectedUrl = `${environment.apiUrl}/products/category/women's%20clothing?limit=4`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle error when fetching recent products', () => {
      service.getRecentProducts().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const expectedUrl = `${environment.apiUrl}/products/category/women's%20clothing?limit=4`;
      const req = httpMock.expectOne(expectedUrl);
      req.error(new ProgressEvent('error'));
    });

    it('should handle error when fetching recent products', () => {
      service.getRecentProducts().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/products/category/women's%20clothing?limit=4`
      );
      req.error(new ProgressEvent('error'));
    });
  });

  describe('getSaleProducts', () => {
    it('should return sale products with limit', () => {
      service.getSaleProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/products/category/jewelery?limit=4`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should return empty array when no sale products', () => {
      service.getSaleProducts().subscribe((products) => {
        expect(products).toEqual([]);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/products/category/jewelery?limit=4`
      );
      req.flush([]);
    });
  });

  describe('getProductById', () => {
    it('should return a single product by id', () => {
      const productId = 1;
      service.getProductById(productId).subscribe((product) => {
        expect(product).toEqual(mockProduct);
        expect(product.id).toBe(productId);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/products/${productId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should handle 404 when product not found', () => {
      const productId = 999;
      service.getProductById(productId).subscribe({
        next: () => fail('should have failed with 404'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/products/${productId}`
      );
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle network error', () => {
      const productId = 1;
      service.getProductById(productId).subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error.error.type).toBe('error');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/products/${productId}`
      );
      const mockError = new ProgressEvent('error');
      req.error(mockError);
    });
  });

  describe('environment configuration', () => {
    it('should use correct API URL from environment', () => {
      expect(service['apiUrl']).toBe(environment.apiUrl);
    });
  });

  describe('HTTP methods', () => {
    it('should only use GET methods', () => {
      service.getFeaturedProducts().subscribe();
      service.getRecentProducts().subscribe();
      service.getSaleProducts().subscribe();
      service.getProductById(1).subscribe();

      const requests = httpMock.match(() => true);
      requests.forEach((req) => {
        expect(req.request.method).toBe('GET');
      });
    });
  });
});
