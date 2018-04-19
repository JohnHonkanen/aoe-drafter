import { Component, OnInit } from '@angular/core';
import { RoomsService } from '../services/rooms/rooms.service';

@Component({
	selector: 'app-rooms',
	templateUrl: './rooms.component.html',
	styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

	rooms : any = [];
	constructor(private roomsService: RoomsService) { }

	ngOnInit() {
		this.roomsService.getAllRooms().subscribe(rooms => {
			this.rooms = rooms;
		});
	}

}
