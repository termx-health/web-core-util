import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  public transform<T> (values: Array<T>, filter: any): Array<T> {
    if (!values) {
      return [];
    }
    if (!filter) {
      return values;
    }
    return values.filter(item => this.filterFn(item, filter));
  }

  public filterFn<T>(item: T, filter: any): boolean {
    return Object.keys(filter).every(key => {
      if (!filter[key]) {
        return true;
      }
      return key.split(',').some(path => this.matchesPath(item, path, filter[key]));
    });
  }

  private matchesPath(obj: any, path: string, needle: any): boolean {
    if (!obj) {
      return false;
    }
    if (path === '*') {
      return this.matchesDeep(obj, needle);
    }
    if (path.indexOf('.') >= 0) {
      const key = path.substring(0, path.indexOf('.'));
      const next = path.substring(path.indexOf('.') + 1);
      return this.matchesPath(obj[key], next, needle);
    }
    return this.matches(obj[path], needle);
  }

  private matchesDeep(obj: any, needle: any): boolean {
    if (typeof obj === 'string'){
      return this.matches(<string> obj, needle);
    }
    return Object.values(obj).some(val => {
      if (!val) {
        return false;
      }
      return typeof val === 'object' ? this.matchesDeep(val, needle) : this.matches(<string> val, needle);
    });
  }

  private matches(hay: string, needle: any): boolean {
    if (!hay) {
      return false;
    }
    if (typeof needle === 'string') {
      return this.matchesValue(hay, needle);
    }
    if (typeof needle === 'number') {
      return this.matchesValue(hay, String(needle));
    }
    if (needle.length === 0) {
      return true;
    }
    return needle.some(n => this.matchesValue(hay, n));
  }

  protected matchesValue(hay: any, needle: string): boolean {
    return hay && needle === String(hay);
  }

}
