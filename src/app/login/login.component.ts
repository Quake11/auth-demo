import { PhoneLoginComponent } from './phone-login/phone-login.component';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(public auth: AuthService, public dialog: MatDialog) {}

  ngOnInit() {}

  smsLogin() {
    this.dialog.open(PhoneLoginComponent, {
      id: 'phone-confirm'
    });
  }
}
