import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-card',
  imports: [],
  templateUrl: './text-card.component.html',
  styles: ``,
})
export class TextCardComponent {
  title = input.required<string>();
  description = input.required<string>();
  icon = input.required<string>();
}
