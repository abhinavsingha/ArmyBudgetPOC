import { Component, OnInit } from '@angular/core';
import {SharedService} from "../services/shared/shared.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {ConstantsService} from "../services/constants/constants.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "../services/common/common.service";
import {DatePipe} from "@angular/common";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-unit-registration',
  templateUrl: './unit-registration.component.html',
  styleUrls: ['./unit-registration.component.scss']
})
export class UnitRegistrationComponent implements OnInit{
  constructor(
    public sharedService: SharedService,
    private router: Router,
    private http: HttpClient,
    private apiService: ApiCallingServiceService,
    private cons: ConstantsService,
    private SpinnerService: NgxSpinnerService,
    public common: CommonService,
    private datePipe: DatePipe
  ) {}
  formdata = new FormGroup({
    UserName:new FormControl(),
    UserCode:new FormControl(),
    UserType:new FormControl(),
    UserTypeLevel:new FormControl(),
    Brigade:new FormControl(),
    address:new FormControl(),
    district:new FormControl(),
    city:new FormControl(),
    state:new FormControl(),
    pincode:new FormControl(),
  });
  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');

  }

  submitList(formData: any) {

  }
}
