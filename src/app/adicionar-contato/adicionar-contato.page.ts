import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { FirebaseService } from '../service/firebase.service';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { addIcons } from 'ionicons';
import { shuffleOutline, personOutline, mailOutline, callOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-adicionar-contato',
  templateUrl: './adicionar-contato.page.html',
  styleUrls: ['./adicionar-contato.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonItem, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent]
})
export class AdicionarContatoPage implements OnInit {
  nome: string = '';
  email: string = '';
  celular: string = '';
  apiUsers: any[] = [];
  selectedUser: any | null = null;

  constructor(private fb: FirebaseService, private api: ApiService, private toastCtrl: ToastController) {
    addIcons({ shuffleOutline, personOutline, mailOutline, callOutline, checkmarkCircleOutline });
  }

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
      this.celular = '';
      return;
    }
    const idx = Math.floor(Math.random() * this.apiUsers.length);
    this.selectedUser = this.apiUsers[idx];
    this.nome = this.selectedUser.name || '';
    this.email = this.selectedUser.email || '';
    
    // Gerar telefone aleatório com 11 dígitos (formato brasileiro)
    const ddd = Math.floor(Math.random() * 90) + 11; // DDDs de 11 a 99
    const nono = 9; // Primeiro dígito é sempre 9 para celular
    const resto = Math.floor(Math.random() * 100000000).toString().padStart(8, '0'); // 8 dígitos
    const phoneDigits = `${ddd}${nono}${resto}`;
    
    // Aplicar máscara ao telefone
    this.celular = this.applyPhoneMask(phoneDigits);
  }

  onPhoneInput(ev: any) {
    const raw = ev?.detail?.value ?? ev?.target?.value ?? '';
    const digits = (raw + '').replace(/\D/g, '').slice(0, 11);
    this.celular = this.applyPhoneMask(digits);
  }

  onPhoneKeyDown(e: KeyboardEvent) {
    // Allow control keys
    const allowedKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (allowedKeys.includes(e.key)) return;
    // Allow digits only
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
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
    // 11 digits (DDD + 9 + 4 + 4)
    const area = digits.slice(0, 2);
    const first = digits.slice(2, 3);
    const part1 = digits.slice(3, 7);
    const part2 = digits.slice(7);
    return `(${area}) ${first} ${part1}-${part2}`;
  }

  async adicionar() {
    const digits = (this.celular || '').toString().replace(/\D/g, '').slice(0,11);
    if (!digits || digits.length < 10) {
      await this.showToast('Informe um número válido (10 ou 11 dígitos).');
      return;
    }
    // verificar se já existe
    const exists = await this.fb.existsPhone(digits);
    if (exists) {
      await this.showToast('Número já existente.');
      return;
    }

    const contato = {
      name: this.nome || null,
      email: this.email || null,
      phone: digits || null,
      createdAt: new Date().toISOString()
    };
    try {
      await this.fb.addContato(contato);
      // reset celular only, keep current selected user
      this.celular = '';
      console.log('Contato adicionado');
      await this.showToast('Contato adicionado com sucesso.');
    } catch (err) {
      console.error('Erro ao adicionar contato', err);
      await this.showToast('Erro ao adicionar contato.');
    }
  }

  private async showToast(message: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500 });
    await t.present();
  }

}
