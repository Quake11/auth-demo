import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WindowService } from '../../window.service';

import { firebase } from '@firebase/app';
// import { ApplicationVerifier, RecaptchaVerifier } from '@firebase/auth-types';
import { AuthService } from '../../core/auth.service';
import { MatDialog } from '@angular/material/dialog';

export class PhoneNumber {
  country = '+7';
  number: string;

  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.number;
    return `+${num}`;
  }
}

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent implements OnInit, AfterViewInit {
  windowRef: any;
  error: string;
  errorCount = 0;
  maxErrorCount = 3;

  phoneNumber = new PhoneNumber();
  verificationCode: string;

  confirmationResult: any;

  captchaSolved = false;

  constructor(
    private win: WindowService,
    public auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.windowRef = this.win.windowRef;
  }

  ngAfterViewInit() {
    this.initRecaptcha();
  }

  resetRecaptcha() {
    this.windowRef.grecaptcha.reset(this.windowRef.recaptchaWidgetId);
  }

  initRecaptcha() {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        callback: response => {
          this.captchaSolved = true;
          this.error = null;
        }
      }
    );

    this.windowRef.recaptchaVerifier.render().then(widgetId => {
      this.windowRef.recaptchaWidgetId = widgetId;
    });
  }

  async sendLoginCode() {
    if (this.captchaSolved) {
      this.error = null;
      const appVerifier = this.windowRef.recaptchaVerifier;
      const phoneNumber: string = this.phoneNumber.e164;

      this.confirmationResult = await this.auth.phoneLogin(
        phoneNumber,
        appVerifier
      );
    } else {
      this.error = 'Сначала пройдите проверку на робота!';
    }
  }

  async verifyCode(code) {
    const isLoggedIn = await this.auth.verifySmsCode(
      this.confirmationResult,
      code
    );

    if (isLoggedIn) {
      this.dialog.getDialogById('phone-confirm').close();
    } else {
      this.error = 'Неправильный код из СМС. Попробуйте ввести ещё раз.';
      this.errorCount++;
      if (this.errorCount >= 3) {
        this.confirmationResult = null;
        this.errorCount = 0;
        this.error = null;
        this.resetRecaptcha();
      }
    }
  }
}
