import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import routeConfig from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideProtractorTestingSupport(), provideRouter(routeConfig), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()),provideHttpClient(withFetch())]
};
