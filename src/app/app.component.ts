import { Component, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LoggerService } from './core/logger.service';
import { SessionVaultService } from './core/session-vault.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private logger = inject(LoggerService);
  private sessionVault = inject(SessionVaultService);
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.setupPauseListener();
    this.setupResumeListener();
  }

  private setupPauseListener() {
    App.addListener('pause', async () => {
      this.timeout = setTimeout(() => {
        this.sessionVault.lock();
        this.logger.log('vault locked');
        this.timeout = null;
      }, 2000);

      setTimeout(async () => {
        try {
          await this.sessionVault.unlock();
        } catch (err: any) {
          this.logger.log(JSON.stringify(err));
        }
      }, 4000);
    });
  }

  private setupResumeListener() {
    App.addListener('resume', async () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      try {
        const session = await this.sessionVault.getSession();
        this.logger.log(`resume: ${session?.accessToken}`);
      } catch (err: any) {
        this.logger.log(JSON.stringify(err));
      }
    });
  }
}
