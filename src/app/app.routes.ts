import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'adicionar-contato',
    pathMatch: 'full'
  },
  {
    path: 'adicionar-contato',
    loadComponent: () => import('./adicionar-contato/adicionar-contato.page').then(m => m.AdicionarContatoPage)
  },
  {
    path: 'listar-contatos',
    loadComponent: () => import('./listar-contatos/listar-contatos.page').then(m => m.ListarContatosPage)
  }
];
