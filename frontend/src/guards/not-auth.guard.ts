import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { authFeature } from 'src/state/auth.feature';

export const notAuthGuard: CanActivateFn = () => {
  const store = inject(Store);
  return store.select(authFeature.selectIsAuth).pipe(map((isAuth) => !isAuth));
};
