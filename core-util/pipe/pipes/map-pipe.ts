import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'map'
})
export class MapPipe implements PipeTransform {

  public transform(values: Array<any>, mapper: string | ((f: any, arg: any) => boolean), fnArg?: any): Array<any> {
    if (!mapper) {
      return values;
    }
    if (!values) {
      return values;
    }
    return values.map((item) => {
      return typeof mapper === 'string' ? this.getValue(item, mapper) : mapper(item, fnArg);
    });
  }

  private getValue(o: any, path: string): any {
    if (o === undefined) {
      return undefined;
    }
    if (path.indexOf('.') >= 0) {
      const key = path.substring(0, path.indexOf('.'));
      const next = path.substring(path.indexOf('.') + 1);
      return this.getValue(o[key], next);
    }
    return o[path];
  }

}
