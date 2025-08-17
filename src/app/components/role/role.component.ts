import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Role } from '../../services/data.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  showModal = false;
  isEditing = false;
  currentRole: Partial<Role> = {};

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  openAddModal() {
    this.isEditing = false;
    this.currentRole = {};
    this.showModal = true;
  }

  editRole(role: Role) {
    this.isEditing = true;
    this.currentRole = { ...role };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentRole = {};
  }

  saveRole() {
      if (this.isEditing && this.currentRole.id) {
        this.dataService.updateRole(this.currentRole as Role).subscribe({
          next: () => {
            this.dataService.getRoles().subscribe(roles => {
              this.roles = roles;
            });
            this.closeModal();
          },
          error: (error: Error) => {
            console.error('Error updating role:', error);
          }
        });
      } else {
        this.dataService.addRole(this.currentRole as Omit<Role, 'id'>).subscribe({
          next: () => {
            this.dataService.getRoles().subscribe(roles => {
              this.roles = roles;
            });
            this.closeModal();
          },
          error: (error: Error) => {
            console.error('Error adding role:', error);
          }
        });
      }
  }

  deleteRole(id: number) {
      if (confirm('Are you sure you want to delete this role?')) {
        this.dataService.deleteRole(id).subscribe({
          next: () => {
            this.dataService.getRoles().subscribe(roles => {
              this.roles = roles;
            });
          },
          error: (error: Error) => {
            console.error('Error deleting role:', error);
          }
        });
      }
  }
}
