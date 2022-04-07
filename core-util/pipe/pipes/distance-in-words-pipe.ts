import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment/moment';

@Pipe({
  name: 'distanceInWords'
})
export class DistanceInWordsPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {

  }

  public transform(date: Date): string {
    const moreThan = this.translateService.instant('core.pipe.distance-in-words.more-than');
    const distanceDate = moment(new Date()).diff(date, 'days');

    if (distanceDate === 0) {
      return this.translateService.instant('core.pipe.distance-in-words.today');
    }
    if (distanceDate === 1) {
      return this.translateService.instant('core.pipe.distance-in-words.yesterday');
    }
    if (distanceDate > 1 && distanceDate <= 7) {
      const days = this.translateService.instant('core.pipe.distance-in-words.days');
      return `${distanceDate} ${days}`;
    }
    if (distanceDate > 7 && distanceDate <= 30) {
      const weeks = this.translateService.instant('core.pipe.distance-in-words.weeks');
      return `${moreThan} ${Math.round(distanceDate / 7)} ${weeks}`;
    }
    if (distanceDate > 30 && distanceDate < 365) {
      const months = this.translateService.instant('core.pipe.distance-in-words.months');
      return `${moreThan} ${Math.round(distanceDate / 30)} ${months}`;
    }
    return this.translateService.instant('core.pipe.distance-in-words.year');
  }

}
