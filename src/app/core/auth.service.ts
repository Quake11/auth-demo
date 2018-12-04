import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { firebase } from '@firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ApplicationVerifier } from '@firebase/auth-types';

interface User {
  uid: string;
  email: string;
  provider: string;
  phoneNumber?: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  phoneLogin(phone: string, verifier: ApplicationVerifier) {
    const provider = new firebase.auth.PhoneAuthProvider();
    return this.smsAuthLogin(provider, phone, verifier);
  }

  smsAuthLogin(provider, phone: string, verifier: ApplicationVerifier) {
    return this.afAuth.auth.signInWithPhoneNumber(phone, verifier);
  }

  verifySmsCode(confirmationResult, verificationCode) {
    return confirmationResult
      .confirm(verificationCode)
      .then(credential => {
        this.updateUserData(
          credential.user,
          credential.additionalUserInfo.providerId
        );
        this.router.navigate(['/']);
        return true;
      })
      .catch(error => {
        return false;
      });
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUserData(credential.user, provider.providerId);
      this.router.navigate(['/']);
    });
  }

  private updateUserData(user, providerId) {
    // Set user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      provider: providerId
    };

    return userRef.set(data, { merge: true });
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
