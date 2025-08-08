import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Technology } from '../services/data.service';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <nav class="breadcrumb">
          <span (click)="goHome()" class="breadcrumb-link">Home</span>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">Technologies</span>
        </nav>
        <h1 class="page-title">Technology Management</h1>
        <p class="page-description">Manage technical skills, tools, and development frameworks</p>
      </header>

      <div class="table-container">
        <div class="table-header">
          <h2>Technology Stack</h2>
          <button class="btn btn-primary" (click)="openAddModal()">
            <i class="fas fa-plus"></i> Add Technology
          </button>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Technology Stack</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let technology of technologies">
                <td>{{ technology.id }}</td>
                <td>
                  <div class="stack-container">
                    <span *ngFor="let tech of getStackArray(technology.stack)" class="tech-badge">
                      {{ tech }}
                    </span>
                  </div>
                </td>
                <td class="actions">
                  <button class="btn-icon btn-edit" (click)="editTechnology(technology)" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon btn-delete" (click)="deleteTechnology(technology.id)" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Edit Technology' : 'Add Technology' }}</h3>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <form (ngSubmit)="saveTechnology()" #technologyForm="ngForm">
            <div class="form-group">
              <label for="stack">Technology Stack</label>
              <textarea 
                id="stack" 
                [(ngModel)]="currentTechnology.stack" 
                name="stack" 
                required 
                class="form-control"
                rows="3"
                placeholder="e.g., Angular, TypeScript, RxJS"
              ></textarea>
              <small class="form-help">Separate technologies with commas</small>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="!technologyForm.form.valid">
                {{ isEditing ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
      color: white;
    }

    .breadcrumb {
      margin-bottom: 1rem;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .breadcrumb-link {
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .breadcrumb-link:hover {
      opacity: 1;
    }

    .breadcrumb-separator {
      margin: 0 0.5rem;
    }

    .breadcrumb-current {
      font-weight: 500;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .page-description {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .table-container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .table-header h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    .data-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .data-table td {
      color: #1f2937;
    }

    .data-table tbody tr:hover {
      background: #f8fafc;
    }

    .stack-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tech-badge {
      background: #e6fffa;
      color: #065f46;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid #a7f3d0;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      text-decoration: none;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(20, 184, 166, 0.4);
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .btn-edit {
      background: #10b981;
      color: white;
    }

    .btn-edit:hover {
      background: #059669;
      transform: scale(1.1);
    }

    .btn-delete {
      background: #ef4444;
      color: white;
    }

    .btn-delete:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .modal-close:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .form-group {
      margin-bottom: 1.5rem;
      padding: 0 2rem;
    }

    .form-group:first-of-type {
      padding-top: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      font-family: inherit;
      resize: vertical;
    }

    .form-control:focus {
      outline: none;
      border-color: #14b8a6;
      box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
    }

    .form-help {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding: 1.5rem 2rem;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 1rem;
      }
      
      .page-title {
        font-size: 2rem;
      }
      
      .table-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .modal {
        width: 95%;
        margin: 1rem;
      }
      
      .stack-container {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class TechnologiesComponent implements OnInit {
  technologies: Technology[] = [];
  showModal = false;
  isEditing = false;
  currentTechnology: Partial<Technology> = {};

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
    this.currentTechnology = {};
    this.showModal = true;
  }

  editTechnology(technology: Technology) {
    this.isEditing = true;
    this.currentTechnology = { ...technology };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentTechnology = {};
  }

  saveTechnology() {
    if (this.isEditing && this.currentTechnology.id) {
      this.dataService.updateTechnology(this.currentTechnology as Technology);
    } else {
      this.dataService.addTechnology(this.currentTechnology as Omit<Technology, 'id'>);
    }
    this.closeModal();
  }

  deleteTechnology(id: number) {
    if (confirm('Are you sure you want to delete this technology?')) {
      this.dataService.deleteTechnology(id);
    }
  }

  getStackArray(stack: string): string[] {
    return stack.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
  }
}