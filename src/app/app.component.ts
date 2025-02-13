import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post, PostData } from './data.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  isLoading = false;
  isError = null;

  constructor(private http: HttpClient, private postService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.fetchPosts().subscribe((posts) => {
      this.isLoading = false;
      this.loadedPosts = posts;
    });
  }

  onCreatePost(postData: PostData) {
    this.postService.createandStorePosts(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isLoading = true;
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isLoading = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isError = error;
      }
    );
  }

  onClearPosts() {
    this.postService.clearPosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }
}
