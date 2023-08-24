import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {ConstantsService} from "../services/constants/constants.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "../services/common/common.service";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {SharedService} from "../services/shared/shared.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    private http: HttpClient,
    private apiService: ApiCallingServiceService,
    private cons: ConstantsService,
    private SpinnerService: NgxSpinnerService,
    private common: CommonService,
    private router: Router,
    public sharedService: SharedService
  ) {}
  formData=new FormGroup({
    username:new FormControl(),
    password:new FormControl()
});

login(){
  let json={
    userId:this.formData.get('username')?.value,
    password:this.formData.get('password')?.value,
  };
  this.apiService.postApi(this.cons.api.loginWebApi, json).subscribe({
    next: (v: object) => {
      this.SpinnerService.hide();
      let result: { [key: string]: any } = v;

      if (result['message'] == 'success') {
        } else {
        this.common.faliureAlert('Please try later', result['message'], '');
        this.SpinnerService.hide();
      }
    },
    error: (e) => {
      this.SpinnerService.hide();
      console.error(e);
      this.common.faliureAlert('Error', e['error']['message'], 'error');
    },
    complete: () => this.SpinnerService.hide(),
  });
}
}
