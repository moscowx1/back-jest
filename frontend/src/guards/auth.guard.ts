import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { authFeature } from 'src/state/auth.feature';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  return store.select(authFeature.selectIsAuth);
};
