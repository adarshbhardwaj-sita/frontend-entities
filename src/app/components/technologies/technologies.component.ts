import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Technology } from '../../services/data.service';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.scss']
})
export class TechnologiesComponent implements OnInit {
  // Notification properties
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'error';
  technologies: Technology[] = [];
  showModal = false;
  isEditing = false;
  currentTechnology: Partial<Technology> = {};
  
  // Search functionality
  searchId: number | null = null;
  searchResult: Technology | null = null;
  isSearching = false;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getTechnologies().subscribe(technologies => {
      this.technologies = technologies;
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  openAddModal() {
    this.isEditing = false;
    this.currentTechnology = {
      id: 0,
      technologyStack: ''
    } as Partial<Technology>;
    this.showModal = true;
  }

  editTechnology(technology: Technology) {
    this.isEditing = true;
    this.currentTechnology = { ...technology };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentTechnology = {
      id: 0,
      technologyStack: ''
    } as Partial<Technology>;
  }



  deleteTechnology(id: number) {
      if (confirm('Are you sure you want to delete this technology?')) {
        this.dataService.deleteTechnology(id).subscribe({
          next: () => {
            this.dataService.getTechnologies().subscribe(technologies => {
              this.technologies = technologies;
            });
          },
          error: () => {
            this.showErrorNotification(this.getErrorMessage('','delete'));
          }
        });
      }
  }

  getStackArray(stack: string): string[] {
    return stack.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
  }

  // Search methods
  searchTechnology() {
    if (!this.searchId || this.searchId <= 0) {
      alert('Please enter a valid positive ID');
      return;
    }
    
    this.isSearching = true;
    this.dataService.searchTechnologyById(this.searchId).subscribe({
      next: (technology) => {
        this.searchResult = technology;
        this.technologies = [technology];
        this.isSearching = false;
      },
      error: () => {
        this.searchResult = null;
        this.showErrorNotification(this.getErrorMessage('','search'));
        this.isSearching = false;
        // Reload all technologies
        this.loadTechnologies();
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
    return `Failed to ${action} technology. Please try again.`;
  }

  clearSearch() {
    this.searchId = null;
    this.searchResult = null;
    this.loadTechnologies();
  }

  private loadTechnologies() {
    this.dataService.getTechnologies().subscribe(technologies => {
      this.technologies = technologies;
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
  saveTechnology() {
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
    if (this.currentTechnology.id && this.currentTechnology.id <= 0) {
      this.showErrorNotification('Technology ID must be a positive number');
      return;
    }

    if (!this.currentTechnology.technologyStack || this.currentTechnology.technologyStack.length < 3) {
      this.showErrorNotification('Technology stack must be at least 3 characters long');
      return;
    }

    // Proceed with save if validation passes
    if (this.isEditing && this.currentTechnology.id) {
      this.dataService.updateTechnology(this.currentTechnology as Technology).subscribe({
        next: () => {
          this.dataService.getTechnologies().subscribe(technologies => {
            this.technologies = technologies;
          });
          this.closeModal();
        },
        error: () => {
          this.showErrorNotification(this.getErrorMessage('', 'update'));
        }
      });
    } else {
      this.dataService.addTechnology(this.currentTechnology as Omit<Technology, 'id'>).subscribe({
        next: () => {
          this.dataService.getTechnologies().subscribe(technologies => {
            this.technologies = technologies;
          });
          this.closeModal();
        },
        error: () => {
          this.showErrorNotification(this.getErrorMessage('', 'add'));
        }
      });
    }
  }
}
