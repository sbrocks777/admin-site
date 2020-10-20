import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/service/events.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['index', 'eventName', 'isActive', 'isFeatured', 'action'];
  dataSource: any[];

  constructor(private es: EventsService) {}

  ngOnInit(): void {
    this.es.getAllEvents().subscribe(d => this.dataSource = d)
  }

  updateIsActive(element: any) {
    this.es.updateIsActive(element.id, element.isActive);
  }

  updateIsFeatured(element: any) {
    this.es.updateIsFeatured(element.id, element.isFeatured);
  }

  delete(element: any) {
    alert(element.id);
  }
}
