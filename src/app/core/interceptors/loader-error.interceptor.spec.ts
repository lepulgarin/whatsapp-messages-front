import { TestBed } from '@angular/core/testing';
import { LoaderErrorInterceptor } from './loader-error.interceptor';

describe('HttpInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [LoaderErrorInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: LoaderErrorInterceptor = TestBed.inject(
      LoaderErrorInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});

