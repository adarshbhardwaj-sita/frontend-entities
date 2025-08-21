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
  
  // Search functionality
  searchId: number | null = null;
  searchResult: Journey | null = null;
  isSearching = false;

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
    console.log('openAddModal called');
    this.isEditing = false;
    this.currentJourney = {
      journeyId: 0,
      journeyName: '',
      journeyDescription: '',
      destination: '',
      durationInDays: 0,
      budget: 0
    } as Partial<Journey>;
    this.showModal = true;
  }

  editJourney(journey: Journey) {
    console.log('editJourney called with:', journey);
    this.isEditing = true;
    this.currentJourney = { ...journey };
    this.showModal = true;
  }

  closeModal() {
    console.log('closeModal called');
    this.showModal = false;
    this.currentJourney = {
      journeyId: 0,
      journeyName: '',
      journeyDescription: '',
      destination: '',
      durationInDays: 0,
      budget: 0
    } as Partial<Journey>;
  }

  saveJourney() {
    console.log('saveJourney called');
    
    // Basic validation
    if (!this.currentJourney.journeyId || this.currentJourney.journeyId <= 0) {
      alert('Please enter a valid positive ID');
      return;
    }
    if (!this.currentJourney.journeyName || this.currentJourney.journeyName.trim().length < 3) {
      alert('Please enter a valid journey name (at least 3 characters)');
      return;
    }
    if (!this.currentJourney.journeyDescription || this.currentJourney.journeyDescription.trim().length < 10) {
      alert('Please enter a valid journey description (at least 10 characters)');
      return;
    }
    if (!this.currentJourney.destination || this.currentJourney.destination.trim().length < 2) {
      alert('Please enter a valid destination (at least 2 characters)');
      return;
    }
    if (!this.currentJourney.durationInDays || this.currentJourney.durationInDays <= 0 || this.currentJourney.durationInDays > 365) {
      alert('Please enter a valid duration between 1 and 365 days');
      return;
    }
    if (!this.currentJourney.budget || this.currentJourney.budget <= 0) {
      alert('Please enter a valid budget amount greater than 0');
      return;
    }
    
    if (this.isEditing && this.currentJourney.journeyId) {
      console.log('Updating journey:', this.currentJourney);
      this.dataService.updateJourney(this.currentJourney as Journey).subscribe({
        next: () => {
          console.log('Journey updated successfully');
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
      console.log('Adding new journey:', this.currentJourney);
      this.dataService.addJourney(this.currentJourney as Omit<Journey, 'journeyId'>).subscribe({
        next: () => {
          console.log('Journey added successfully');
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
    console.log('deleteJourney called with id:', id);
    if (confirm('Are you sure you want to delete this journey?')) {
      console.log('Deleting journey with id:', id);
      this.dataService.deleteJourney(id).subscribe({
        next: () => {
          console.log('Journey deleted successfully');
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

  // Search methods
  searchJourney() {
    if (!this.searchId || this.searchId <= 0) {
      alert('Please enter a valid positive ID');
      return;
    }
    
    this.isSearching = true;
    this.dataService.searchJourneyById(this.searchId).subscribe({
      next: (journey) => {
        this.searchResult = journey;
        this.journeys = [journey];
        this.isSearching = false;
      },
      error: (error) => {
        this.searchResult = null;
        alert(`No journey found with ID ${this.searchId}`);
        this.isSearching = false;
        // Reload all journeys
        this.loadJourneys();
      }
    });
  }

  clearSearch() {
    this.searchId = null;
    this.searchResult = null;
    this.loadJourneys();
  }

  private loadJourneys() {
    this.dataService.getJourneys().subscribe(journeys => {
      this.journeys = journeys;
    });
  }
}
