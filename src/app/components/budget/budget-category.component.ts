import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, BudgetCategory } from '../../services/data.service';

@Component({
  selector: 'app-budget-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-category.component.html',
  styleUrls: ['./budget-category.component.scss']
})
export class BudgetCategoryComponent implements OnInit {
  budgetCategories: BudgetCategory[] = [];
  showModal = false;
  isEditing = false;
  currentCategory: Partial<BudgetCategory> = {};
  
  // Search functionality
  searchId: number | null = null;
  searchResult: BudgetCategory | null = null;
  isSearching = false;

  // Notification properties
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getBudgetCategories().subscribe(categories => {
      this.budgetCategories = categories;
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  openAddModal() {
    console.log('openAddModal called');
    this.isEditing = false;
    this.currentCategory = {
      id: 0,
      categoryType: '',
      budgetAmount: 0,
      financialYear: 0
    };
    this.showModal = true;
  }

  editCategory(category: BudgetCategory) {
    console.log('editCategory called with:', category);
    this.isEditing = true;
    this.currentCategory = { ...category };
    this.showModal = true;
  }

  closeModal() {
    console.log('closeModal called');
    this.showModal = false;
    this.currentCategory = {
      id: 0,
      categoryType: '',
      budgetAmount: 0,
      financialYear: 0
    };
  }

  saveCategory() {
    // Basic validation
    if (!this.currentCategory.id || this.currentCategory.id <= 0) {
      this.showErrorNotification('Please enter a valid positive ID');
      return;
    }
    if (!this.currentCategory.categoryType || this.currentCategory.categoryType.trim().length < 2) {
      this.showErrorNotification('Please enter a valid category type (at least 2 characters)');
      return;
    }
    if (!this.currentCategory.budgetAmount || this.currentCategory.budgetAmount <= 0) {
      this.showErrorNotification('Please enter a valid budget amount greater than 0');
      return;
    }
    if (
      !this.currentCategory.financialYear ||
      typeof this.currentCategory.financialYear !== 'number' ||
      this.currentCategory.financialYear < 1900 ||
      this.currentCategory.financialYear > 2100 ||
      !Number.isInteger(this.currentCategory.financialYear)
    ) {
      this.showErrorNotification('Please enter a valid financial year as a 4-digit number (e.g., 2025)');
      return;
    }
    
    if (this.isEditing && this.currentCategory.id) {
      this.dataService.updateBudgetCategory(this.currentCategory as BudgetCategory).subscribe({
        next: () => {
          this.dataService.getBudgetCategories().subscribe(categories => {
            this.budgetCategories = categories;
          });
          this.closeModal();
        },
        error: (error: Error) => {
          console.log('Update error:', error);
          this.showErrorNotification(this.getErrorMessage(error, 'update'));
        }
      });
    } else {
      this.dataService.addBudgetCategory(this.currentCategory as Omit<BudgetCategory, 'id'>).subscribe({
        next: () => {
          this.dataService.getBudgetCategories().subscribe(categories => {
            this.budgetCategories = categories;
          });
          this.closeModal();
        },
        error: (error: Error) => {
          console.log('Add error:', error);
          this.showErrorNotification(this.getErrorMessage(error, 'add'));
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this budget category?')) {
      this.dataService.deleteBudgetCategory(id).subscribe({
        next: () => {
          this.dataService.getBudgetCategories().subscribe(categories => {
            this.budgetCategories = categories;
          });
        },
        error: (error: Error) => {
          console.log('Delete error:', error);
          this.showErrorNotification(this.getErrorMessage(error, 'delete'));
        }
      });
    }
  }

  // Search methods
  searchCategory() {
    if (!this.searchId || this.searchId <= 0) {
      this.showErrorNotification('Please enter a valid positive ID');
      return;
    }
    this.isSearching = true;
    this.dataService.searchBudgetCategoryById(this.searchId).subscribe({
      next: (category) => {
        this.searchResult = category;
        this.budgetCategories = [category];
        this.isSearching = false;
      },
      error: (error) => {
        console.log('Search error:', error);
        this.searchResult = null;
        this.showErrorNotification(`No budget category found with ID ${this.searchId}`);
        this.isSearching = false;
        // Reload all categories
        this.loadCategories();
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
    // Always show a generic error message
    return `Failed to ${action} budget category. Please try again.`;
  }

  clearSearch() {
    this.searchId = null;
    this.searchResult = null;
    this.loadCategories();
  }

  private loadCategories() {
    this.dataService.getBudgetCategories().subscribe(categories => {
      this.budgetCategories = categories;
    });
  }
}
