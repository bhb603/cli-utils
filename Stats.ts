export class Stats {
  data: number[] = [];

  private sorted = false;

  constructor() {}

  push(num: number): Stats {
    this.data.push(num);
    this.sorted = false;
    return this;
  }

  sort(): void {
    this.data.sort((a, b) => a - b);
    this.sorted = true;
  }

  get size(): number {
    return this.data.length;
  }

  get min(): number {
    if (this.size === 0) return NaN;

    if (!this.sorted) this.sort();

    return this.data[0];
  }

  get max(): number {
    if (this.size === 0) return NaN;

    if (!this.sorted) this.sort();

    return this.data[this.data.length - 1];
  }

  get mean(): number {
    const sum = this.data.reduce((acc, num) => acc + num, 0);
    return sum / this.data.length;
  }

  get median(): number {
    if (this.size === 0) return NaN;

    if (!this.sorted) this.sort();

    const isOdd = this.data.length % 2 !== 0;
    if (isOdd) {
      const mid = Math.floor(this.data.length / 2);
      return this.data[mid];
    }

    const mid = this.data.length / 2;
    return (this.data[mid - 1] + this.data[mid]) / 2;
  }

  histogram(bins: Bin[]): Bin[] {
    bins.sort((a, b) => a.max - b.max);

    this.data.forEach((num) => {
      for (const bin of bins) {
        if (num <= bin.max) {
          bin.increment();
          break;
        }
      }
    });

    return bins;
  }
}

export class Bin {
  count: number = 0;
  max: number;

  constructor(max: number) {
    this.max = max;
  }

  increment(): void {
    this.count++;
  }
}
