import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Grade } from '../../services/data.service';

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {
  // Notification properties
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'error';
  // Notification properties
  grades: Grade[] = [];
  showModal = false;
  isEditing = false;
  currentGrade: Partial<Grade> = {};
  
  // Search functionality
  searchId: number | null = null;
  searchResult: Grade | null = null;
  isSearching = false;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getGrades().subscribe(grades => {
      this.grades = grades;
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  openAddModal() {
    this.isEditing = false;
    this.currentGrade = {
      gradeId: 0,
      gradeLevel: '',
      gradeDescription: ''
    } as Partial<Grade>;
    this.showModal = true;
  }

  editGrade(grade: Grade) {
    this.isEditing = true;
    this.currentGrade = { ...grade };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentGrade = {
      gradeId: 0,
      gradeLevel: '',
      gradeDescription: ''
    } as Partial<Grade>;
  }



  deleteGrade(id: number) {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.dataService.deleteGrade(id).subscribe({
        next: () => {
          this.dataService.getGrades().subscribe(grades => {
            this.grades = grades;
          });
        },
        error: () => {
          this.showErrorNotification(this.getErrorMessage('','delete'));
        }
      });
    }
  }

  // Search methods
  searchGrade() {
    if (!this.searchId || this.searchId <= 0) {
      this.showErrorNotification('Please enter a valid positive ID');
      return;
    }
    this.isSearching = true;
    this.dataService.searchGradeById(this.searchId).subscribe({
      next: (grade) => {
        this.searchResult = grade;
        this.grades = [grade];
        this.isSearching = false;
      },
      error: () => {
        this.searchResult = null;
        this.showErrorNotification(this.getErrorMessage('','search'));
        this.isSearching = false;
        // Reload all grades
        this.loadGrades();
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

  getErrorMessage(error: any, action: string): string {
    if (error && error.error && typeof error.error === 'string') {
      if (error.error.toLowerCase().includes('duplicate')) {
        return 'Duplicate entry detected. Please use a unique value.';
      }
      return error.error;
    }
    if (error && error.message) {
      if (error.message.toLowerCase().includes('duplicate')) {
        return 'Duplicate entry detected. Please use a unique value.';
      }
      return error.message;
    }
    return `Failed to ${action} grade. Please try again.`;
  }

  clearSearch() {
    this.searchId = null;
    this.searchResult = null;
    this.loadGrades();
  }

  private loadGrades() {
    this.dataService.getGrades().subscribe(grades => {
      this.grades = grades;
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
  saveGrade() {
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
    if (this.currentGrade.gradeId && this.currentGrade.gradeId <= 0) {
      this.showErrorNotification('Grade ID must be a positive number');
      return;
    }

    if (!this.currentGrade.gradeLevel || this.currentGrade.gradeLevel.length < 3) {
      this.showErrorNotification('Grade level must be at least 3 characters long');
      return;
    }

    if (!this.currentGrade.gradeDescription || this.currentGrade.gradeDescription.length < 5) {
      this.showErrorNotification('Description must be at least 5 characters long');
      return;
    }

    // Proceed with save if validation passes
    if (this.isEditing && this.currentGrade.gradeId) {
      this.dataService.updateGrade(this.currentGrade as Grade).subscribe({
        next: () => {
          this.dataService.getGrades().subscribe(grades => {
            this.grades = grades;
          });
          this.closeModal();
        },
        error: () => {
          this.showErrorNotification(this.getErrorMessage('', 'update'));
        }
      });
    } else {
      this.dataService.addGrade(this.currentGrade as Omit<Grade, 'gradeId'>).subscribe({
        next: () => {
          this.dataService.getGrades().subscribe(grades => {
            this.grades = grades;
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
