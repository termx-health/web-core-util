import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocalNamePipe} from './pipes/local-name.pipe';
import {LocalDatePipe} from './pipes/local-date.pipe';
import {LocalDateTimePipe} from './pipes/local-date-time.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {FilterPipe} from './pipes/filter-pipe';
import {KeysPipe} from './pipes/keys-pipe';
import {SearchPipe} from './pipes/search-pipe';
import {SlicePipe} from './pipes/slice-pipe';
import {TextSearchPipe} from './pipes/text-search-pipe';
import {LocalTimePipe} from './pipes/local-time.pipe';
import {SubstringPipe} from './pipes/substring-pipe';
import {AbbreviatePipe} from './pipes/abbreviate-pipe';
import {ApplyPipe} from './pipes/apply-pipe';
import {SortPipe} from './pipes/sort-pipe';
import {ValuesPipe} from './pipes/values-pipe';
import {FormattedPeriodPipe} from './pipes/formatted-period-pipe';
import {DistanceInWordsPipe} from './pipes/distance-in-words-pipe';
import {ReversePipe} from './pipes/reverse-pipe';
import {IncludesPipe} from './pipes/includes-pipe';
import {FormattedIntervalPipe} from './pipes/formatted-interval-pipe';
import {MaxPipe} from './pipes/max-pipe';
import {MapPipe} from './pipes/map-pipe';
import {ConcatPipe} from './pipes/concat-pipe';
import {SplitPipe} from './pipes/split-pipe';
import {InpurePipe} from './pipes/inpure-pipe';
import {MergePipe} from './pipes/merge-pipe';

const pipes = [
  LocalDatePipe,
  LocalDateTimePipe,
  LocalNamePipe,
  LocalTimePipe,
  FilterPipe,
  KeysPipe,
  ValuesPipe,
  SearchPipe,
  SlicePipe,
  TextSearchPipe,
  SubstringPipe,
  AbbreviatePipe,
  ApplyPipe,
  SortPipe,
  SplitPipe,
  ReversePipe,
  FormattedPeriodPipe,
  FormattedIntervalPipe,
  DistanceInWordsPipe,
  IncludesPipe,
  MaxPipe,
  LocalDatePipe,
  LocalDateTimePipe,
  LocalNamePipe,
  MapPipe,
  ConcatPipe,
  InpurePipe,
  MergePipe
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: pipes,
  exports: pipes
})
export class CorePipesModule {}
