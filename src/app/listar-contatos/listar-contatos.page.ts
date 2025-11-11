import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonAvatar } from '@ionic/angular/standalone';
import { FirebaseService } from '../service/firebase.service';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, createOutline, trashOutline, checkmarkOutline, closeOutline, personOutline, peopleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-listar-contatos',
  templateUrl: './listar-contatos.page.html',
  styleUrls: ['./listar-contatos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonAvatar, CommonModule, FormsModule]
})
export class ListarContatosPage implements OnInit {
  contacts: any[] = [];
  editingId: string | null = null;
  editModel: any = {};

  constructor(private fb: FirebaseService) {
    addIcons({ mailOutline, callOutline, createOutline, trashOutline, checkmarkOutline, closeOutline, personOutline, peopleOutline });
  }

  ngOnInit() {
    this.fb.listContatos().subscribe({
      next: (arr) => this.contacts = arr,
      error: (err) => console.error('Erro ao listar contatos do Firebase', err)
    });
  }

  startEdit(contact: any) {
    this.editingId = contact.id;
    // format phone for editing (show mask) while keeping original digits for save
    const digits = (contact.phone || '').toString().replace(/\D/g, '').slice(0, 11);
    this.editModel = { ...contact, phone: this.applyPhoneMask(digits) };
  }

  async saveEdit() {
    if (!this.editingId) return;
    const id = this.editingId;
    const data = { ...this.editModel };
    delete data.id;
    try {
      // ensure phone saved as digits only
      if (data.phone) {
        data.phone = data.phone.toString().replace(/\D/g, '').slice(0, 11);
      }
      await this.fb.updateContato(id, data);
      this.editingId = null;
      this.editModel = {};
    } catch (err) {
      console.error('Erro ao atualizar contato', err);
    }
  }

  private applyPhoneMask(digits: string) {
    if (!digits) return '';
    const len = digits.length;
    if (len <= 2) {
      return `(${digits}`;
    }
    if (len <= 6) {
      const area = digits.slice(0, 2);
      const part = digits.slice(2);
      return `(${area}) ${part}`;
    }
    if (len <= 10) {
      const area = digits.slice(0, 2);
      const part1 = digits.slice(2, 6);
      const part2 = digits.slice(6);
      return `(${area}) ${part1}-${part2}`;
    }
    const area = digits.slice(0, 2);
    const first = digits.slice(2, 3);
    const part1 = digits.slice(3, 7);
    const part2 = digits.slice(7);
    return `(${area}) ${first} ${part1}-${part2}`;
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

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  formatPhone(phone: string): string {
    if (!phone) return '';
    const digits = phone.toString().replace(/\D/g, '').slice(0, 11);
    return this.applyPhoneMask(digits);
  }

  onPhoneInput(ev: any) {
    const raw = ev?.detail?.value ?? ev?.target?.value ?? '';
    const digits = (raw + '').replace(/\D/g, '').slice(0, 11);
    this.editModel.phone = this.applyPhoneMask(digits);
  }

  onPhoneKeyDown(e: KeyboardEvent) {
    const allowedKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (allowedKeys.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }

}
