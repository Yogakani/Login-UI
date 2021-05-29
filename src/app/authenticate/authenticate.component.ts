import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../models/Customer';
import { QrCode } from '../models/QrCode';
import { Status } from '../models/Status';
import { CommonService } from '../service/CommonService';
import * as SockJS from 'sockjs-client';
import * as Stomp from "stompjs"
import { environment } from 'src/environments/environment';

declare let Eventsource : any

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  public authenticateForm : FormGroup;

  public passwordTxtDisplay : boolean = false;

  private password : String;

  private customerId : string;

  private batchId : string;

  private pwdReqDes : String = "Please enter Password";

  private customer : Customer;

  //private loginIp : String = 'http://192.168.49.2:30724/';

  //private loginIp : String = 'http://localhost:8085/';

  //private loginIp : String = 'http://localhost:8000/';

  private upstreamUri : String = 'http://' + environment.upstreamIp + ':' + environment.upstreamPort;

  private status : Status;

  private jwt : string;

  private qrCodeRes : QrCode;

  public qrCode : String;

  public qrCodeDisplay : boolean = false;

  private stompClient = null;

  constructor(private formBuilder : FormBuilder, 
    private service : CommonService,
    private router : Router) { }

  ngOnInit(): void {
    this.authenticateForm = this.formBuilder.group({
      password : ['',Validators.required]
    });
  }
  
  onAuthSelect(authType : any) {
    if (authType == 'Password') {
      this.passwordTxtDisplay = true;
      this.qrCodeDisplay = false;
    } else {
      this.passwordTxtDisplay = false;
      this.qrCodeDisplay = true;
      this.customer = this.getCustomerDetails();
      this.service.getQrCodeData(this.upstreamUri + '/api/v1.0/user/qrCode/generate', this.customer).subscribe( (data) => {
        console.log(data);
        this.qrCodeRes = data;
        if (this.qrCodeRes.status = true) {
          this.qrCode = this.qrCodeRes.qrCode;
          this.onAuthenticateByQR()
        }
      })

    }
  }
 
  onAuthenticate() {
   this.customer = this.getCustomerDetails();
   this.password = this.authenticateForm.get('password').value;
   this.customer.password = this.password;

   this.service.checkUser(this.upstreamUri + '/api/v1.0/login/authByPassword', this.customer).subscribe( (data) => {
     console.log(data);
     this.status = data;
      if (this.status.status = true) {
        console.log('Valid User');
        this.jwt = this.status.jwt;
        if(this.jwt !== null) {
          localStorage.setItem('jwt', this.jwt);
        }
        this.router.navigateByUrl('/home');
      } else {
        console.log('Invalid User');
        this.router.navigateByUrl('/login');
      }
   })
    
  }

  private getCustomerDetails() : Customer {
    this.customerId = localStorage.getItem('customerId');
    this.batchId = localStorage.getItem('batchId');

    this.customer = new Customer();
    this.customer.customerId = this.customerId;
    this.customer.batchId = this.batchId;
    return this.customer;
  }

   onAuthenticateByQR() {
    console.log('Initialize web socket connection')
    const socket = new SockJS(this.upstreamUri + '/healthCheck');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe("/topic/getQrCodeStatus", function(data) {
        var res = JSON.parse(data.body);
        if (res.status) {
         var cid = localStorage.getItem('customerId');
         var bid = localStorage.getItem('batchId');
         if(cid == res.customerId && bid == res.batchId) {
          console.log('Valid User');
          localStorage.setItem('jwt', res.jwt);
          _this.router.navigateByUrl('/home');
         } else { 
            console.log('Invalid User') 
            _this.router.navigateByUrl('/login');
         }
        }
        if (_this.stompClient !== null) {
          _this.stompClient.disconnect();
        }
        console.log("Disconnected Web socket...")
      });
    });
  } 

  /**  onAuthenticateByQR() {
    let source = new EventSource(this.loginIp + 'stream/getQrCodeStatus');
    source.addEventListener('message', message => {
      console.log(message);
      console.log(message.data);
      var res = message.data;
      console.log(JSON.parse(res))
      if (res.status) {
        console.log('valid user')
      } else {
        console.log('invlaid user')
      }
    });
  } */

}

