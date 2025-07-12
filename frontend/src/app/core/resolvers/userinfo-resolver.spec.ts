import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userinfoResolver } from './userinfo-resolver';

describe('userinfoResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => userinfoResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
