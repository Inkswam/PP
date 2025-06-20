import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../../features/dashboard/dashboard.module').then(m => m.DashboardModule)

      },
      {
        path: 'teams/:id/tasks',
        loadChildren: () => import('../../features/task-board/task-board-module').then(m => m.TaskBoardModule)
      },
    ]
  },
  { path: 'teams/:id/tasks', loadChildren: () => import('../../features/task-board/task-board-module').then(m => m.TaskBoardModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule {}
