import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { LoggerService } from './app/core/logger.service';
import { SessionVaultService } from './app/core/session-vault.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const appInitFactory =
  (logger: LoggerService, vault: SessionVaultService): (() => Promise<void>) =>
  async () => {
    try {
      logger.log('init');
      await vault.initialize();
      const session = await vault.getSession();
      logger.log(`init session: ${JSON.stringify(session)}`);
    } catch (err: any) {
      logger.log(JSON.stringify(err));
    }
  };

bootstrapApplication(AppComponent, {
  providers: [
    provideAppInitializer(() => {
      const initializerFn = appInitFactory(inject(LoggerService), inject(SessionVaultService));
      return initializerFn();
    }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
  ],
});
