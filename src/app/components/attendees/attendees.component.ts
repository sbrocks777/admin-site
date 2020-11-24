import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from 'src/app/service/events.service';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.css'],
})
export class AttendeesComponent implements OnInit {
  displayedColumns: string[] = [
    'index',
    'fullName',
    'email',
    'joinDate',
    'action',
  ];
  dataSource: any[];
  id: string;
  event: any;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.eventService
      .getEventByID(this.id)
      .subscribe((d: any) => (this.event = { ...d, id: this.id }));
    this.eventService.getAttendees(this.id).subscribe((d) => {
      this.dataSource = d;
    });
  }

  updateFeesStatus(element: string) {
    this.eventService.updateFeesStatus(element);
  }

  exportData() {
    this.eventService.exportData(this.event);
  }
}
