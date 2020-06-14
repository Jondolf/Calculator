import { Component, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrls: ['./accordion-list.component.scss'],
})
export class AccordionListComponent implements AfterViewInit {
  @Input() listName: string;
  @Input() iconName: string;
  @ViewChild('accordionlist', { read: ElementRef }) accordionListRef: ElementRef;

  isCollapsed = false;
  listItems: HTMLElement[];
  listHeight = '0px';

  constructor(public cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.listItems = this.getChildren();
    this.listHeight = this.listItems.length * 48 + 'px';
    this.isCollapsed = true;
    this.cd.detectChanges(); // avoid lifecycle problem
  }

  getChildren(): HTMLElement[] {
    const parentElement = this.accordionListRef.nativeElement;
    const children = parentElement.childNodes;
    return children;
  }
}
