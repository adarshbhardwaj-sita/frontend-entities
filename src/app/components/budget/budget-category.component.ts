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
      financialYear: ''
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
      financialYear: ''
    };
  }

  saveCategory() {
    console.log('saveCategory called');
    
    // Basic validation
    if (!this.currentCategory.id || this.currentCategory.id <= 0) {
      alert('Please enter a valid positive ID');
      return;
    }
    if (!this.currentCategory.categoryType || this.currentCategory.categoryType.trim().length < 2) {
      alert('Please enter a valid category type (at least 2 characters)');
      return;
    }
    if (!this.currentCategory.budgetAmount || this.currentCategory.budgetAmount <= 0) {
      alert('Please enter a valid budget amount greater than 0');
      return;
    }
    if (!this.currentCategory.financialYear || !this.currentCategory.financialYear.match(/^\d{4}-\d{2}$/)) {
      alert('Please enter a valid financial year in format YYYY-YY (e.g., 2024-25)');
      return;
    }
    
    if (this.isEditing && this.currentCategory.id) {
      console.log('Updating category:', this.currentCategory);
      this.dataService.updateBudgetCategory(this.currentCategory as BudgetCategory).subscribe({
        next: () => {
          console.log('Category updated successfully');
          this.dataService.getBudgetCategories().subscribe(categories => {
            this.budgetCategories = categories;
          });
          this.closeModal();
        },
        error: (error: Error) => {
          console.error('Error updating category:', error);
        }
      });
    } else {
      console.log('Adding new category:', this.currentCategory);
      this.dataService.addBudgetCategory(this.currentCategory as Omit<BudgetCategory, 'id'>).subscribe({
        next: () => {
          console.log('Category added successfully');
          this.dataService.getBudgetCategories().subscribe(categories => {
            this.budgetCategories = categories;
          });
          this.closeModal();
        },
        error: (error: Error) => {
          console.error('Error adding category:', error);
        }
      });
    }
  }

  deleteCategory(id: number) {
    console.log('deleteCategory called with id:', id);
    if (confirm('Are you sure you want to delete this budget category?')) {
      console.log('Deleting category with id:', id);
      this.dataService.deleteBudgetCategory(id).subscribe({
        next: () => {
          console.log('Category deleted successfully');
          this.dataService.getBudgetCategories().subscribe(categories => {
            this.budgetCategories = categories;
          });
        },
        error: (error: Error) => {
          console.error('Error deleting category:', error);
        }
      });
    }
  }

  // Search methods
  searchCategory() {
    if (!this.searchId || this.searchId <= 0) {
      alert('Please enter a valid positive ID');
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
        this.searchResult = null;
        alert(`No budget category found with ID ${this.searchId}`);
        this.isSearching = false;
        // Reload all categories
        this.loadCategories();
      }
    });
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
