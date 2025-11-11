import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, onValue, set, remove, get, query, orderByChild, equalTo } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private db: any;

  constructor() {
    const app = !getApps().length ? initializeApp(environment as any) : getApp();
    this.db = getDatabase(app);
  }

  async existsPhone(phoneDigits: string): Promise<boolean> {
    if (!phoneDigits) return false;
    const contatosRef = ref(this.db, 'contatos');
    try {
      const snap = await get(contatosRef);
      const val = snap.val();
      if (!val) return false;
      return Object.values(val).some((c: any) => (c?.phone || '').toString().replace(/\D/g, '') === phoneDigits);
    } catch (err) {
      console.error('Erro ao verificar telefone existente', err);
      return false;
    }
  }

  addContato(contato: any): Promise<void> {
    const contatosRef = ref(this.db, 'contatos');
    const newRef = push(contatosRef);
    return set(newRef, contato);
  }

  updateContato(id: string, contato: any): Promise<void> {
    const contatoRef = ref(this.db, `contatos/${id}`);
    return set(contatoRef, contato);
  }

  deleteContato(id: string): Promise<void> {
    const contatoRef = ref(this.db, `contatos/${id}`);
    return remove(contatoRef);
  }

  listContatos(): Observable<any[]> {
    return new Observable((observer) => {
      const contatosRef = ref(this.db, 'contatos');
      onValue(contatosRef, (snapshot) => {
        const val = snapshot.val();
        const arr = val ? Object.keys(val).map((k) => ({ id: k, ...val[k] })) : [];
        observer.next(arr);
      }, (err) => observer.error(err));
    });
  }
}
