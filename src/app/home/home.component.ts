import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Team } from '../models/Team';
import { CommonService } from '../service/CommonService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //public productIp : string = 'http://192.168.49.2:30724';

  //public productIp : string = 'http://localhost:8095';

  //public productIp : string = 'http://localhost:8000';

  private upstreamUri : String = 'http://' + environment.upstreamIp + ':' + environment.upstreamPort;

  public customerId : string;

  public team : Team;

  public res : any;

  public status : boolean = false;

  constructor(private service : CommonService) { }

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId');
    this.getTeamDetails();
  }

  getTeamDetails() : void {
    this.service.getTeamDetails(this.upstreamUri + '/api/v1.0/team/get').subscribe( (data) => {
      console.log(data);
      this.team = data;
      if (this.team.status) {
        this.res = this.team.payloadResponse;
        this.status = !this.status;
      }
    })    

  }


}
