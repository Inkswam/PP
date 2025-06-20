import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { RegisterFormComponent } from 'src/app/features/register/register-form.component';
import { LoginComponent } from 'src/app/features/login/login.component';
import { UserPageComponent } from 'src/app/features/user/user-page.component';
import {MainLayoutComponent} from 'src/app/layouts/main-layout/main-layout.component';
import {DashboardComponent} from 'src/app/features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'user', component: UserPageComponent },


  {
    path: 'auth',
    loadChildren: () =>
      import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
  },

  {
    path: '',
    loadChildren: () =>
      import('./layouts/main-layout/main-layout.module').then(m => m.MainLayoutModule)
  },

  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent }
    ]
  },



  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {} // <- додано експортування модуля
