import {
  HttpClient,
  HttpClientModule,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, PostData } from './data.model';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient) {}

  createandStorePosts(title: string, content: string) {
    const postData: PostData = { title: title, content: content };

    this.http
      .post(
        'https://ng-complete-guide-2c1f6-default-rtdb.firebaseio.com/post.json',
        postData,
        {
          observe: 'response',
        }
      )
      .subscribe(
        (responseData) => {
          console.log('responseData in Post Service', responseData);
        },
        (error) => {
          console.log('Error Message', error.message);
        }
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://ng-complete-guide-2c1f6-default-rtdb.firebaseio.com/post.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          params: new HttpParams().set('print', 'pretty'),
        }
      )
      .pipe(
        map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({ ...responseData[key], id: key });
            }
          }
          return postArray;
        }),
        catchError((errorRes) => {
          console.log('Throw Error', errorRes);
          return throwError(errorRes);
        })
      );
  }

  clearPosts() {
    return this.http
      .delete(
        'https://ng-complete-guide-2c1f6-default-rtdb.firebaseio.com/post.json',
        {
          observe: 'events',
          responseType:'text'
        }
      )
      .pipe(
        tap((event) => {
          console.log("Event",event);
          if(event.type=== HttpEventType.Response){
            console.log("Event Body",event.body)
          }
        })
      );
  }
}
