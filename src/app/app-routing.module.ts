import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { HomeComponent } from './home/home.component';
import { LoginComponentComponent } from './login-component/login-component.component';

const routes: Routes = [
  {
    path : 'login',
    component : LoginComponentComponent
  },
  {
    path : '',
    component : LoginComponentComponent
  },
  {
    path : 'authenticate',
    component : AuthenticateComponent
  },
  {
    path : 'home',
    component : HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
