import {async} from '@angular/core/testing';
import {LocalNameService} from '../../services/local-name.service';

describe('LocalNamePipe', () => {
    const translateService = jasmine.createSpyObj('TranslateService', ['currentLang']);
    translateService['currentLang'] = 'en';
    const pipe = new LocalNameService(translateService);

  it('localname tests', async(() => {
    expect(pipe.transform(undefined, 'def')).toBe('def');
    expect(pipe.transform('aaa', 'def')).toBe('aaa');
    expect(pipe.transform({'en': 'en', 'et': 'et'}, 'def')).toBe('en');
    expect(pipe.transform({'et': 'et'}, 'def')).toBe('et');
  }));

});
