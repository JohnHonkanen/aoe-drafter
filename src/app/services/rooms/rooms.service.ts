import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';


@Injectable()
export class RoomsService {
	socket;
	constructor(private http: Http) { 
		
	}

	initSocket(){
		this.socket = io();
	}

	getAllRooms(){

		return this.http.get('/api/rooms')
		.map(res => res.json());
	}

	getRoom(id){
		return this.http.get('/api/rooms/' + id)
		.map(res => res.json());
	}

	pickCivInRoom(civ :string, team : number, pick : boolean, room :string){

		if(pick)
		{
			const teamstring = 'team_' + team;
			console.log(teamstring);
			this.http.post('server-api/rooms/' + room + '/pick/' + teamstring +'/' + civ, [], []).subscribe(() => {
				console.log("Emiting Update");
				this.socket.emit('update', civ);
			});
		}
		else{
			this.http.post('server-api/rooms/' + room + '/ban/' + civ, [], []).subscribe(() => {
				console.log("Emiting Update");
				this.socket.emit('update', civ);
			});
		}
		
	}

	unpickCivInRoom(civ :string, team : number, pick : boolean, room :string){
		if(pick)
		{
			const teamstring = 'team_' + team;
			this.http.post('server-api/rooms/' + room + '/unpick/' + teamstring +'/' + civ, [], []).subscribe(() => {
				console.log("Emiting Update");
				this.socket.emit('update', civ);
			});
		}
		else{
			this.http.post('server-api/rooms/' + room + '/unban/' + civ, [], []).subscribe(() => {
				console.log("Emiting Update");
				this.socket.emit('update', civ);
			});	
		}

	}

	completePhase(team : number){
		this.socket.emit('completePhase', team);
	}

	onUpdate() : Observable<string>
	{
		console.log("Update Caught");
		return new Observable<string>(observer => {
			this.socket.on('update', (data: string) => observer.next(data));
		});
	}

	onPhaseComplete() : Observable<number>
	{
		console.log("Phase Complete Caught");
		return new Observable<number>(observer => {
			this.socket.on('completePhase', (data: number) => observer.next(data));
		});
	}

	public onEvent(event: Event): Observable<any> {
		return new Observable<Event>(observer => {
			this.socket.on(event, () => observer.next());
		});
	}

}
