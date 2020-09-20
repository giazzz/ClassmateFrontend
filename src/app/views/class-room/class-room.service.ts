import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClassRoomService {
    headers = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/json');
    }

    getAllCourse() {
        return this.http.get<any>(`${environment.apiUrl}/data/course/all`,
            { observe: 'response' });
    }

    getAllPostByCourseId(course_id: string) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/post/all`,
            { params, observe: 'response' });
    }

    getPostDetail(postId: string) {
        let params = new HttpParams();
        params = params.append('id', postId);
        return this.http.get<any>(`${environment.apiUrl}/data/post/detail`,
            { params, observe: 'response' });
    }

    getAllCmtbyPostId(post_id: string) {
        let params = new HttpParams();
        params = params.append('post_id', post_id);
        return this.http.get<any>(`${environment.apiUrl}/data/comment/all`,
            { params, observe: 'response' });
    }

    addCmtToPost(post_id, objCmt) {
        let params = new HttpParams();
        params = params.append('post_id', post_id);
        return this.http.post<any>(`${environment.apiUrl}/data/comment/post`,
            objCmt, { params, observe: 'response' });
    }

    addPost(objPost, course_id) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.post<any>(`${environment.apiUrl}/data/post/save`,
            objPost, { params, observe: 'response' });
    }

    updatePost(objPost, post_id) {
        let params = new HttpParams();
        params = params.append('post_id', post_id);
        return this.http.post<any>(`${environment.apiUrl}/data/post/edit`,
            objPost, { params, observe: 'response' });
    }

    uploadFile(lstFile: File[]) {
        const headers = new HttpHeaders();
        headers.set('Content-Type', null);
        headers.set('Accept', 'multipart/form-data');
        const formdata: FormData = new FormData();
        lstFile.forEach(file => {
            formdata.append('uploadFiles', file);
        });
        return this.http.post<any>(`${environment.apiUrl}/data/upload/googleDrive`,
        formdata, { headers, observe: 'response' });
    }

    deletePost(postId) {
        return this.http.post<any>(`${environment.apiUrl}/data/post/delete?id=${postId}`,
            { observe: 'response' });
    }

    deleteCmt(cmtId) {
        return this.http.post<any>(`${environment.apiUrl}/data/comment/delete?id=${cmtId}`,
            { observe: 'response' });
    }

    updateCmt(comment_id: string, objCmt) {
        let params = new HttpParams();
        params = params.append('comment_id', comment_id);
        return this.http.post<any>(`${environment.apiUrl}/data/comment/edit`,
            objCmt, { params, observe: 'response' });
    }

    getAllExcerciseByCourseId(course_id: string) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/exercise/all`,
            { params, observe: 'response' });
    }

    updateCourse(course_id, objUpdate) {
        let params = new HttpParams();
        params = params.append('id', course_id);
        return this.http.post<any>(`${environment.apiUrl}/data/course/edit`,
        objUpdate, { params, observe: 'response' });
    }

    updateCourseStatus(course_id) {
        return this.http.post<any>(`${environment.apiUrl}/data/course/updateStatus?id=${course_id}&status=ONGOING`,
            { observe: 'response' });
    }

    getAllProfileInCourse(course_id) {
        let params = new HttpParams();
        params = params.append('course_id', course_id);
        return this.http.get<any>(`${environment.apiUrl}/data/course/allProfileInCourse`,
            { params, observe: 'response' });
    }

}
