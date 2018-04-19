import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './room/room.component';

export const router: Routes = [
	{ path: '', redirectTo: 'rooms', pathMatch: 'full'},
	{ path: 'rooms', component: RoomsComponent },
	{ path: 'rooms/:id', component: RoomComponent },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);