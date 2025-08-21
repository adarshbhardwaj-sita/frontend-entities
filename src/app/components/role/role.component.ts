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
  // Notification properties
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'error';
  roles: Role[] = [];
  showModal = false;
  isEditing = false;
  currentRole: Partial<Role> = {};
  
  // Search functionality
  searchId: number | null = null;
  searchResult: Role | null = null;
  isSearching = false;

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
    this.currentRole = {
      role_Id: 0,
      role_Title: '',
      project_Name: ''
    };
    this.showModal = true;
  }

  editRole(role: Role) {
    this.isEditing = true;
    this.currentRole = { ...role };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentRole = {
      role_Id: 0,
      role_Title: '',
      project_Name: ''
    };
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
            this.showErrorNotification(this.getErrorMessage('', 'delete'));
          }
        });
      }
  }

  // Search methods
  searchRole() {
    if (!this.searchId || this.searchId <= 0) {
      alert('Please enter a valid positive ID');
      return;
    }
    
    this.isSearching = true;
    this.dataService.searchRoleById(this.searchId).subscribe({
      next: (role) => {
        this.searchResult = role;
        this.roles = [role];
        this.isSearching = false;
      },
      error: (error) => {
        this.searchResult = null;
        this.showErrorNotification(this.getErrorMessage('', 'search'));
        this.isSearching = false;
        // Reload all roles
        this.loadRoles();
      }
    });
  }
  showErrorNotification(message: string) {
    this.notificationType = 'error';
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  closeNotification() {
    this.showNotification = false;
  }

  getErrorMessage(_error: any, action: string): string {
    // Always show a generic error message
    return `Failed to ${action} role. Please try again.`;
  }

  clearSearch() {
    this.searchId = null;
    this.searchResult = null;
    this.loadRoles();
  }

  private loadRoles() {
    this.dataService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  // Validation methods
  validateField(control: any) {
    // Trigger validation on blur and input
    if (control.invalid && control.touched) {
      control.markAsTouched();
    }
  }

  // Enhanced save with validation
  saveRole() {
    // Mark all fields as touched to trigger validation display
    const form = document.querySelector('form');
    if (form) {
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach((input: any) => {
        if (input.ngModel) {
          input.ngModel.markAsTouched();
        }
      });
    }

    // Check if form is valid before saving
    if (this.currentRole.role_Id && this.currentRole.role_Id <= 0) {
      alert('Role ID must be a positive number');
      return;
    }

    if (!this.currentRole.role_Title || this.currentRole.role_Title.length < 3) {
      alert('Role title must be at least 3 characters long');
      return;
    }

    if (!this.currentRole.project_Name || this.currentRole.project_Name.length < 3) {
      alert('Project name must be at least 3 characters long');
      return;
    }

    // Proceed with save if validation passes
    if (this.isEditing && this.currentRole.role_Id) {
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
      this.dataService.addRole(this.currentRole as Omit<Role, 'role_Id'>).subscribe({
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
}
