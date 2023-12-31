import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import Swal from 'sweetalert2';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Chart, registerables, ChartConfiguration, ChartItem } from 'chart.js';
import { SharedService } from '../services/shared/shared.service';
class UnitWiseExpenditureList {
  unit: any;
  financialYear: any;
  subhead: any;
  allocated: any;
  expenditure: any;
  lastCbDate: any;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // vaibhav

  totalItems2: number=0;
  currentPage2 = 1;
  pageSize2 = 10;



  budgetFinYears: any[] = [];
  Units: any[] = [];
  subHeads: any[] = [];

  dasboardData: any;
  unitWiseExpenditureList: UnitWiseExpenditureList[] = [];

  allunits: any[] = [];

  budgetListData: any[] = [];

  submitted = false;
  q:number=1;
  p: number = 1;
  length: number = 0;
  userAuthorised:boolean=false;

  formdata = new FormGroup({
    majorHead:new FormControl(),
    rupeeUnit:new FormControl(),
    finYear: new FormControl(),
    subHead: new FormControl(),
    unit: new FormControl(),
    subHeadType: new FormControl(),
    allocationType: new FormControl(),
  });

  updateBudgetFormData = new FormGroup({
    transactionId: new FormControl(),
    majorHead: new FormControl(),
    subHead: new FormControl(),
    minorHead: new FormControl(),
    fundAvailable: new FormControl(),
    preAllocation: new FormControl(),
    allocationType: new FormControl(),
    revisedAmount: new FormControl(),
    balanceFund: new FormControl(),
  });
  private unitId: any;
  subHeadType: any;
  tableData: any;
  amountType :any;
  amountUnits :any;
  amountUnit :any;
   subHeadsResponse: any;

  ngOnInit(): void {
    // ngOnInit(): void {
this.draw();
    this.userExit();

    $.getScript('assets/main.js');
  }
  constructor(
    public sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private cons: ConstantsService,
    private apiService: ApiCallingServiceService,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private router: Router,
    private location: Location
  ) {}
  // vaibhav

