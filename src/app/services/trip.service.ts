import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private trips: Trip[] = [];
  private tripsSubject = new BehaviorSubject<Trip[]>([]);

  constructor() {}

  getTrips(): Observable<Trip[]> {
    return this.tripsSubject.asObservable();
  }

  addTrip(startPoint: string, endPoint: string): void {
    const newTrip: Trip = {
      id: this.trips.length + 1,
      startPoint,
      endPoint,
      level: this.determineLevel(startPoint, endPoint),
      isContinued: this.isContinuedTrip(startPoint)
    };

    this.trips.push(newTrip);
    this.tripsSubject.next([...this.trips]);
  }

  private determineLevel(startPoint: string, endPoint: string): number {
    if (this.trips.length === 0) return 1;

    // Check if the current trip has the same start and end points as any existing trip
    const hasSamePoints = this.trips.some(trip => 
      (trip.startPoint === startPoint && trip.endPoint === endPoint) ||
      (trip.startPoint === endPoint && trip.endPoint === startPoint)
    );

    if (hasSamePoints) return 2;

    // Check if it's a continued trip
    const lastTrip = this.trips[this.trips.length - 1];
    if (lastTrip.endPoint === startPoint) return 1;

    return 2;
  }

  private isContinuedTrip(startPoint: string): boolean {
    if (this.trips.length === 0) return false;
    const lastTrip = this.trips[this.trips.length - 1];
    return lastTrip.endPoint === startPoint;
  }
} 