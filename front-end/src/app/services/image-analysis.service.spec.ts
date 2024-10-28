import { TestBed } from '@angular/core/testing';

import { ImageAnalysisService } from './image-analysis.service';

describe('ImageAnalysisService', () => {
  let service: ImageAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
