import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/Customer';
import { Status } from '../models/Status';
import { CommonService } from '../service/CommonService';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
  providers : [CommonService]
})
export class LoginComponentComponent implements OnInit {

  public loginForm : FormGroup;

  submitted : boolean = false;

  failureMsg : boolean = false;

  customerIdReqDes : String = 'Please enter Customer Id';

  batchIdReqDes : String = 'Please enter Batch Id';

  //private loginIp : String = 'http://192.168.49.2:30724/';

  //private loginIp : String = 'http://localhost:8085/';

  //private loginIp : String = 'http://localhost:8000/';

  private upstreamUri : String = 'http://' + environment.upstreamIp + ':' + environment.upstreamPort;

  private customer : Customer;

  private status : Status;

  validUser : boolean = false;

  passwordTxtDisplay : boolean = false;

  password : string = '';

  constructor(private formBuilder : FormBuilder, 
              private service : CommonService,
              private router : Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      customerId : ['',Validators.required],
      batchId : ['',Validators.required]
    });
  }

  onLogin() {
    this.submitted = true;

    if(this.loginForm.invalid) {
      return;
    }
    
    this.customer = new Customer();
    this.customer.customerId = this.loginForm.get('customerId').value;
    this.customer.batchId = this.loginForm.get('batchId').value;
    
    this.service.checkUser(this.upstreamUri + '/api/v1.0/login/authenticate', this.customer).subscribe( (data) => {
      console.log(data);
      this.status = data;
      if (this.status.status = true) {
        console.log('Valid User');
        this.validUser = !this.validUser; 
        localStorage.setItem('customerId', this.loginForm.get('customerId').value);
        localStorage.setItem('batchId', this.loginForm.get('batchId').value);
        this.router.navigateByUrl("/authenticate");
      } else {
        console.log('Invalid User');
      }
    })
  }

}
