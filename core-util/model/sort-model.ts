export class SortModel {
  public key: string;
  public direction: 'ascend' | 'descend';

  public static of(key: string, direction: 'ascend' | 'descend'): SortModel {
    const r = new SortModel();
    r.key = key;
    r.direction = direction;
    return r;
  }

  public toggleSort(key: string): void {
    if (this.key !== key) {
      this.key = key;
      this.direction = 'ascend';
      return;
    }
    if (this.direction === 'ascend') {
      this.direction = 'descend';
      return;
    }
    if (this.direction === 'descend') {
      this.key = null;
      this.direction = null;
    }
  }
}
