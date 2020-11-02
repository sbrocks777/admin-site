import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CropperComponent, ImageCropperResult } from 'angular-cropperjs';

@Component({
  selector: 'app-imgup',
  templateUrl: './imgup.component.html',
  styleUrls: ['./imgup.component.css'],
})
export class ImgupComponent implements OnInit {
  @ViewChild('Image') public angularCropperImage: CropperComponent;

  @Output() file: EventEmitter<any> = new EventEmitter();
  /**
   *  Poster & bannber Configuration and Variable
   */

  image: any;
  imageUrl: any;
  croppedImageUrl: any;
  imageCroppingMode = false;
  imageSelected = false;

  posterConfig = {
    aspectRatio: 16 / 9,
    dragMode: 'move',
    background: true,
    movable: true,
    rotatable: true,
    scalable: true,
    zoomable: true,
    viewMode: 1,
    checkImageOrigin: true,
    checkCrossOrigin: true,
  };

  constructor() {}

  ngOnInit(): void {}

  cropImage(event) {
    event.preventDefault();
    // this.resultResult = this.angularCropper.imageUrl;
    // this.resultImage = this.angularCropper.cropper.getCroppedCanvas()
    // console.log(this.resultImage);
    //this.angularCropper.exportCanvas();
    this.imageSelected = true;
    this.imageCroppingMode = false;
    this.croppedImageUrl = this.angularCropperImage.cropper
      .getCroppedCanvas()
      .toDataURL('image/webp', 0.3);
    this.file.emit(this.croppedImageUrl);
  }

  /*  croppedPoster(event: ImageCropperResult) {
    this.croppedPosterUrl = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg');
  } */

  /* croppedBanner(event: ImageCropperResult) {
    this.croppedBannerUrl = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg');
  } */

  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  }

  async getImage(file) {
    this.imageCroppingMode = true;
    this.image = file;
    this.imageUrl = await this.readFileAsync(file.target.files[0]);
  }
}
