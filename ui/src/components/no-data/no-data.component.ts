import {Component} from '@angular/core';

@Component({
  standalone: false,
  selector: 'm-no-data',
  template: `
    <div style="width: 4rem; margin: auto">
      <svg x="0px" y="0px" viewBox="0 0 64 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 41C49.6731 41 64 37.866 64 34C64 30.134 49.6731 27 32 27C14.3269 27 0 30.134 0 34C0 37.866 14.3269 41 32 41Z" fill="#F5F5F5"/>
        <path d="M55 13.7606L44.8543 2.2574C44.3674 1.47383 43.6559 1 42.9068 1H21.0932C20.3441 1 19.6326 1.47395 19.1457 2.2574L9 13.7606L9 23H55V13.7606Z" stroke="#D9D9D9"/>
        <path d="M41.6133 16.9315C41.6133 15.3259 42.607 14.0002 43.8397 14H55V32.1371C55 34.259 53.6794 36 52.0504 36H11.9496C10.3205 36 9 34.2588 9 32.1371V14H20.1603C21.393 14 22.3867 15.3228 22.3867 16.9285V16.9496C22.3867 18.5553 23.3917 19.8512 24.6245 19.8512H39.3755C40.6083 19.8512 41.6133 18.5434 41.6133 16.9377V16.9315Z" fill="#FAFAFA" stroke="#D9D9D9"/>
      </svg>
      <p>{{'marina.ui.noData' | i18n}}</p>
    </div>
  `,
  host: {
    class: 'm-no-data'
  }
})
export class MuiNoDataComponent {
}