  getBudgetFinYear() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.budgetFinYears = result['response'];
        // this.formdata.patchValue({
        //   finYear: this.budgetFinYears[0],
        // });
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }
  unitwiseUnit='';
  subheadwiseUnit='';

  userExit() {
    // this.SpinnerService.show();
    // this.apiService.getApi(this.cons.api.userExit).subscribe({
    //   next: (v: object) => {
    //     this.SpinnerService.hide();
    //     let result: { [key: string]: any } = v;
    //
    //     if (result['message'] == 'success') {
    //       if (result['response']) {
    //         this.userAuthorised=true;
            this.getMajorDataNew();
            this.getDashBoardDta();
            this.getBudgetFinYear();
            this.getSubHeadsData();
            // this.getCgUnitData();
            this.getinbox();
            this.getSubHeadType();
            this.getAllocationTypeData();
            this.getAmountType();
    //       } else {
    //         this.redirectUri();
    //       }
    //     } else {
    //       this.common.faliureAlert('Please try later', result['message'], '');
    //     }
    //   },
    //   error: (e) => {
    //     this.SpinnerService.hide();
    //     console.error(e);
    //     this.common.faliureAlert('Error', e['error']['message'], 'error');
    //
    //   },
    //   complete: () => console.info('complete'),
    // });
  }
  getAmountType() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.showAllAmountUnit).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.amountType = result['response'];
          this.amountUnits = this.amountType[0];
          this.amountUnit = this.amountUnits.amountType;
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
      },
      complete: () => console.info('complete'),
    });
  }
  getCgUnitData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.allunits = result['response'];
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');

      },
      complete: () => console.info('complete'),
    });
  }

  getAllCgUnitData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getAllCgUnitData).subscribe((res) => {
      let result: { [key: string]: any } = res;
      if (result['message'] == 'success') {
        this.allunits = result['response'];
        this.SpinnerService.hide();
      } else {
        this.common.faliureAlert('Please try later', result['message'], '');
      }
    });
  }

  getSubHeadsData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getSubHeadsData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.subHeads = result['response'];
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
      },
      complete: () => console.info('complete'),
    });
  }

  getDashBoardDta() {
    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.getDashBoardDta, null).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {

          this.sharedService.dashboardData = result['response'];
          this.dasboardData = result['response']; //
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.archive = result['response'].archived;
          this.sharedService.approve = result['response'].approved;
          if(result['response'].userDetails.unitId=='001321')
          {
            this.getAllCgUnitData();
          }
          else
            this.getCgUnitData();
          var roles = result['response'].userDetails.role[0].roleName;
          if (localStorage.getItem('user_role') != roles) {
            window.location.reload();
          }
          localStorage.setItem('user_role', roles);
          localStorage.removeItem('defautAllocationType');
          localStorage.setItem(
            'defautAllocationType',
            this.dasboardData.allocationType.allocType
          );
          this.sharedService.finYear = result['response'].budgetFinancialYear;
          if (this.sharedService.finYear != undefined)
            this.formdata.get('finYear')?.setValue(this.sharedService.finYear);

          if (this.dasboardData.unitWiseExpenditureList != undefined) {
            for (
              let i = 0;
              i < this.dasboardData.unitWiseExpenditureList.length;
              i++
            ) {
              // let unit='';
              // let finyear='';
              // for(let j=0;j<this.allunits.length;j++){
              //   if(this.dasboardData.unitWiseExpenditureList[i].unit==this.allunits[j].unit){
              //     unit=this.allunits[j].descr;
              //   }
              // }
              // for(let j=0;j<this.budgetFinYears.length;j++){
              //   if(this.dasboardData.unitWiseExpenditureList[i].financialYearId==this.budgetFinYears[j].serialNo){
              //     finyear=this.budgetFinYears[j].finYear;
              //   }
              // }
              const dataEntry: UnitWiseExpenditureList = {
                unit: this.dasboardData.unitWiseExpenditureList[i].unit.descr,
                financialYear:
                  this.dasboardData.unitWiseExpenditureList[i].financialYearId
                    .finYear,
                subhead:
                  this.dasboardData.unitWiseExpenditureList[i].subHead
                    .subHeadDescr,
                allocated:
                  this.dasboardData.unitWiseExpenditureList[i].allocatedAmount,
                expenditure: 0,
                lastCbDate:
                  this.dasboardData.unitWiseExpenditureList[i].lastCBDate,
              };
              this.unitWiseExpenditureList.push(dataEntry);
            }
          }
          this.draw();
          this.unitId = result['response'].userDetails.unitId;
          if (this.unitId == '001321') {
            this.getAllCgUnitData();
          }
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
      },
      complete: () => console.info('complete'),
    });
  }

  async redirectUri() {
    this.common.warningAlert(
      'Warning',
      'You are not authorized to access this application...!',
      'warning'
    );
    await this.waitWithAsync(2000); // Wait for 2 seconds

    window.location.replace(this.cons.serverRedirectUrl);
    return;
  }

  async waitWithAsync(milliseconds: number): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
  }

  getinbox() {
    this.SpinnerService.show();

    this.apiService.getApi(this.cons.api.updateInboxOutBox).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
      },
      complete: () => console.info('complete'),
    });
  }
  searchData() {
    this.unitWiseExpenditureList = [];
    this.SpinnerService.show();

    this.apiService.postApi(this.cons.api.getDashBoardDta, null).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.dasboardData = result['response'];
          this.sharedService.inbox = result['response'].inbox;
          this.sharedService.outbox = result['response'].outBox;
          this.sharedService.archive = result['response'].archived;
          this.sharedService.approve = result['response'].approved;
          if(this.dasboardData.unitWiseExpenditureList!=undefined){
            for (
              let i = 0;
              i < this.dasboardData.unitWiseExpenditureList.length;
              i++
            ) {
              const dataEntry: UnitWiseExpenditureList = {
                unit: this.dasboardData.unitWiseExpenditureList[i].unit.descr,
                financialYear:
                this.dasboardData.unitWiseExpenditureList[i].financialYearId
                  .finYear,
                subhead:
                this.dasboardData.unitWiseExpenditureList[i].subHead
                  .subHeadDescr,
                allocated:
                this.dasboardData.unitWiseExpenditureList[i].allocatedAmount,
                expenditure: 0,
                lastCbDate:
                this.dasboardData.unitWiseExpenditureList[i].lastCBDate,
              };

              this.unitWiseExpenditureList.push(dataEntry);
            }
            for (let i = 0; i < this.unitWiseExpenditureList.length; i++) {
              if (
                this.formdata.get('finYear')?.value.finYear !=
                this.unitWiseExpenditureList[i].financialYear ||
                this.formdata.get('unit')?.value.descr !=
                this.unitWiseExpenditureList[i].unit ||
                this.formdata.get('subHead')?.value.subHeadDescr !=
                this.unitWiseExpenditureList[i].subhead
              ) {
                this.unitWiseExpenditureList.pop();
              }
            }
          }
          // console.log('DATA>>>>>>>'+this.dasboardData);
          // this.draw();
          this.SpinnerService.hide(); // ;
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
      },

      complete: () => console.info('complete'),
    });
  }

  draw(): void {
    Chart.register(...registerables);
        const data = {
          labels: ['OE','SM','WS','OT','DT','RT','PU','PL','AP','MW', 'PS', 'ME', 'IT'],
          datasets: [{
            label: 'Expenditure(Lakhs)',
            backgroundColor: '#1CC88A',
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bba',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: [58, 68, 40, 59, 86, 67, 90, 70, 75, 70, 80, 55, 66]
          },
        {
          label: 'Allocated(Lakhs)',
          backgroundColor: '#FFBD16',
          borderColor: 'rgba(210, 214, 222, 1)',
          pointRadius: false,
          pointColor: 'rgba(210, 214, 222, 1)',
          pointStrokeColor: '#c1c7d1',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: [58, 45, 50, 39, 46, 57, 60, 50, 65, 60, 60, 35, 46]
    
        }
        ]
    };
    // const data = {
    //   labels: this.dasboardData.subHeadWiseExpenditure.subhead,
    //   datasets: [
    //     {
    //       label: 'Expenditure(Lakhs)',
    //       backgroundColor: 'rgba(60,141,188,0.9)',
    //       borderColor: 'rgba(60,141,188,0.8)',
    //       pointRadius: false,
    //       pointColor: '#3b8bba',
    //       pointStrokeColor: 'rgba(60,141,188,1)',
    //       pointHighlightFill: '#fff',
    //       pointHighlightStroke: 'rgba(60,141,188,1)',
    //       data: this.dasboardData.subHeadWiseExpenditure.expenditureSubHead,
    //     },
    //     {
    //       label: 'Allocated(Lakhs)',
    //       backgroundColor: 'rgba(210, 214, 222, 1)',
    //       borderColor: 'rgba(210, 214, 222, 1)',
    //       pointRadius: false,
    //       pointColor: 'rgba(210, 214, 222, 1)',
    //       pointStrokeColor: '#c1c7d1',
    //       pointHighlightFill: '#fff',
    //       pointHighlightStroke: 'rgba(220,220,220,1)',
    //       data: this.dasboardData.subHeadWiseExpenditure.allocatedSubHead,
    //     },
    //   ],
    // };
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          display: true,
        },
      },
    };
    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: options,
    };
    const chartItem: ChartItem = document.getElementById(
      'my-chart'
    ) as ChartItem;
    new Chart(chartItem, config);
    
    const data2 = {
      labels: ['CGHQ','RHQ(W)','RHQ(NW)','RHQ(NE)','RHQ(E)','RHQ(A&N)'],
      datasets: [{
        label: 'Expenditure(Lakhs)',
        backgroundColor: '#1CC88A',
        borderColor: 'rgba(60,141,188,0.8)',
        pointRadius: false,
        pointColor: '#3b8bba',
        pointStrokeColor: 'rgba(60,141,188,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        data: [58, 68, 40, 59, 86, 67]
      },
    {
      label: 'Allocated(Lakhs)',
      backgroundColor: '#FFBD16   ',
      borderColor: 'rgba(210, 214, 222, 1)',
      pointRadius: false,
      pointColor: 'rgba(210, 214, 222, 1)',
      pointStrokeColor: '#c1c7d1',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(220,220,220,1)',
      data: [38, 45, 50, 39, 46, 57]
    
    }
    ]
    };
    // const data2 = {
    //   labels: this.dasboardData.unitWiseExpenditure.unitWise,
    //   datasets: [
    //     {
    //       label: 'Expenditure(Lakhs)',
    //       backgroundColor: 'rgba(60,141,188,0.9)',
    //       borderColor: 'rgba(60,141,188,0.8)',
    //       pointRadius: false,
    //       pointColor: '#3b8bba',
    //       pointStrokeColor: 'rgba(60,141,188,1)',
    //       pointHighlightFill: '#fff',
    //       pointHighlightStroke: 'rgba(60,141,188,1)',
    //       data: this.dasboardData.unitWiseExpenditure.expenditureUnit,
    //     },
    //     {
    //       label: 'Allocated(Lakhs)',
    //       backgroundColor: 'rgba(210, 214, 222, 1)',
    //       borderColor: 'rgba(210, 214, 222, 1)',
    //       pointRadius: false,
    //       pointColor: 'rgba(210, 214, 222, 1)',
    //       pointStrokeColor: '#c1c7d1',
    //       pointHighlightFill: '#fff',
    //       pointHighlightStroke: 'rgba(220,220,220,1)',
    //       data: this.dasboardData.unitWiseExpenditure.allocatedUnit,
    //     },
    //   ],
    // };
    const options2 = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          display: true,
        },
      },
    };
    const config2: ChartConfiguration = {
      type: 'bar',
      data: data2,
      options: options2,
    };
    
    const chartItem2: ChartItem = document.getElementById(
      'my-chart2'
    ) as ChartItem;
    new Chart(chartItem2, config2);
  }

  confirmRedirectModel() {
    Swal.fire({
      title: 'You are not authorized..!',
      text: 'Please contact to System Admin.',
      icon: 'warning',
      // showCancelButton: true,
      confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        this.redirectUri();
      }
    });
  }

  confirmModel(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.finallySubmit(data);
      }
    });
  }

  finallySubmit(data: any) {
    this.SpinnerService.show();
    var newSubmitJson = data;

    this.apiService
      .postApi(this.cons.api.getDashBoardDta, newSubmitJson)
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();

          let result: { [key: string]: any } = v;
          if (result['message'] == 'success') {
            this.sharedService.inbox = result['response'].inbox;
            this.sharedService.outbox = result['response'].outBox;
            this.sharedService.archive = result['response'].archived;
            this.sharedService.approve = result['response'].approved;
            this.common.successAlert(
              'Success',
              result['response']['msg'],
              'success'
            );
            this.budgetListData[this.mainIndexValue].allocationAmount =
              this.changeRevisedAmount;
            this.updateBudgetFormData.reset();
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => console.info('complete'),
      });
  }
  mainIndexValue: any;

  changeRevisedAmount: any;

  updateBudgetAllocationFund(updateBudgetFormDataValue: any) {
    // this.budgetListData.splice(index, 1);

    this.changeRevisedAmount = updateBudgetFormDataValue.revisedAmount;

    let submitJson = {
      transactionId: updateBudgetFormDataValue.transactionId,
      amount: updateBudgetFormDataValue.revisedAmount,
    };

    this.confirmModel(submitJson);
  }
  getSubHeadType() {
    this.apiService.getApi(this.cons.api.getSubHeadType).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.subHeadType = result['response'];
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
      },
      complete: () => console.info('complete'),
    });
  }
  getTableData(formDataValue: any) {

    this.SpinnerService.show();
    this.tableData=undefined;
    this.apiService
      .getApi(
        this.cons.api
          .getSubHeadWiseExpenditureByUnitIdFinYearIdAllocationTypeIdSubHeadTypeId +
          '/' +
          formDataValue.unit.unit +
          '/' +
          formDataValue.finYear.serialNo +
          '/' +
          formDataValue.subHeadType.subHeadTypeId +
          '/' +
          formDataValue.allocationType.allocTypeId +'/'+ formDataValue.rupeeUnit.amountTypeId+'/'+formDataValue.majorHead.majorHead
      )
      .subscribe({
        next: (v: object) => {
          this.SpinnerService.hide();
          let result: { [key: string]: any } = v;

          if (result['message'] == 'success') {
            this.tableData = result['response'][0].grTotalObjResp;
            // for (let i = 0; i < this.tableData.length; i++) {
            //   this.tableData[i].allocatedAmount = parseFloat(
            //     this.tableData[i].allocatedAmount
            //   ).toFixed(4);
            //   this.tableData[i].expenditureAmount = parseFloat(
            //     this.tableData[i].expenditureAmount
            //   ).toFixed(4);
            // }
            this.totalUAllocated=result['response'][0].sumAlloc;
            this.totalUBalance=result['response'][0].sumBal;
            this.totalUExpenditure=result['response'][0].sumExp;
            this.totalUExpenditurePer=result['response'][0].perBal;
            if(this.tableData[0]!=undefined)
              this.unitwiseUnit=this.tableData[0].amountIn;
            // for(let li of this.tableData){
            //   this.totalUAllocated=Number(parseFloat(li.allocatedAmount)+parseFloat(this.totalUAllocated)).toFixed(4);
            //   this.totalUExpenditure=Number(parseFloat(li.expenditureAmount)+parseFloat(this.totalUExpenditure)).toFixed(4);
            //   this.totalUBalance=Number(parseFloat(li.balAmount)+parseFloat(this.totalUBalance)).toFixed(4);
            // }
            // this.unitwiseUnit=this.tableData[0].amountIn;
            // if(Number(this.totalUAllocated)!=0)
            //   this.totalUExpenditurePer=Number(parseFloat(this.totalUExpenditure)*100/parseFloat(this.totalUAllocated)).toFixed(4);
          } else {
            this.common.faliureAlert('Please try later', result['message'], '');
          }
        },
        error: (e) => {
          this.SpinnerService.hide();
          console.error(e);
          this.common.faliureAlert('Error', e['error']['message'], 'error');
        },
        complete: () => console.info('complete'),
      });
  }

  allocationType: any[] = [];
  majorDataNew: any[] = [];
  totalUAllocated: any;
  totalUExpenditure: any;
  totalUBalance: any;
  totalUExpenditurePer: any;
  totalSAllocated: any;
  totalSExpenditure: any;
  totalSBalance: any;
  totalSExpenditurePer: any;
  getMajorDataNew() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getMajorData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.majorDataNew = result['response'].subHead;
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
      },
      complete: () => console.info('complete'),
    });
  }

  getAllocationTypeData() {
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getAllocationTypeData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          this.allocationType = result['response'];
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.error(e);
        this.common.faliureAlert('Error', e['error']['message'], 'error');
        //
        // if (e['status'] == '401') {
        //   this.redirectUri();
        // }
      },
      complete: () => console.info('complete'),
    });
  }
  getSubHead(formdata: any) {
    this.SpinnerService.show();
    let json={
      majorHead:formdata.majorHead.majorHead,
      budgetHeadType:formdata.subHeadType.subHeadTypeId
    };
    let url =this.cons.api.getAllSubHeadByMajorHead;
    this.apiService.postApi(url,json).subscribe(
      (results) => {
        let result: { [key: string]: any } = results;
        this.subHeads = result['response'];
        this.SpinnerService.hide();
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }

  getSubheadWiseTableData(formdata: any) {
    this.subHeadsResponse=undefined;
    let json={
      subHeadId:formdata.subHead.budgetCodeId,
      finYearId:formdata.finYear.serialNo,
      allocationTypeId:formdata.allocationType.allocTypeId,
      amounttypeId:formdata.rupeeUnit.amountTypeId
    }
    let url =this.cons.api.getDashBordSubHeadwiseExpenditure;
    debugger;
    this.apiService.postApi(url,json).subscribe(
      (results) => {
        let result: { [key: string]: any } = results;
        debugger;
        this.subHeadsResponse = result['response'][0].grTotalObj;
        this.totalSAllocated=result['response'][0].sumAlloc;
        this.totalSBalance=result['response'][0].sumBal;
        this.totalSExpenditure=result['response'][0].sumExp;
        this.totalSExpenditurePer=result['response'][0].perBal;
        this.subheadwiseUnit=this.subHeadsResponse[0].amountIn;
        // for(let li of this.subHeadsResponse){
        //   this.totalSAllocated=Number(parseFloat(li.allocatedAmount)+parseFloat(this.totalSAllocated)).toFixed(4);
        //   this.totalSExpenditure=Number(parseFloat(li.expenditureAmount)+parseFloat(this.totalSExpenditure)).toFixed(4);
        //   this.totalSBalance=Number(parseFloat(li.balAmount)+parseFloat(this.totalSBalance)).toFixed(4);
        // }
        // this.subheadwiseUnit=this.subHeadsResponse[0].amountIn;
        // if(parseFloat(this.totalSAllocated)!=0)
        //   this.totalSExpenditurePer=Number(parseFloat(this.totalSExpenditure)*100/parseFloat(this.totalSAllocated)).toFixed(4);

        this.SpinnerService.hide();
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );

  }

  onPageChange2(event: any) {
    this.q = event.page;
  }
}
