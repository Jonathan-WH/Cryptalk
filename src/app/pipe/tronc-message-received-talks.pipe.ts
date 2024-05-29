import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWords',
  standalone: true
})
export class TruncateWordsPipe implements PipeTransform {
  transform(value: string, limitWords: number, limitChars: number = 100): string {
    if (!value) {
      return '';
    }
    const words = value.split(' ');
    let truncated = '';

    if (words.length <= limitWords) {
      truncated = value;
    } else {
      truncated = words.slice(0, limitWords).join(' ') + '...';
    }

    if (truncated.length > limitChars) {
      truncated = truncated.slice(0, limitChars) + '...';
    }

    return truncated;
  }
}
