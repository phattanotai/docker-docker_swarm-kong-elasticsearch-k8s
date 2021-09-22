import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { AdminComponent } from './layout/admin/admin.component';

const routes: Routes = [
  {
    path: 'login',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
      
      },
    ],
  },
  {
    path: 'register',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)
      
      },
    ],
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
      
      },
    ],
  },

  {
    path: '**',
    component: ErrorComponent,
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
