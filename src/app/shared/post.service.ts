import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostModel } from './post-model';
import { CreatePostPayload } from '../post/create-post/create-post-payload';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<Array<PostModel>>{
      return this.http.get<Array<PostModel>>(this.baseUrl + '/api/posts/');
  }

  createPost(postPayload: CreatePostPayload): Observable<any> {
    return this.http.post(this.baseUrl + '/api/posts/', postPayload);
  }
}
