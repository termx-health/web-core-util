import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConcatPipe} from './array/concat.pipe';
import {FilterPipe} from './array/filter.pipe';
import {IncludesPipe} from './array/includes.pipe';
import {MapPipe} from './array/map.pipe';
import {MaxPipe} from './number/max.pipe';
import {MergePipe} from './array/merge.pipe';
import {SlicePipe} from './array/slice.pipe';
import {SortPipe} from './array/sort.pipe';
import {DistanceInWordsPipe} from './date/distance-in-words.pipe';
import {FormattedIntervalPipe} from './date/formatted-interval.pipe';
import {FormattedPeriodPipe} from './date/formatted-period.pipe';
import {LocalDatePipe} from './date/local-date.pipe';
import {LocalDateTimePipe} from './date/local-date-time.pipe';
import {LocalTimePipe} from './date/local-time.pipe';
import {ApplyPipe} from './common/apply.pipe';
import {InpurePipe} from './common/inpure.pipe';
import {KeysPipe} from './common/keys.pipe';
import {ValuesPipe} from './common/values.pipe';
import {SearchPipe} from './search/search.pipe';
import {TextSearchPipe} from './search/text-search.pipe';
import {AbbreviatePipe} from './string/abbreviate.pipe';
import {ReversePipe} from './string/reverse.pipe';
import {SplitPipe} from './string/split.pipe';
import {SubstringPipe} from './string/substring.pipe';
import {JoinPipe} from './array/join.pipe';
import {MinPipe} from './number/min.pipe';

const pipes = [
  ConcatPipe,
  FilterPipe,
  IncludesPipe,
  MapPipe,
  MaxPipe,
  MinPipe,
  MergePipe,
  SlicePipe,
  SortPipe,
  JoinPipe,

  DistanceInWordsPipe,
  FormattedIntervalPipe,
  FormattedPeriodPipe,
  LocalDatePipe,
  LocalDateTimePipe,
  LocalTimePipe,

  ApplyPipe,
  InpurePipe,
  KeysPipe,
  ValuesPipe,

  SearchPipe,
  TextSearchPipe,

  AbbreviatePipe,
  ReversePipe,
  SplitPipe,
  SubstringPipe
];

@NgModule({
  imports: [CommonModule,],
  declarations: pipes,
  exports: pipes
})
export class CorePipesModule {
}
