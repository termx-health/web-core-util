import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment/moment';

@Pipe({
  name: 'formattedAge'
})
export class FormattedAgePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

  //MPI.F01 function implementation
  public transform(start: Date, end?: Date): string {
    if (!start) {
      return '';
    }
    const startDate = new Date(start);
    end = end || new Date();

    const years = moment(end).diff(start, 'years');
    startDate.setFullYear(startDate.getFullYear() + years);
    const months = moment(end).diff(startDate, 'months');
    startDate.setMonth(startDate.getMonth() + months);
    const days = moment(end).diff(startDate, 'days');

    //TODO: observable
    const yearsText = this.translateService.instant('core.period.years');
    const monthsText = this.translateService.instant('core.period.months');
    const daysText = this.translateService.instant('core.period.days');

    if (years === 0) {
      return `${years}${yearsText} ${months}${monthsText} ${days}${daysText}`;
    }
    if (years <= 2) {
      return `${years}${yearsText} ${months}${monthsText}`;
    }
    return `${years}${yearsText}`;
  }

}
