import { Component, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrls: ['./accordion-list.component.scss'],
})
export class AccordionListComponent implements AfterViewInit {
  @Input() isCollapsedByDefault: boolean;

  @Input() listName: string;
  @Input() iconName: string;

  @Input() background: string;
  @Input() textColor: string;

  @ViewChild('accordionlist', { read: ElementRef }) accordionListRef: ElementRef;
  accordionListElement: HTMLElement;

  isCollapsed = false;
  listItems: HTMLElement[];

  // Set in ngAfterViewInit
  styles = {
    background: '',
    color: ''
  };

  constructor(public cd: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.accordionListElement = this.accordionListRef.nativeElement;

    this.styles.background = this.background;
    this.styles.color = this.textColor;

    this.isCollapsed = this.isCollapsedByDefault ? this.isCollapsedByDefault : false;
    this.accordionListElement.style.height = this.isCollapsed ? '0px' : 'auto';
    this.cd.detectChanges(); // Avoid lifecycle problem
  }

  collapse() {
    const elementHeight = this.accordionListElement.scrollHeight;
    const elementTransition = this.accordionListElement.style.transition;
    this.accordionListElement.style.transition = '';
    // On the next frame set the pixel height and transition
    requestAnimationFrame(() => {
      this.accordionListElement.style.height = elementHeight + 'px';
      this.accordionListElement.style.transition = elementTransition;

      // On the next frame set height to 0px with the previously set transition.
      requestAnimationFrame(() => {
        this.accordionListElement.style.height = '0px';
      });
    });

    this.isCollapsed = true;
  }

  expand() {
    const elementHeight = this.accordionListElement.scrollHeight;
    this.accordionListElement.style.height = elementHeight + 'px';

    this.accordionListElement.addEventListener('transitionend', function onTransitionEnd(e: TransitionEvent) {
      const eventTarget = e.target as HTMLElement;
      // Remove to make it trigger once
      eventTarget.removeEventListener('transitionend', onTransitionEnd);

      // Remove "height" from the element's inline styles, so it can return to its initial value
      eventTarget.style.height = null;
    });

    this.isCollapsed = false;
  }

  getChildren(): HTMLElement[] {
    const parentElement = this.accordionListRef.nativeElement;
    const children = parentElement.childNodes;
    return children;
  }
}
