import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recentFirst',
  standalone: true
})
export class RecentFirstPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!Array.isArray(array)) {
      return [];
    }
    return array.sort((a: any, b: any) => {
      const dateA = new Date(a[field]);
      const dateB = new Date(b[field]);
      return dateB.getTime() - dateA.getTime(); // Du plus récent au plus ancien
    });
  }
}
