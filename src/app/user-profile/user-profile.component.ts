import { Component, OnInit, OnDestroy } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: any = {};
  favoriteMovies: any[] = [];
  editProfileForm: FormGroup;
  showEditForm = false;
  private userSubscription: Subscription | undefined;

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.editProfileForm = this.formBuilder.group({
      Username: ['', Validators.required],
      Password: [''],
      Email: ['', [Validators.required, Validators.email]],
      Birthday: [''],
    });
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Fetch the user details
   */
  getUserProfile(): void {
    this.userSubscription = this.fetchApiData.getUser().subscribe(
      (resp: any) => {
        this.user = resp;
        this.favoriteMovies = this.user.FavoriteMovies || [];
        this.editProfileForm.patchValue({
          Username: this.user.Username,
          Email: this.user.Email,
          Birthday: this.user.Birthday
            ? new Date(this.user.Birthday).toISOString().split('T')[0]
            : '',
        });
      },
      (error) => {
        this.snackBar.open('Error fetching user data', 'OK', {
          duration: 2000,
        });
        console.error('Error fetching user data:', error);
      }
    );
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm && this.user) {
      this.editProfileForm.patchValue({
        Username: this.user.Username,
        Email: this.user.Email,
        Birthday: this.user.Birthday
          ? new Date(this.user.Birthday).toISOString().split('T')[0]
          : '',
      });
    }
  }

  /**
   * Allow user to edit the profile details
   */
  editUser(): void {
    if (this.editProfileForm.valid) {
      const updatedUserData = this.editProfileForm.value;
      this.fetchApiData.editUser(updatedUserData).subscribe(
        (resp: any) => {
          this.user = resp;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.snackBar.open('Userdetails updated successfully', 'OK', {
            duration: 2000,
          });
          this.showEditForm = false;
          this.getUserProfile();
        },
        (error) => {
          this.snackBar.open('Error updating user details', 'OK', {
            duration: 2000,
          });
          console.error('Error updating user details:', error);
        }
      );
    }
  }

  /**
   * Allow user to delete the profile
   */
  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.fetchApiData.deleteUser().subscribe(
        (resp: any) => {
          console.log('User deleted:', resp);
          this.logoutUser();
        },
        (error) => {
          this.snackBar.open('Error deleting user', 'OK', { duration: 2000 });
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  /**
   * Function to allow the user to logout of profile
   */
  logoutUser(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  /**
   *
   * @param movieId
   * Function to allow user to delete a movie from the favorites list
   */
  deleteFavoriteMovie(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(
      (response: any) => {
        this.snackBar.open('Movie removed from favorites', 'OK', {
          duration: 2000,
        });
      },
      (error) => {
        this.snackBar.open('Error removing movie from favorites', 'OK', {
          duration: 2000,
        });
        console.error('Error removing favorite movie', error);
      }
    );
  }
}
