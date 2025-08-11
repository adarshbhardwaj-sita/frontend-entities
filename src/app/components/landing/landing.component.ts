import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  entities = [
    {
      title: 'Employee',
      description: 'Manage employee information, profiles, and personal details',
      icon: 'fas fa-users',
      route: '/employee'
    },
    {
      title: 'Budget Category',
      description: 'Organize and manage budget allocations and financial categories',
      icon: 'fas fa-chart-pie',
      route: '/budget-category'
    },
    {
      title: 'Journey',
      description: 'Track career paths, development, and professional growth',
      icon: 'fas fa-route',
      route: '/journey'
    },
    {
      title: 'Grade',
      description: 'Define job grades, levels, and hierarchical structures',
      icon: 'fas fa-layer-group',
      route: '/grade'
    },
    {
      title: 'Role',
      description: 'Configure roles, permissions, and responsibilities',
      icon: 'fas fa-user-tag',
      route: '/role'
    },
    {
      title: 'Technologies',
      description: 'Manage technical skills, tools, and technology stacks',
      icon: 'fas fa-laptop-code',
      route: '/technologies'
    }
  ];

  constructor(private router: Router) {}

  navigateToEntity(route: string) {
    this.router.navigate([route]);
  }
}
