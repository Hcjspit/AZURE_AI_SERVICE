import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageAnalysisService {
  private apiUrl = 'http://localhost:3000/api/analyze';

  constructor(private http: HttpClient) {}

  uploadImages(images: File[], languages: string[]): Observable<any> {
    const formData: FormData = new FormData();

    images.forEach((image) => {
      formData.append('images', image, image.name);
    });
    formData.append('languages', languages.join(','));
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }
}
