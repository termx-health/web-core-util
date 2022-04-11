import {SearchPipe, TextSearchPipe} from '../pipe';

const instance = new SearchPipe();
const textInstance = new TextSearchPipe();

export const filterFn = (item: any, filter: any) => instance.filterFn(item, filter);
export const textFilterFn = (item: any, filter: any) => textInstance.filterFn(item, filter);
export const textFilter = (item: any, text: string) => textFilterFn(item, {'*': text});
