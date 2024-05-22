import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor() {}

  scrollToBottom(element: ElementRef): void {
    try {
      element.nativeElement.scrollTop = element.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom failed', err);
    }
  }
}
