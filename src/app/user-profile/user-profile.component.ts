import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  loading: boolean = true;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.user.subscribe(() => (this.loading = false));
  }
}
