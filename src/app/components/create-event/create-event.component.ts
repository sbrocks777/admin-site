import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventsService } from 'src/app/service/events.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CropperComponent } from 'angular-cropperjs';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnInit {
  @ViewChild('Poster') public angularCropperPoster: CropperComponent;
  @ViewChild('Banner') public angularCropperBanner: CropperComponent;

  isEditable = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  categories: Observable<any>;

  min: Date = new Date();

  /**
   *  Poster & bannber Configuration and Variable
   */
  poster: any;
  posterUrl: any;
  croppedPosterUrl: any;
  posterCroppingMode = false;
  posterSelected = false;

  banner: any;
  bannerUrl: any;
  croppedBannerUrl: any;
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

  constructor(
    private fb: FormBuilder,
    private eventService: EventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories = this.eventService.getCategories();
    this.firstFormGroup = this.fb.group({
      eventName: ['', [Validators.required]],
      eventDescription: ['', [Validators.required]],
      eventCategory: ['', [Validators.required]],
      eventStartDate: ['', [Validators.required]],
      eventEndDate: ['', [Validators.required]],
      eventStartTime: ['', [Validators.required]],
      eventEndTime: ['', [Validators.required]],
      eventSeatsLimit: ['', [Validators.required]],
      eventTicketPrice: ['', [Validators.required]],
      eventCity: ['', [Validators.required]],
    });

    this.secondFormGroup = this.fb.group({
      eventOrganizerName: ['', [Validators.required]],
      eventOrganizerEmail: ['', [Validators.required, Validators.email]],
      eventOrganizerPhoneNumber: [
        '',
        [Validators.required, Validators.minLength(10), 
         Validators.required, Validators.maxLength(10)],
      ],
      eventThumbnail: ['', [Validators.required]],
      eventBanner: ['', [Validators.required]],
      eventPaymentOption: ['', [Validators.required]],
    });
  }

  get ffgc(): any {
    return this.firstFormGroup['controls'];
  }

  get sfgc(): any {
    return this.secondFormGroup['controls'];
  }

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

  readFileAsync(file: any) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  }

  async getPoster(file: any) {
    this.posterCroppingMode = true;
    this.poster = file;
    this.posterUrl = await this.readFileAsync(file.target.files[0]);
  }

  async getBanner(file: any) {
    this.bannerCroppingMode = true;
    this.banner = file;
    this.bannerUrl = await this.readFileAsync(file.target.files[0]);
  }

  async createEvent() {
    if(this.firstFormGroup.valid && this.secondFormGroup.valid) {
      try {
        await this.eventService.createEvent(this.firstFormGroup.value, this.secondFormGroup.value)
        await this.eventService.uploadFile(this.croppedBannerUrl, 'banner');
        await this.eventService.uploadFile(this.croppedPosterUrl, 'poster');
      } catch (err) {
        console.log(err);
      }
    }
    this.router.navigate(['/dashboard']);
  }
}
