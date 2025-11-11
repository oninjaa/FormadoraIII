import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, addCircleOutline } from 'ionicons/icons';
import { RouterModule,Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, RouterModule],
})
export class AppComponent {
  constructor(private router: Router) {
    // Register specific SVG data for icons used in the app
    addIcons({ menuOutline, addCircleOutline });
  }
}
