import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Session } from 'src/model/session';
import { AuthActions } from './auth.actions';

export type AuthState = {
  session: null | Session
};

export const initialState: AuthState = { 
  session: null
};

export const authFeatureKey = 'authFeature';

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer: createReducer(
    initialState,
    on(
      AuthActions.loggedIn,
      (_, { payload }): AuthState => ({ session: payload }),
    ),
    on(AuthActions.loggedOut, (): AuthState => ({ session: null })),
  ),
  extraSelectors: ({selectSession}) => ({
    selectIsAuth: createSelector(
      selectSession,
      (session) => session !== null
    )
  })
});
