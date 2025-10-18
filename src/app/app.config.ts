import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { favoritesFeature } from './states/favorites/favorites.feature';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()), 
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore(),
    provideState(favoritesFeature),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
  ]
};
