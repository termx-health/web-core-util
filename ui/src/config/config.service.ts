import {Inject, Injectable, Optional} from '@angular/core';
import {map, Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {MUI_CONFIG, MUI_DEFAULT_CONFIG, MuiConfig, MuiConfigKey} from './config';
import {isDefined} from '@termx-health/core-util';


@Injectable({providedIn: 'root'})
export class MuiConfigService {
  private readonly _config: MuiConfig;
  private configUpdate$ = new Subject<keyof MuiConfig>();

  public constructor(@Optional() @Inject(MUI_CONFIG) defaultConfig?: MuiConfig) {
    this._config = defaultConfig || {};
  }

  public get config(): MuiConfig {
    return this._config;
  }

  public getConfigFor<T extends MuiConfigKey>(componentName: T): MuiConfig[T] {
    return this._config[componentName];
  }

  public getConfigChange<T extends MuiConfigKey>(componentName: T): Observable<MuiConfig[T]> {
    return this.configUpdate$.pipe(
      filter(n => n === componentName),
      map(() => this._config[componentName])
    );
  }

  public set<T extends MuiConfigKey>(componentName: T, value: MuiConfig[T]): void {
    this._config[componentName] = {...this._config[componentName], ...value};
    this.configUpdate$.next(componentName);
  }
}


export function WithConfig<T>() {
  return function ConfigDecorator(
    target: any,
    propName: any,
    originalDescriptor?: TypedPropertyDescriptor<T>
  ): any {
    const privatePropName = `$$__mConfigDecorator__${propName}`;

    Object.defineProperty(target, privatePropName, {
      configurable: true,
      writable: true,
      enumerable: false
    });

    return {
      get(): T | undefined {
        const originalValue = originalDescriptor?.get ? originalDescriptor.get.bind(this)() : this[privatePropName];
        const assignedByUser = (this.propertyAssignCounter?.[propName] || 0) > 0;
        const configValue = this.configService.getConfigFor(this._mModuleName)?.[propName] || MUI_DEFAULT_CONFIG[this._mModuleName]?.[propName];
        if (assignedByUser && isDefined(originalValue)) {
          return originalValue;
        } else {
          return isDefined(configValue) ? configValue : originalValue;
        }
      },
      set(value?: T): void {
        this.propertyAssignCounter = this.propertyAssignCounter || {};
        this.propertyAssignCounter[propName] = (this.propertyAssignCounter[propName] || 0) + 1;

        if (originalDescriptor?.set) {
          originalDescriptor.set.bind(this)(value!);
        } else {
          this[privatePropName] = value;
        }
      },
      configurable: true,
      enumerable: true
    };
  };
}
