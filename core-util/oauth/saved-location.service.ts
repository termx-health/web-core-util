import {Location} from '@angular/common';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SavedLocationService {
  // Does not really have to be prefixed as the data is very short-lived.
  SAVED_LOCATION = 'oauth-saved-location';

  constructor(private location: Location) {}

  public saveCurrentLocation() {
    sessionStorage.setItem(this.SAVED_LOCATION, this.location.path());
  }

  public restoreLocation() {
    const savedLocation = sessionStorage.getItem(this.SAVED_LOCATION);
    if (savedLocation) {
      sessionStorage.removeItem(this.SAVED_LOCATION);
      this.location.go(savedLocation);
    } 
  }
}
