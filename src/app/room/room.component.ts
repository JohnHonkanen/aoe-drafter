import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomsService } from '../services/rooms/rooms.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

	id: string;
	room : any = {};
	sub : any;
	ioConnection: any;

	constructor(private route: ActivatedRoute, private roomsService: RoomsService) {
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.id = params['id'];

			this.roomsService.getRoom(this.id).subscribe(room => {
				this.room = room[0];
				console.log(this.room);
			});
		});

		this.roomsService.initSocket();
		this.ioConnection = this.roomsService.onUpdate().subscribe((civ : string) => {
			this.roomsService.getRoom(this.id).subscribe(room => {
				this.room = room[0];
				console.log(this.room);
			});
		});
	}
	

	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	banCiv(civ : string)
	{
		console.log("Room: " + this.id);
		console.log("Banning Civ: " + civ);
		
		this.roomsService.banCivInRoom(civ, this.id);
	}

	unBanCiv(civ : string){
		this.roomsService.unBanCivInRoom(civ, this.id);
	}

	

}
