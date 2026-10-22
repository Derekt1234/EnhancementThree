import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { trips } from '../data/trips';
import { TripCardComponent } from '../trip-card/trip-card.component';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css',
  providers: [TripDataService]
})
export class TripListingComponent implements OnInit {
 // trips: Array<any> = trips; 
trips!: Trip[];
message: string = '';
page = 1;
totalPages = 0;


  constructor(
    private tripDataService: TripDataService, 
    private router: Router,
    private authenticationService: AuthenticationService 
    ) {
    console.log('trip-listing constructor');
   }
  
   public addTrip(): void {
    this.router.navigate(['/add-trip']);
   }
   private getStuff(page = 1): void {
      this.tripDataService.getTrips(page)
        .subscribe({
          next: (value) => {
            this.trips = value.trips;
            this.page = value.page;
            this.totalPages = value.totalPages;
            if(value.trips.length > 0)
            {
              this.message = 'There are ' + value.total + ' trips available.';
            }
            else{
              this.message = 'There were no trips retireved from the database';
            }
            console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
  }

  public changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getStuff(page);
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }

  public isLoggedIn()
  {
    return this.authenticationService.isLoggedIn();
  }
}
