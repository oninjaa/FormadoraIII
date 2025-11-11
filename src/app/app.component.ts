import { Component } from '@angular/core';
import { IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon]
})
export class AppComponent {
  constructor() {
    addIcons({ addCircleOutline, listOutline });
  }
}
