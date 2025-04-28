import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movieflix-application-717006838e7d.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * @param userDetails
   * Making the api call for the user registration endpoint
   */

  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  //User login

  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies')
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get one movie by title
  public getOneMovie(title: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + title)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get director by name
  public getDirector(name: string): Observable<any> {
    return this.http
      .get(apiUrl + 'directors/' + name)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get genre by name
  public getGenre(name: string): Observable<any> {
    return this.http
      .get(apiUrl + 'genres/' + name)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get user
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + username)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get favorite movies for a user
  public getFavoriteMovies(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + username + '/movies')
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Add a movie to favorite movies
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(apiUrl + 'users/' + username + '/movies/' + movieId, null)
      .pipe(catchError(this.handleError));
  }

  // Edit user
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + username, userDetails)
      .pipe(catchError(this.handleError));
  }

  // Delete user
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username)
      .pipe(catchError(this.handleError));
  }

  // Delete a movie from the favorite movies
  public removeFavoriteMovie(
    username: string,
    movieId: string
  ): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieId)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
