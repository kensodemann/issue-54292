import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SessionVaultService } from './core/session-vault.service';
import { App } from '@capacitor/app';
import { LoggerService } from './core/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    const logger = inject(LoggerService);
    const sessionVault = inject(SessionVaultService);

    App.addListener('appStateChange', async ({ isActive }) => {
      try {
        logger.log(`app state change isActive: ${isActive}`);
        await sessionVault.unlock();
        await sessionVault.getSession();
      } catch (err: any) {
        logger.log(JSON.stringify(err));
      }
    });
  }
}
