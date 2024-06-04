import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketCap',
  standalone: true
})
export class MarketCapPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 1e12) {
      return (value / 1e12).toFixed(2) + ' Trillion';
    } else if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + ' Billion';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + ' Million';
    } else {
      return value.toString();
    }
  }
}
