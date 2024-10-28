import { Component } from '@angular/core';
import { ImageAnalysisService } from '../../services/image-analysis.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css',
})
export class ImageUploaderComponent {
  languages: string[] = [];
  selectedFiles: File[] = [];
  previewUrls: any[] = [];
  responseFromServer: any[] = [];

  constructor(
    private imageAnalysisService: ImageAnalysisService,
    private sanitizer: DomSanitizer
  ) {}

  onFileSelect(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    this.previewUrls = this.selectedFiles.map((file) =>
      this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))
    );
  }

  onLanguageChange(event: any) {
    this.languages = event.target.value.split(','); // Cambia le lingue, separandole da una stringa
    console.log(this.languages);
  }

  uploadImages() {
    if (this.selectedFiles.length === 0) {
      alert('Seleziona almeno un file');
      return;
    }

    this.imageAnalysisService
      .uploadImages(this.selectedFiles, this.languages)
      .subscribe(
        (response) => {
          console.log('Success:', response);
          alert('Immagini caricate e analizzate con successo!');
          this.responseFromServer = response;
        },
        (error) => {
          console.error("Errore durante l'upload:", error);
          alert("Errore durante l'upload delle immagini");
        }
      );
  }

  displayResults(response: any) {
    // Puoi mostrare i risultati con template dinamici
    alert(`Analisi completata: ${JSON.stringify(response)}`);
  }
}
