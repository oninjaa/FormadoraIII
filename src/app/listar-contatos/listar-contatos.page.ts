import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList } from '@ionic/angular/standalone';
import { ApiService } from '../service/api.service';
import { ContatoItemComponent } from '../components/contato-item/contato-item.component';

@Component({
  selector: 'app-listar-contatos',
  templateUrl: './listar-contatos.page.html',
  styleUrls: ['./listar-contatos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, CommonModule, FormsModule, ContatoItemComponent]
})
export class ListarContatosPage implements OnInit {
  users: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getUsers().subscribe({
      next: (u) => this.users = u,
      error: (err) => console.error('Erro ao buscar usuários', err)
    });
  }

}
