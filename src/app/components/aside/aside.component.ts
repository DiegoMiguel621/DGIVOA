import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {
  isCollapsed: boolean = false;
  @Output() asideToggled = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const collapsedFromStorage = localStorage.getItem('asideCollapsed');
      if (collapsedFromStorage !== null) {
        this.isCollapsed = (collapsedFromStorage === 'true');
      }
    }
  }

  toggleAside(): void {
    this.isCollapsed = !this.isCollapsed;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('asideCollapsed', this.isCollapsed.toString());
    }
    this.asideToggled.emit(this.isCollapsed);
  }
}
