import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing.component';
import { EmployeeComponent } from './components/employee.component';
import { BudgetCategoryComponent } from './components/budget-category.component';
import { JourneyComponent } from './components/journey.component';
import { GradeComponent } from './components/grade.component';
import { RoleComponent } from './components/role.component';
import { TechnologiesComponent } from './components/technologies.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'budget-category', component: BudgetCategoryComponent },
  { path: 'journey', component: JourneyComponent },
  { path: 'grade', component: GradeComponent },
  { path: 'role', component: RoleComponent },
  { path: 'technologies', component: TechnologiesComponent },
  { path: '**', redirectTo: '' }
];