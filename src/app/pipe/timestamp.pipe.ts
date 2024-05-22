import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp',
  standalone: true
})
export class TimestampPipe implements PipeTransform {
  transform(value: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(value);
  }
}
