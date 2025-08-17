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
    this.isEditing = false;
    this.currentCategory = {};
    this.showModal = true;
  }

  editCategory(category: BudgetCategory) {
    this.isEditing = true;
    this.currentCategory = { ...category };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentCategory = {};
  }

  saveCategory() {
      if (this.isEditing && this.currentCategory.id) {
        this.dataService.updateBudgetCategory(this.currentCategory as BudgetCategory).subscribe({
          next: () => {
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
        this.dataService.addBudgetCategory(this.currentCategory as Omit<BudgetCategory, 'id'>).subscribe({
          next: () => {
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
      if (confirm('Are you sure you want to delete this budget category?')) {
        this.dataService.deleteBudgetCategory(id).subscribe({
          next: () => {
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
}
