import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { FirebaseService } from '../service/firebase.service';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-adicionar-contato',
  templateUrl: './adicionar-contato.page.html',
  styleUrls: ['./adicionar-contato.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonItem, IonLabel, IonList]
})
export class AdicionarContatoPage implements OnInit {
  nome: string = '';
  email: string = '';
  celular: string = '';
  apiUsers: any[] = [];
  selectedUser: any | null = null;

  constructor(private fb: FirebaseService, private api: ApiService) {}

  ngOnInit() {
    this.api.getUsers().subscribe({
      next: (u) => {
        this.apiUsers = u || [];
        this.pickRandomUser();
      },
      error: (err) => console.error('Erro ao buscar usuários da API', err)
    });
  }

  pickRandomUser() {
    if (!this.apiUsers || this.apiUsers.length === 0) {
      this.selectedUser = null;
      this.nome = '';
      this.email = '';
      return;
    }
    const idx = Math.floor(Math.random() * this.apiUsers.length);
    this.selectedUser = this.apiUsers[idx];
    this.nome = this.selectedUser.name || '';
    this.email = this.selectedUser.email || '';
  }

  async adicionar() {
    const contato = {
      name: this.nome || null,
      email: this.email || null,
      phone: this.celular || null,
      createdAt: new Date().toISOString()
    };
    try {
      await this.fb.addContato(contato);
      // reset celular only, keep current selected user
      this.celular = '';
      console.log('Contato adicionado');
    } catch (err) {
      console.error('Erro ao adicionar contato', err);
    }
  }

}
