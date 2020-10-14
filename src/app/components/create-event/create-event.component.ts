import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventsService } from 'src/app/service/events.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  isEditable = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  categories: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private eventSevice: EventsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.categories = this.eventSevice.getCategories();
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
      eventOrganizerEmail: ['', [Validators.required, Validators.email]],
      eventOrganizerPhoneNumber: ['', [Validators.required, Validators.minLength(10)]],
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

  createEvent() {
    this.eventSevice.createEvent(this.firstFormGroup.value, this.secondFormGroup.value)
    .then(() => {
      this.router.navigate(['/dashboard']);
    })
    .catch(err => alert(err.message));
  }
}
