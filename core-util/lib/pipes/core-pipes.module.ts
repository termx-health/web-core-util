import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbbreviatePipe} from './string/abbreviate.pipe';
import {ApplyPipe} from './common/apply.pipe';
import {ConcatPipe} from './array/concat.pipe';
import {DistanceInWordsPipe} from './date/distance-in-words.pipe';
import {FilterPipe} from './array/filter.pipe';
import {FormattedIntervalPipe} from './date/formatted-interval.pipe';
import {FormattedPeriodPipe} from './date/formatted-period.pipe';
import {IncludesPipe} from './array/includes.pipe';
import {InpurePipe} from './common/inpure.pipe';
import {JoinPipe} from './array/join.pipe';
import {KeysPipe} from './common/keys.pipe';
import {LocalDatePipe} from './date/local-date.pipe';
import {LocalDateTimePipe} from './date/local-date-time.pipe';
import {LocalTimePipe} from './date/local-time.pipe';
import {MapPipe} from './array/map.pipe';
import {MaxPipe} from './number/max.pipe';
import {MergePipe} from './array/merge.pipe';
import {MinPipe} from './number/min.pipe';
import {ReversePipe} from './string/reverse.pipe';
import {SearchPipe} from './search/search.pipe';
import {SlicePipe} from './array/slice.pipe';
import {SortPipe} from './array/sort.pipe';
import {SplitPipe} from './string/split.pipe';
import {SubstringPipe} from './string/substring.pipe';
import {TextSearchPipe} from './search/text-search.pipe';
import {ToBooleanPipe} from './convert/to-boolean.pipe';
import {ToNumberPipe} from './convert/to-number.pipe';
import {ToStringPipe} from './convert/to-string.pipe';
import {ValuesPipe} from './common/values.pipe';

const pipes = [
  AbbreviatePipe,
  ApplyPipe,
  ConcatPipe,
  DistanceInWordsPipe,
  FilterPipe,
  FormattedIntervalPipe,
  FormattedPeriodPipe,
  IncludesPipe,
  InpurePipe,
  JoinPipe,
  KeysPipe,
  LocalDatePipe,
  LocalDateTimePipe,
  LocalTimePipe,
  MapPipe,
  MaxPipe,
  MergePipe,
  MinPipe,
  ReversePipe,
  SearchPipe,
  SlicePipe,
  SortPipe,
  SplitPipe,
  SubstringPipe,
  TextSearchPipe,
  ToBooleanPipe,
  ToNumberPipe,
  ToStringPipe,
  ValuesPipe
];

@NgModule({
  imports: [CommonModule,],
  declarations: pipes,
  exports: pipes
})
export class CorePipesModule {
}
