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

  isCollapsed = false;
  listItems: HTMLElement[];
  listHeight = '0px';

  // Set in ngAfterViewInit
  styles = {
    background: '',
    color: ''
  };

  constructor(public cd: ChangeDetectorRef) {

  }

  ngAfterViewInit() {
    this.styles.background = this.background;
    this.styles.color = this.textColor;

    this.listItems = this.getChildren();
    this.listHeight = (this.listItems.length - 1) * 48 + 'px';
    this.isCollapsed = this.isCollapsedByDefault ? this.isCollapsedByDefault : false;
    this.cd.detectChanges(); // A!void lifecycle problem
  }

  getChildren(): HTMLElement[] {
    const parentElement = this.accordionListRef.nativeElement;
    const children = parentElement.childNodes;
    return children;
  }
}
