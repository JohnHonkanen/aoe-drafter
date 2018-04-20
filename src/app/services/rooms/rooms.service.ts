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

	banCivInRoom(civ :string, room :string){
		this.http.post('server-api/rooms/' + room + '/ban/' + civ, [], []).subscribe(() => {
			console.log("Emiting Update");
			this.socket.emit('update', civ);
		});		
	}

	unBanCivInRoom(civ : string, room: string){
		this.http.post('server-api/rooms/' + room + '/unban/' + civ, [], []).subscribe(() => {
			console.log("Emiting Update");
			this.socket.emit('update', civ);
		});	
	}

	onUpdate() : Observable<string>
	{
		console.log("Update Caught");
		return new Observable<string>(observer => {
			this.socket.on('update', (data: string) => observer.next(data));
		});
	}

	public onEvent(event: Event): Observable<any> {
		return new Observable<Event>(observer => {
			this.socket.on(event, () => observer.next());
		});
	}

}
