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
	ioCompletePhase : any;
	team1Pick: boolean;
	pickT1Phase : boolean;
	pickT2Phase : boolean;
	team1BanComplete : number;
	team2BanComplete : number;

	constructor(private route: ActivatedRoute, private roomsService: RoomsService) {
	}

	ngOnInit() {
		this.pickT1Phase = false;
		this.pickT2Phase = false;
		this.team1Pick = true;
		this.team1BanComplete = 0;
		this.team2BanComplete = 0;

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

		this.ioCompletePhase = this.roomsService.onPhaseComplete().subscribe((team : number) => {
			if(team == 1){
				if(!this.pickT1Phase){
					console.log("Team1 Complete");
					this.team1BanComplete++;

					if(this.team1BanComplete > 1)
					{
						console.log("Team 1 Picking");
						this.pickT1Phase = true;
					}
				}
				else{

				}

				this.team1Pick = false;
			}
			else{
				if(!this.pickT2Phase){
					console.log("Team2 Complete");
					this.team2BanComplete++;

					if(this.team2BanComplete > 1)
					{
						console.log("Team 2 Picking");
						this.pickT2Phase = true;
					}
				}
				else{

				}

				this.team1Pick = true;
			}
		});
	}
	

	ngOnDestroy(){
		this.sub.unsubscribe();
		this.ioConnection.unsubscribe();
		this.ioCompletePhase.unsubscribe();
	}

	banCiv(civ : string)
	{
		console.log("Room: " + this.id);
		console.log("Banning Civ: " + civ);
		var team = (this.team1Pick)? 1 : 2;
		var pick = false;

		if(team == 1){
			pick = this.pickT1Phase;
		}
		else{
			pick = this.pickT2Phase;
		}
		this.roomsService.pickCivInRoom(civ, team, pick, this.id);
	}

	unBanCiv(civ : string){
		var team = (this.team1Pick)? 1 : 2;
		var pick = false;

		if(team == 1){
			pick = this.pickT1Phase;
		}
		else{
			pick = this.pickT2Phase;
		}

		this.roomsService.unpickCivInRoom(civ, team, pick, this.id);
	}

	completePhase(team: number)
	{
		this.roomsService.completePhase(team);
	}

	

}
