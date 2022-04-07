import {async} from '@angular/core/testing';
import {LocalHumanNamePipe} from './local-human-name.pipe';

describe('LocalHumanName', () => {
  it('should convert et names', async(() => {
    const translateService = jasmine.createSpyObj('TranslateService', ['currentLang']);
    translateService['currentLang'] = 'et';
    const pipe = new LocalHumanNamePipe(translateService);

    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform({})).toBe('');
    expect(pipe.transform({def: undefined})).toBe('');
    expect(pipe.transform({def: {}})).toBe('');
    expect(pipe.transform({def: {text: 'Pupkin, Vasja'}})).toBe('Pupkin, Vasja');
    expect(pipe.transform({def: {text: 'Pupkin, Vasja', family: 'Pupkin', given: 'Vasja'}})).toBe('Vasja Pupkin');
  }));

  it('should not convert en names', async(() => {
    const translateService = jasmine.createSpyObj('TranslateService', ['currentLang']);
    translateService['currentLang'] = 'en';
    const pipe = new LocalHumanNamePipe(translateService);
    expect(pipe.transform({def: {text: 'Pupkin, Vasja', family: 'Pupkin', given: 'Vasja'}})).toBe('Pupkin, Vasja');
  }));

});
