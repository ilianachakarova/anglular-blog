import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubredditModel } from '../subreddit/subreddit-response';

@Injectable({
  providedIn: 'root'
})
export class SubredditService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getAllSubreddits(): Observable<Array<SubredditModel>>{
    return this.http.get<Array<SubredditModel>>(this.baseUrl + 'api/subreddit')
  }

  createSubreddit(subredditModel: SubredditModel): Observable<SubredditModel>{
      return this.http.post<SubredditModel>(this.baseUrl + 'api/subreddit',subredditModel)
  }
}
