import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, onValue, set } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private db: any;

  constructor() {
    const app = !getApps().length ? initializeApp(environment as any) : getApp();
    this.db = getDatabase(app);
  }

  addContato(contato: any): Promise<void> {
    const contatosRef = ref(this.db, 'contatos');
    const newRef = push(contatosRef);
    return set(newRef, contato);
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
