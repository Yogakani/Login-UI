import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UUID } from "angular2-uuid";
import { Observable } from "rxjs";
import { Customer } from "../models/Customer";
import { QrCode } from "../models/QrCode";
import { Status } from "../models/Status";
import { Team } from "../models/Team";

@Injectable({
    providedIn : 'root'
})
export class CommonService {

    public requestId : string;

    public headers : HttpHeaders;
 
    constructor(private httpClient : HttpClient) {

    }

    public checkUser (url : string, customer : Customer) : Observable<Status> {
        let options = {
            headers : this.getHeaders()
        }
        console.log('Invoking endpoint..' + url);
        return this.httpClient.post<Status>(url, customer, options);
    }

    public getQrCodeData (url : string, customer : Customer) : Observable<QrCode> {
        let options = {
            headers : this.getHeaders()
        }
        console.log('Invoking endpoint..' + url);
        return this.httpClient.post<QrCode>(url, customer, options);
    }

    public getTeamDetails (url : string) : Observable<Team> {
        var requestId = this.generateRequestId();
        var jwt = localStorage.getItem('jwt');
        var userId = localStorage.getItem('customerId');
        var teamId = localStorage.getItem('batchId');

        this.headers = new HttpHeaders({
            'Content-Type' : 'application/json',
            'requestId' : requestId,
            'userId' : userId,
            'teamId' : teamId,
            'jwt' : 'Bearer ' + jwt
        });

        let options = {
            headers : this.headers
        }
        console.log('Invoking endpoint..' + url);
        return this.httpClient.get<Team>(url, options);
    }

    public generateRequestId() : string {
        return UUID.UUID();
    }

    private getHeaders() : HttpHeaders {
        this.requestId = this.generateRequestId();
        return new HttpHeaders({
            'Content-Type' : 'application/json',
            'requestId' : this.requestId
        });
    }
}