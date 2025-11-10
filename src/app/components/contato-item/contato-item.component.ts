import { Component, Input } from '@angular/core';
import { IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-contato-item',
  templateUrl: './contato-item.component.html',
  styleUrls: ['./contato-item.component.scss'],
  standalone: true,
  imports: [IonItem, IonLabel]
})
export class ContatoItemComponent {
  @Input() contato: any;
}
