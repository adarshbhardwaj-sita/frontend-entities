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
          error: (error: Error) => {
            console.error('Error deleting technology:', error);
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
      error: (error) => {
        this.searchResult = null;
        alert(`No technology found with ID ${this.searchId}`);
        this.isSearching = false;
        // Reload all technologies
        this.loadTechnologies();
      }
    });
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
      alert('Technology ID must be a positive number');
      return;
    }

    if (!this.currentTechnology.technologyStack || this.currentTechnology.technologyStack.length < 3) {
      alert('Technology stack must be at least 3 characters long');
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
        error: (error: Error) => {
          console.error('Error updating technology:', error);
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
        error: (error: Error) => {
          console.error('Error adding technology:', error);
        }
      });
    }
  }
}
