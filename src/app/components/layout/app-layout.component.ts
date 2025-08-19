import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-layout',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
	templateUrl: './app-layout.component.html',
	styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
	isCollapsed = false;

	toggleSidebar() {
		this.isCollapsed = !this.isCollapsed;
		localStorage.setItem('sidebarCollapsed', String(this.isCollapsed));
	}

	ngOnInit() {
		const saved = localStorage.getItem('sidebarCollapsed');
		this.isCollapsed = saved === 'true';
	}
}
