import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-listar-contatos',
  templateUrl: './listar-contatos.page.html',
  styleUrls: ['./listar-contatos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, CommonModule, FormsModule]
})
export class ListarContatosPage implements OnInit {
  contacts: any[] = [];
  editingId: string | null = null;
  editModel: any = {};

  constructor(private fb: FirebaseService) { }

  ngOnInit() {
    this.fb.listContatos().subscribe({
      next: (arr) => this.contacts = arr,
      error: (err) => console.error('Erro ao listar contatos do Firebase', err)
    });
  }

  startEdit(contact: any) {
    this.editingId = contact.id;
    this.editModel = { ...contact };
  }

  async saveEdit() {
    if (!this.editingId) return;
    const id = this.editingId;
    const data = { ...this.editModel };
    delete data.id;
    try {
      await this.fb.updateContato(id, data);
      this.editingId = null;
      this.editModel = {};
    } catch (err) {
      console.error('Erro ao atualizar contato', err);
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editModel = {};
  }

  async deleteContact(id: string) {
    try {
      await this.fb.deleteContato(id);
    } catch (err) {
      console.error('Erro ao deletar contato', err);
    }
  }

}
