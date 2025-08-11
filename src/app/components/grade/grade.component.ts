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
  grades: Grade[] = [];
  showModal = false;
  isEditing = false;
  currentGrade: Partial<Grade> = {};

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
    this.currentGrade = {};
    this.showModal = true;
  }

  editGrade(grade: Grade) {
    this.isEditing = true;
    this.currentGrade = { ...grade };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentGrade = {};
  }

  saveGrade() {
    if (this.isEditing && this.currentGrade.id) {
      this.dataService.updateGrade(this.currentGrade as Grade);
    } else {
      this.dataService.addGrade(this.currentGrade as Omit<Grade, 'id'>);
    }
    this.closeModal();
  }

  deleteGrade(id: number) {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.dataService.deleteGrade(id);
    }
  }
}
