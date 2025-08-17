import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Journey } from '../../services/data.service';

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent implements OnInit {
  journeys: Journey[] = [];
  showModal = false;
  isEditing = false;
  currentJourney: Partial<Journey> = {};

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getJourneys().subscribe(journeys => {
      this.journeys = journeys;
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  openAddModal() {
    this.isEditing = false;
    this.currentJourney = {};
    this.showModal = true;
  }

  editJourney(journey: Journey) {
    this.isEditing = true;
    this.currentJourney = { ...journey };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentJourney = {};
  }

  saveJourney() {
      if (this.isEditing && this.currentJourney.id) {
        this.dataService.updateJourney(this.currentJourney as Journey).subscribe({
          next: () => {
            this.dataService.getJourneys().subscribe(journeys => {
              this.journeys = journeys;
            });
            this.closeModal();
          },
          error: (error: Error) => {
            console.error('Error updating journey:', error);
          }
        });
      } else {
        this.dataService.addJourney(this.currentJourney as Omit<Journey, 'id'>).subscribe({
          next: () => {
            this.dataService.getJourneys().subscribe(journeys => {
              this.journeys = journeys;
            });
            this.closeModal();
          },
          error: (error: Error) => {
            console.error('Error adding journey:', error);
          }
        });
      }
  }

  deleteJourney(id: number) {
      if (confirm('Are you sure you want to delete this journey?')) {
        this.dataService.deleteJourney(id).subscribe({
          next: () => {
            this.dataService.getJourneys().subscribe(journeys => {
              this.journeys = journeys;
            });
          },
          error: (error: Error) => {
            console.error('Error deleting journey:', error);
          }
        });
      }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'in progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'on hold':
        return 'status-on-hold';
      default:
        return 'status-active';
    }
  }
}
