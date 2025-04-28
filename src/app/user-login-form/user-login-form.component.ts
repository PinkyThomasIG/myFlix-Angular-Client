import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // Save username and token to localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', result.user.Username);

        this.dialogRef.close(); // Close modal
        this.snackBar.open('Login successful!', 'OK', {
          duration: 2000,
        });

        this.router.navigate(['movies']);
      },
      (error) => {
        this.snackBar.open('Login failed. Check your credentials.', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
