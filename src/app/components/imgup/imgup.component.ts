import { Component, OnInit, ViewChild } from '@angular/core';
import { CropperComponent, ImageCropperResult } from 'angular-cropperjs';

@Component({
  selector: 'app-imgup',
  templateUrl: './imgup.component.html',
  styleUrls: ['./imgup.component.css'],
})
export class ImgupComponent implements OnInit {
  @ViewChild('Poster') public angularCropperPoster: CropperComponent;
  @ViewChild('Banner') public angularCropperBanner: CropperComponent;

  /**
   *  Poster & bannber Configuration and Variable
   */

  poster;
  posterUrl;
  croppedPosterUrl;
  posterCroppingMode = false;
  posterSelected = false;

  banner;
  bannerUrl;
  croppedBannerUrl;
  bannerCroppingMode = false;
  bannerSelected = false;

  posterConfig = {
    aspectRatio: 2 / 3,
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

  bannerConfig = {
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

  cropPoster(event) {
    event.preventDefault();
    // this.resultResult = this.angularCropper.imageUrl;
    // this.resultImage = this.angularCropper.cropper.getCroppedCanvas()
    // console.log(this.resultImage);
    //this.angularCropper.exportCanvas();
    this.posterSelected = true;
    this.posterCroppingMode = false;
    this.croppedPosterUrl = this.angularCropperPoster.cropper
      .getCroppedCanvas()
      .toDataURL('image/webp', 0.3);
  }

  /*  croppedPoster(event: ImageCropperResult) {
    this.croppedPosterUrl = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg');
  } */

  cropBanner(event) {
    event.preventDefault();
    // this.resultResult = this.angularCropper.imageUrl;
    // this.resultImage = this.angularCropper.cropper.getCroppedCanvas()
    // console.log(this.resultImage);
    this.bannerSelected = true;
    this.bannerCroppingMode = false;
    this.croppedBannerUrl = this.angularCropperBanner.cropper
      .getCroppedCanvas()
      .toDataURL('image/webp', 0.3);
  }

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

  async getPoster(file) {
    this.posterCroppingMode = true;
    this.poster = file;
    this.posterUrl = await this.readFileAsync(file.target.files[0]);
  }
}
