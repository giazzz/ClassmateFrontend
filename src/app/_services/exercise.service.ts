import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Exercise} from '../_models/exercise';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {PostExerciseModel} from '../_models/request/post-exercise-model';
import {UpdateExerciseModel} from '../_models/request/update-exercise-model';

@Injectable()
export class ExerciseService {
    constructor(private _http: HttpClient) {
    }

    public getAllExercisesAsync(): Observable<Exercise[]> {
        return this._http.get<Exercise[]>(`${environment.apiUrl}/data/exercise/all`);
    }

    public getAnExerciseAsync(id: number): Observable<Exercise[]> {
        return this._http.get<Exercise[]>(`${environment.apiUrl}/data/exercise/detail?${id}`);
    }

    public updateStatusAsync(id: number, status: number): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}/data/exercise/updateStatus?${id}&${status}`, {});
    }

    public updateExerciseAsync(id: number, updateExerciseModel: UpdateExerciseModel): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}api/data/exercise/edit?${id}`, updateExerciseModel);
    }

    public postExerciseAsync(exerciseId: number, postExercise: PostExerciseModel): Observable<any> {
        return this._http.post<any>(`${environment.apiUrl}/data/exercise/postStudentExercise?${exerciseId}`, postExercise);
    }
}
