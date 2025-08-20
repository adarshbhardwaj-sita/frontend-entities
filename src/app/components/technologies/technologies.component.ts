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

  saveTechnology() {
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
}
