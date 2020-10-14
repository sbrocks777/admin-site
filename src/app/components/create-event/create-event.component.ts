import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  isEditable = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      eventName: ['', [Validators.required]],
      eventDescription: ['', [Validators.required]],
      eventCategory: ['', [Validators.required]],
      eventStartDate: ['', [Validators.required]],
      eventEndDate: ['', [Validators.required]],
      eventStartTime: ['', [Validators.required]],
      eventEndTime: ['', [Validators.required]],
      eventSeatsLimit: ['', [Validators.required]],
      eventCity: ['', [Validators.required]],
    })

    this.secondFormGroup = this.fb.group({
      eventOrganizerName: ['', [Validators.required]],
      eventOrganizerEmail: ['', [Validators.required]],
      eventOrganizerPhoneNumber: ['', [Validators.required]],
      eventThumbnail: ['', [Validators.required]],
      eventBanner: ['', [Validators.required]],
      eventPaymentOption: ['', [Validators.required]]
    })
  }

  get ffgc(): any {
    return this.firstFormGroup['controls'];
  }

  get sfgc(): any {
    return this.secondFormGroup['controls'];
  }

  onSubmit() {

  }
}
