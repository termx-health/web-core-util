import {Pipe, PipeTransform} from '@angular/core';
import {LocalNameService} from '../../services/local-name.service';

@Pipe({ name: 'localName' })
export class LocalNamePipe implements PipeTransform {
  constructor(private localNameService: LocalNameService) {}

  transform(value: any, defaultValue?: string): string {
    return this.localNameService.transform(value, defaultValue);
  }
}
