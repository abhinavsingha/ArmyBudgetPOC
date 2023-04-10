import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
// import {TDocumentDefinitions} from "pdfmake/interfaces";
import Swal from 'sweetalert2';

class cbReport {
  quarterStartDate: string | undefined;
  quarterEndDate: string | undefined;
  details: string | undefined;
  invoiceDate: string | undefined;
  invoiceNo: string | undefined;
  date: string | undefined;
  cbNo: string | undefined;
  quarter: any;
  firm: any;
  authority: any;
  sanctionNo: any;
  sanctionDate: any;
  amount: any;
  budgetAllocated: any;
  progressiveBill: any;
  categoryCode: any;
}
class newCb {
  contingentBilId: any;
  budgetHeadID: any;
  authUnitId: any;
  cbUnitId: any;
  uploadFileDate: any;
  finSerialNo: any;
  progressiveAmount: any;
  fileNo: any;
  fileDate: any;
  minorHead: any;
  cbUnit: any;
  finYearName: any;
  majorHead: any;
  subHead: any;
  amount: any;
  file: any;
  cbNo: any;
  cbDate: any;
  remarks: any;
  authority: any;
  authorityUnit: any;
  date: any;
  firmName: any;
  invoiceNo: any;
  invoiceDate: any;
  invoiceFile: any;
  returnRemarks: any;
  status: any;
  checked?: boolean;
  budgetAllocated: any;
  authorityId: any;
}
class submitCb {
  invoiceDocId: any;
  authorityDetails: any;
  onAccountOf: any;
  invoiceUploadId: any;
  budgetFinancialYearId: any;
  cbAmount: any;
  cbNumber: any;
  cbUnitId: any;
  cbDate: any;
  fileDate: any;
  fileNumber: any;
  docUploadDate: any;
  progressiveAmount: any;
  budgetHeadId: any;
  remark: any;
  vendorName: any;
  invoiceNo: any;
  invoiceDate: any;
  authList: authList[] | undefined;
  contingentBilId: any;
}
class authList {
  authDocId: any;
  authority: any;
  authUnitId: any;
  authDate: any;
  authorityId: any;
  remarks: any;
}
@Component({
  selector: 'app-new-contigent-bill',
  templateUrl: './new-contigent-bill.component.html',
  styleUrls: ['./new-contigent-bill.component.scss'],
})
export class NewContigentBillComponent implements OnInit {
  @ViewChild('browseFileInput') browseFileInput: any;
  @ViewChild('invoiceFileInput') invoiceFileInput: any;
  finYearData: any;
  subHeadData: any;
  cbUnitData: any;
  minorHeadData: any;
  majorHeadData: any;
  subHead: any;
  majorHead: any;
  minorHead: any;
  fundAvailable: any;
  cbList: newCb[] = [];
  formdata = new FormGroup({
    fileNo: new FormControl(),
    fileDate: new FormControl(),
    budgetAllocated: new FormControl(),
    minorHead: new FormControl(), //
    cbUnit: new FormControl(), //
    finYearName: new FormControl(),
    majorHead: new FormControl(),
    subHead: new FormControl(),
    amount: new FormControl('0'),
    file: new FormControl(),
    cbNo: new FormControl(),
    cbDate: new FormControl(),
    remarks: new FormControl(),
    authority: new FormControl(),
    authorityUnit: new FormControl(),
    date: new FormControl(),
    firmName: new FormControl(),
    invoiceNo: new FormControl(),
    invoiceDate: new FormControl(),
    invoiceFile: new FormControl(),
    returnRemarks: new FormControl(),
    progressive: new FormControl(0),
    balance: new FormControl(0),
  });
  budgetAllotted: any;
  billAmount: number = 0;
  expenditure: any;
  selectedFile: File | any = null;
  fileName = '';
  invoice: any;
  private uploadFileDate: any;
  constructor(
    private apiService: ApiCallingServiceService,
    private cons: ConstantsService,
    private SpinnerService: NgxSpinnerService,
    private common: CommonService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getDashboardData();
  }

  private getDashboardData() {
    this.SpinnerService.show();
    const postdata = {
      unitId: '000467',
      budgetFinancialYearId: '01',
      budgetHeadId: '',
    };
    this.apiService
      .postApi(this.cons.api.getDashboardData, postdata)
      .subscribe(
        (results) => {
          this.SpinnerService.hide();
          $.getScript('assets/js/adminlte.js');
          this.getMajorHead();
          this.getFinancialYear();
          this.getCgUnitData();
          // this.dummydata();
          let result: { [key: string]: any } = results;
          console.log(result['response']);
          // this.SpinnerService.show();
          // this.apiService.getApi(this.cons.api.getCb).subscribe(
          //   (res) => {
          //     this.SpinnerService.hide();
          //     let result: { [key: string]: any } = res;
          //     console.log(result['response']);
          //     let getCbList = result['response'];
          //
          //     for (let i = 0; i < getCbList.length; i++) {
          //       let url =
          //         this.cons.api.getAvailableFund +
          //         '/' +
          //         getCbList[i].cbUnitId.cbUnit;
          //       console.log(url);
          //       this.SpinnerService.show();
          //       this.apiService.getApi(url).subscribe(
          //         (res) => {
          //
          //           let result: { [key: string]: any } = res;
          //           this.budgetAllotted = result['response'].fundAvailable;
          //           const entry: newCb = {
          //             authUnitId: getCbList[i].authoritiesList[0].authUnit,
          //             cbUnitId: getCbList[i].cbUnitId.cbUnit,
          //             uploadFileDate: getCbList[i].fileDate,
          //             finSerialNo: getCbList[i].finYear.serialNo,
          //             progressiveAmount: getCbList[i].progressiveAmount,
          //             fileDate: getCbList[i].fileDate,
          //             minorHead: getCbList[i].budgetHeadID.minorHead,
          //             cbUnit: getCbList[i].cbUnitId.cgUnitShort,
          //             finYearName: getCbList[i].finYear.finYear,
          //             majorHead: getCbList[i].budgetHeadID.majorHead,
          //             subHead: getCbList[i].budgetHeadID.subHeadDescr,
          //             amount: getCbList[i].cbAmount,
          //             cbNo: getCbList[i].cbNo,
          //             cbDate: this.datePipe.transform(
          //               new Date(getCbList[i].cbDate),
          //               'yyyy-MM-dd'
          //             ),
          //             remarks: getCbList[i].remarks,
          //             authority: getCbList[i].authoritiesList[0].authority,
          //             authorityUnit: getCbList[i].authoritiesList[0].authUnit,
          //             date: this.datePipe.transform(
          //               new Date(getCbList[i].authoritiesList[0].authDate),
          //               'yyyy-MM-dd'
          //             ),
          //             firmName: getCbList[i].vendorName,
          //             invoiceNo: getCbList[i].invoiceNO,
          //             invoiceDate: getCbList[i].invoiceDate,
          //             invoiceFile: getCbList[i].fileID,
          //             returnRemarks: getCbList[i].authoritiesList[0].remarks,
          //             status: getCbList[i].status,
          //             budgetAllocated: this.budgetAllotted,
          //             checked: false,
          //             fileNo: getCbList[i].fileID,
          //             file: getCbList[i].authoritiesList[0].docId,
          //             budgetHeadID: getCbList[i].budgetHeadID,
          //             contingentBilId: getCbList[i].cbId,
          //             authorityId: getCbList[i].authoritiesList[0].authorityId,
          //           };
          //
          //           this.cbList.push(entry);
          //           this.SpinnerService.hide();
          //           },
          //         (error) => {
          //           console.log(error);
          //           this.SpinnerService.hide();
          //           //remove after test
          //           this.budgetAllotted = 0;
          //         }
          //       );
          //     }
          //   },
          //   (error) => {
          //     console.log(error);
          //   }
          // );
        },
        (error) => {
          console.log(error);
          // this.SpinnerService.hide();
        }
      );
  }
  addToList() {
    const undefinedValues: string[] = [];
    Object.keys(this.formdata.controls).forEach((key) => {
      const control = this.formdata.get(key);
      if (control != null) {
        if (!control.value) {
          if (
            key != 'returnRemarks' &&
            key != 'firmName' &&
            key != 'invoiceFile'
          ) {
            undefinedValues.push(key);
          }
        }
      }
    });
    if (this.invoice == undefined) {
      undefinedValues.push('invoiceFile');
    }
    if (undefinedValues.length == 0) {
      const cb: newCb = {
        authUnitId: this.formdata.get('authorityUnit')?.value.unit,
        cbUnitId: this.formdata.get('cbUnit')?.value.unit,
        finSerialNo: this.formdata.get('finYearName')?.value.serialNo,
        budgetAllocated: this.formdata.get('budgetAllocated')?.value,
        minorHead: this.formdata.get('minorHead')?.value.minorHead,
        cbUnit: this.formdata.get('cbUnit')?.value.cgUnitShort,
        finYearName: this.formdata.get('finYearName')?.value.finYear,
        majorHead: this.formdata.get('majorHead')?.value.majorHead,
        subHead: this.formdata.get('subHead')?.value.subHeadDescr,
        amount: this.formdata.get('amount')?.value,
        file: this.browseFile,
        cbNo: this.formdata.get('cbNo')?.value,
        cbDate: this.formdata.get('cbDate')?.value,
        remarks: this.formdata.get('remarks')?.value,
        authority: this.formdata.get('authority')?.value,
        authorityUnit: this.formdata.get('authorityUnit')?.value.cgUnitShort,
        date: this.formdata.get('date')?.value,
        firmName: this.formdata.get('firmName')?.value,
        invoiceNo: this.formdata.get('invoiceNo')?.value,
        invoiceDate: this.formdata.get('invoiceDate')?.value,
        invoiceFile: this.invoice,
        returnRemarks: this.formdata.get('returnRemarks')?.value,
        status: 'pending',
        checked: false,
        progressiveAmount: this.formdata.get('progressive')?.value,
        fileNo: this.formdata.get('fileNo')?.value,
        fileDate: this.formdata.get('fileDate')?.value,
        uploadFileDate: this.uploadFileDate,
        authorityId: undefined,
        budgetHeadID: '123',
        contingentBilId: undefined,
      };

      let flag = false;
      for (let i = 0; i < this.cbList.length; i++) {
        if (this.cbList[i].cbNo == cb.cbNo) {
          flag = true;
        }
      }
      if (!flag) {
        this.cbList.push(cb);
        this.formdata.reset();
        // this.browseFileInput.nativeElement.reset();
      }
      // console.log(this.cbList);
    } else {
      Swal.fire('Enter missing data');
      // console.log(undefinedValues)
    }
  }
  getFinancialYear() {
    const tokenValueHeader = localStorage.getItem('newToken');
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = results;
        this.finYearData = result['response'];
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    );
  }
  getCgUnitData() {
    this.SpinnerService.show();
    var comboJson = null;
    this.apiService.getApi(this.cons.api.getCgUnitData).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;
        this.cbUnitData = result['response'];
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    );
  }
  private getMajorHead() {
    // const userJson = {userRoleId: "ICGS Delhi", userName: "kya hai ye", userUnitId: "000015"}
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getMajorData).subscribe({
      next: (v: object) => {
        let result: { [key: string]: any } = v;
        if (result['message'] == 'success') {
          localStorage.setItem('newToken', result['response']['token']);
          this.majorHeadData = result['response'].subHead;
          this.minorHeadData = result['response'].subHead;
          this.SpinnerService.hide();
        } else {
          this.common.faliureAlert('Please try later', result['message'], '');
        }
      },
      error: (e) => {
        this.SpinnerService.hide();
        console.log('error');
      },
      complete: () => console.info('complete'),
    });
  }
  setSubHead() {
    this.SpinnerService.show();
    let url =
      this.cons.api.getAllSubHeadByMajorHead + '/' + this.majorHead.majorHead;
    this.apiService.getApi(url).subscribe(
      (results) => {
        let result: { [key: string]: any } = results;
        this.subHeadData = result['response'];
        this.SpinnerService.hide();
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
      }
    );
  }
  getBudgetAllotted() {
    this.SpinnerService.show();
    let url =
      this.cons.api.getAvailableFund +
      '/' +
      this.formdata.get('cbUnit')?.value.unit;
    this.apiService.getApi(url).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = res;
        this.budgetAllotted = result['response'].fundAvailable;
        this.formdata.get('budgetAllocated')?.setValue(this.budgetAllotted);
        this.SpinnerService.hide();
        this.getExpenditure();
      },
      (error) => {
        console.log(error);
        this.SpinnerService.hide();
        //remove after test
        this.budgetAllotted = 0;
        this.formdata.get('budgetAllocated')?.setValue(this.budgetAllotted);
      }
    );
    this.getExpenditure();
  }
  private getExpenditure() {
    this.expenditure = 0;
    this.formdata.get('progressive')?.setValue(this.expenditure);
    this.updateExpenditure();
  }
  updateExpenditure() {
    if (this.formdata.get('amount')?.value == null) {
      Swal.fire('Invalid amount. Enter Number');
    } else {
      this.expenditure = parseFloat(this.expenditure) + this.billAmount;
      this.formdata.get('progressive')?.setValue(this.expenditure);
      this.formdata
        .get('balance')
        ?.setValue(this.budgetAllotted - this.expenditure);
    }
  }
  browseFile() {
    const file: File = this.browseFileInput.nativeElement.files[0];
    console.log(file);
    const formData = new FormData();
    console.log(this.formdata.get('file')?.value);
    formData.append('file', file);
    this.SpinnerService.show();
    this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.common.successAlert(
            'File Uploaded',
            result['response']['msg'],
            'success'
          );
          this.browseFile = result['response'].uploadDocId;
          this.uploadFileDate = this.datePipe.transform(
            new Date(),
            'yyyy-MM-dd'
          );
          console.log(this.uploadFileDate);
          this.SpinnerService.hide();
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
  invoiceUpload() {
    const file: File = this.invoiceFileInput.nativeElement.files[0];
    console.log(file);
    const formData = new FormData();
    console.log(this.formdata.get('file')?.value);
    formData.append('file', file);
    this.SpinnerService.show();
    this.apiService.postApi(this.cons.api.fileUpload, formData).subscribe({
      next: (v: object) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = v;

        if (result['message'] == 'success') {
          this.common.successAlert(
            'Success',
            result['response']['msg'],
            'success'
          );
          this.invoice = result['response'].uploadDocId;
          this.SpinnerService.hide();
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
  getCheckedRows(cbNo: any) {
    this.cbList.forEach((cbEntry) => {
      if (cbEntry.cbNo == cbNo && cbEntry.checked == false) {
        cbEntry.checked = true;
        this.updateFormdata(cbEntry);
      } else if (cbEntry.cbNo == cbNo && cbEntry.checked == true) {
        cbEntry.checked = false;
        this.formdata.reset();
      }
      if (cbEntry.checked) {
        console.log(cbEntry.cbNo + ' ');
      }
    });
  }
  private updateFormdata(cbEntry: newCb) {
    console.log('cbentry' + cbEntry);
    for (let i = 0; i < this.majorHeadData.length; i++) {
      let major = this.majorHeadData[i];
      if (major.majorHead == cbEntry.majorHead) {
        this.formdata.get('majorHead')?.setValue(cbEntry.majorHead);
        this.majorHead = major;
        if (this.subHeadData == undefined) {
          this.SpinnerService.show();
          let url =
            this.cons.api.getAllSubHeadByMajorHead +
            '/' +
            this.majorHead.majorHead;
          this.apiService.getApi(url).subscribe((results) => {
            let result: { [key: string]: any } = results;
            this.subHeadData = result['response'];
            for (let i = 0; i < this.subHeadData.length; i++) {
              let sub = this.subHeadData[i];
              if (sub.subHeadDescr == cbEntry.subHead) {
                this.formdata.get('subHead')?.setValue(sub);
              }
            }
            this.SpinnerService.hide();
          });
        } else {
          for (let i = 0; i < this.subHeadData.length; i++) {
            let sub = this.subHeadData[i];
            if (sub.subHeadDescr == cbEntry.subHead) {
              this.formdata.get('subHead')?.setValue(sub);
            }
          }
        }
      }
    }
    this.formdata.get('amount')?.setValue(cbEntry.amount);
    for (let i = 0; i < this.cbUnitData.length; i++) {
      if (this.cbUnitData[i].cgUnitShort == cbEntry.cbUnit)
        this.formdata.get('cbUnit')?.setValue(this.cbUnitData[i]);
      if (
        this.cbUnitData[i].cgUnitShort == cbEntry.authorityUnit ||
        this.cbUnitData[i].unit == cbEntry.authorityUnit
      )
        this.formdata.get('authorityUnit')?.setValue(this.cbUnitData[i]);
    }
    this.formdata.get('budgetAllocated')?.setValue(cbEntry.budgetAllocated);
    this.formdata.get('progressive')?.setValue(cbEntry.progressiveAmount);
    this.formdata
      .get('balance')
      ?.setValue(cbEntry.budgetAllocated - cbEntry.progressiveAmount);
    // this.formdata.get('file')?.setValue(cbEntry.file);
    this.formdata.get('cbNo')?.setValue(cbEntry.cbNo);
    this.formdata.get('cbDate')?.setValue(cbEntry.cbDate);
    this.formdata.get('remarks')?.setValue(cbEntry.remarks);
    this.formdata.get('authority')?.setValue(cbEntry.authority);
    this.formdata.get('date')?.setValue(cbEntry.date);
    this.formdata.get('firmName')?.setValue(cbEntry.firmName);
    this.formdata.get('invoiceNo')?.setValue(cbEntry.invoiceNo);
    this.formdata.get('invoiceDate')?.setValue(cbEntry.invoiceDate);
    // this.formdata.get('invoiceFile')?.setValue(cbEntry.invoiceFile);
    this.formdata.get('returnRemarks')?.setValue(cbEntry.returnRemarks);
    for (let i = 0; i < this.minorHeadData.length; i++) {
      if (this.minorHeadData[i].minorHead == cbEntry.minorHead) {
        this.formdata.get('minorHead')?.setValue(this.minorHeadData[i]);
      }
    }
    for (let i = 0; i < this.finYearData.length; i++) {
      if (this.finYearData[i].finYear == cbEntry.finYearName)
        this.formdata.get('finYearName')?.setValue(this.finYearData[i]);
    }
    this.formdata.get('fileNo')?.setValue(cbEntry.fileNo);
    this.formdata.get('fileDate')?.setValue(cbEntry.fileDate);
  }
  updateList() {
    for (let i = 0; i < this.cbList.length; i++) {
      if (this.formdata.get('cbNo')?.value == this.cbList[i].cbNo) {
        if (
          this.cbList[i].status == 'Pending' ||
          this.cbList[i].status == 'Rejected'
        ) {
          this.cbList[i].budgetAllocated =
            this.formdata.get('budgetAllocated')?.value;
          this.cbList[i].amount = this.formdata.get('amount')?.value;
          this.cbList[i].authority = this.formdata.get('authority')?.value;
          this.cbList[i].authorityUnit =
            this.formdata.get('authorityUnit')?.value.cgUnitShort;
          this.cbList[i].cbDate = this.formdata.get('cbDate')?.value;
          this.cbList[i].cbUnit =
            this.formdata.get('cbUnit')?.value.cgUnitShort;
          this.cbList[i].date = this.formdata.get('date')?.value;
          this.cbList[i].file = this.formdata.get('file')?.value;
          this.cbList[i].finYearName =
            this.formdata.get('finYearName')?.value.finYear;
          this.cbList[i].firmName = this.formdata.get('firmName')?.value;
          this.cbList[i].invoiceDate = this.formdata.get('invoiceDate')?.value;
          this.cbList[i].invoiceFile = this.formdata.get('invoiceFile')?.value;
          this.cbList[i].invoiceNo = this.formdata.get('invoiceNo')?.value;
          this.cbList[i].majorHead =
            this.formdata.get('majorHead')?.value.majorHead;
          this.cbList[i].minorHead =
            this.formdata.get('minorHead')?.value.minorHead;
          this.cbList[i].remarks = this.formdata.get('remarks')?.value;
          this.cbList[i].returnRemarks =
            this.formdata.get('returnRemarks')?.value;
          this.cbList[i].budgetAllocated = 'pending';
          this.cbList[i].subHead =
            this.formdata.get('subHead')?.value.subHeadDescr;
          //call api to update cb

          const updateAuthority: authList = {
            authDocId: this.browseFile,
            authority: this.cbList[i].authority,
            authUnitId: this.cbList[i].authUnitId,
            authDate: this.cbList[i].date,
            authorityId: this.cbList[i].authorityId,
            remarks: this.cbList[i].returnRemarks,
          };
          let budgetId = undefined;
          for (let j = 0; j < this.majorHeadData.length; j++) {
            if (this.majorHeadData[j].majorHead == this.cbList[i].majorHead)
              budgetId = this.majorHeadData[j].budgetCodeId;
          }
          const updateCb: submitCb = {
            onAccountOf: 'onAccountOf',
            authorityDetails:
              'Sl. 10.1 of Schedule -10 of DFPCG-2017 vide Govt. of India , Ministry of Defence letter No. PF/0104/CGHQ/2017/D (CG) dated 04 Jul 2017',
            budgetHeadId: budgetId,
            budgetFinancialYearId: this.cbList[i].finSerialNo,
            cbAmount: this.cbList[i].amount,
            cbNumber: this.cbList[i].cbNo,
            cbUnitId: this.cbList[i].cbUnitId,
            fileNumber: this.cbList[i].fileNo,
            progressiveAmount: this.cbList[i].progressiveAmount,
            remark: this.cbList[i].remarks,
            vendorName: this.cbList[i].firmName,
            invoiceNo: this.cbList[i].invoiceNo,
            docUploadDate: this.cbList[i].uploadFileDate,
            fileDate: this.cbList[i].fileDate,
            cbDate: this.cbList[i].cbDate,
            invoiceDate: this.cbList[i].invoiceDate,
            invoiceUploadId: this.invoice,
            invoiceDocId: this.invoice,
            authList: [updateAuthority],
            contingentBilId: this.cbList[i].contingentBilId,
          };
          let updateList = [updateCb];
          this.apiService
            .postApi(this.cons.api.updateContingentBill, updateList)
            .subscribe({
              next: (v: object) => {
                let result: { [key: string]: any } = v;
                if (result['message'] == 'success') {
                  console.log(result['response']);
                  this.SpinnerService.hide();
                } else {
                  this.common.faliureAlert(
                    'Please try later',
                    result['message'],
                    ''
                  );
                  this.SpinnerService.hide();
                }
              },
            });
        } else if (this.cbList[i].status == 'pending') {
          let entry: newCb = {
            authUnitId: this.formdata.get('authorityUnit')?.value.unit,
            cbUnitId: this.formdata.get('cbUnit')?.value.unit,
            finSerialNo: this.formdata.get('finYearName')?.value.serialNo,
            budgetAllocated: this.formdata.get('budgetAllocated')?.value,
            minorHead: this.formdata.get('minorHead')?.value.minorHead,
            cbUnit: this.formdata.get('cbUnit')?.value.cgUnitShort,
            finYearName: this.formdata.get('finYearName')?.value.finYear,
            majorHead: this.formdata.get('majorHead')?.value.majorHead,
            subHead: this.formdata.get('subHead')?.value.subHeadDescr,
            amount: this.formdata.get('amount')?.value,
            file: this.browseFile,
            cbNo: this.formdata.get('cbNo')?.value,
            cbDate: this.formdata.get('cbDate')?.value,
            remarks: this.formdata.get('remarks')?.value,
            authority: this.formdata.get('authority')?.value,
            authorityUnit:
              this.formdata.get('authorityUnit')?.value.cgUnitShort,
            date: this.formdata.get('date')?.value,
            firmName: this.formdata.get('firmName')?.value,
            invoiceNo: this.formdata.get('invoiceNo')?.value,
            invoiceDate: this.formdata.get('invoiceDate')?.value,
            invoiceFile: this.invoice,
            returnRemarks: this.formdata.get('returnRemarks')?.value,
            status: 'pending',
            checked: false,
            progressiveAmount: this.formdata.get('progressive')?.value,
            fileNo: this.formdata.get('fileNo')?.value,
            fileDate: this.formdata.get('fileDate')?.value,
            uploadFileDate: this.uploadFileDate,
            authorityId: undefined,
            budgetHeadID: '123',
            contingentBilId: undefined,
          };
          this.cbList[i] = entry;
        } else {
          Swal.fire('Cannot be updated');
        }
      }
    }
  }
  submitList() {
    const submitList: submitCb[] = [];
    for (let i = 0; i < this.cbList.length; i++) {
      let budgetId: string = '';
      for (let j = 0; j < this.majorHeadData.length; j++) {
        if (this.majorHeadData[j].majorHead == this.cbList[i].majorHead)
          budgetId = this.majorHeadData[j].budgetCodeId;
      }
      const auth: authList = {
        authDocId: this.cbList[i].file,
        authority: this.cbList[i].authority,
        authUnitId: this.cbList[i].authUnitId,
        authDate: this.cbList[i].date,
        authorityId: undefined,
        remarks: this.cbList[i].returnRemarks,
      };
      const authList: authList[] = [auth];
      const cb: submitCb = {
        onAccountOf: 'Expenditure on account of Quaterly Payment',
        authorityDetails:
          'Sl. 10.1 of Schedule -10 of DFPCG-2017 vide Govt. of India , Ministry of Defence letter No. PF/0104/CGHQ/2017/D (CG) dated 04 Jul 2017',
        budgetHeadId: budgetId,
        budgetFinancialYearId: this.cbList[i].finSerialNo,
        cbAmount: this.cbList[i].amount,
        cbNumber: this.cbList[i].cbNo,
        cbUnitId: this.cbList[i].cbUnitId,
        fileNumber: this.cbList[i].fileNo,
        progressiveAmount: this.cbList[i].progressiveAmount,
        remark: this.cbList[i].remarks,
        vendorName: this.cbList[i].firmName,
        invoiceNo: this.cbList[i].invoiceNo,
        docUploadDate: this.cbList[i].uploadFileDate,
        fileDate: this.cbList[i].fileDate,
        cbDate: this.cbList[i].cbDate,
        invoiceDate: this.cbList[i].invoiceDate,
        invoiceUploadId: this.cbList[i].invoiceFile,
        invoiceDocId: this.cbList[i].invoiceFile,
        authList: authList,
        contingentBilId: undefined,
      };
      if (this.cbList[i].status == 'pending') submitList.push(cb);
    }
    if (submitList.length == 0) {
      Swal.fire('Add more Data');
    } else {
      this.SpinnerService.show();
      this.apiService
        .postApi(this.cons.api.saveContingentBill, submitList)
        .subscribe({
          next: (v: object) => {
            let result: { [key: string]: any } = v;
            if (result['message'] == 'success') {

              this.common.successAlert(
                'Success',
                result['response']['msg'],
                'success'
              );
              console.log(result['response']);
              this.SpinnerService.hide();
            } else {
              this.common.faliureAlert(
                'Please try later',
                result['message'],
                ''
              );
              this.SpinnerService.hide();
            }
          },
        });
      this.formdata.reset();
    }
    this.SpinnerService.hide();
    console.log(submitList);
  }
  confirmModel() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitList();
      }
    });
  }


  // generatePdf(cb:cbReport){
  //   const documentDefinition: TDocumentDefinitions = {
  //     content: [
  //       {
  //         text: 'CONTINGENT BILL',
  //         fontSize: 16,
  //         bold: true,
  //         alignment: 'center',
  //         margin: [0, 0, 0, 20]
  //       },
  //       {
  //         text: 'Expenditure on account of Quaterly Payment('+cb.quarter+') towards '+cb.firm+'.',
  //         fontSize: 12,
  //         alignment: 'justify'
  //       },
  //       {
  //         style: 'tableExample',
  //         color: '#444',
  //         table: {
  //           widths: ['80%', 'auto'],
  //           headerRows: 0,
  //           body: [
  //             [{border: [false, false, false, false],text: 'Total Amount/Budget Allocated', alignment: 'left'},{border: [false, false, false, false],text: cb.budgetAllocated}],
  //             [{border: [false, false, false, false],text: 'Progressive Expenditure Including this bill', alignment: 'left'}, {border: [false, false, false, false],text:cb.progressiveBill+cb.amount}],
  //             [{border: [false, false, false, false],text:'Balance Amount',alignment:'left'}, {border: [false, false, false, false],text:cb.budgetAllocated-(cb.progressiveBill+cb.amount)}]
  //           ]
  //         }
  //       },
  //       {
  //         text: 'Authority: (a) Sl. 10.1 of Schedule-10 of DFPCG-2017 vide govt. of India, Ministry of Defence letter No. '+cb.cbNo+' (CG) dated '+cb.date+'.\n' +
  //               '\t(b) CGHQ Sanction No. '+cb.sanctionNo+' dated '+cb.sanctionDate+'.\n',
  //         fontSize: 12,
  //         alignment: 'justify'
  //       },
  //       {
  //         style: 'tableExample',
  //         color: '#444',
  //         table: {
  //           widths: ['5%','75%', '20%'],
  //           headerRows: 1,
  //           body: [
  //             [{border: [true, true, true, true],text: 'Ser', alignment: 'center'},{border: [true, true, true, true],text: 'Details of Expenditure', alignment: 'center'},{border: [true, true, true, true],text: 'Amount', alignment: 'center'}],
  //             [{border: [true, true, true, true],text: '01', alignment: 'center'}, {border: [true, true, true, true],text: 'Expenditure incurred towards quarterly payment for the '+cb.quarter+' from ('+cb.quarterStartDate +'to '+cb.quarterEndDate+') in respect of '+cb.details+ ' through '+cb.firm+ ' vide their Invoice/Bill '+cb.invoiceNo+' dated '+cb.invoiceDate, alignment: 'justify'},{border: [true, true, true, true],text: cb.amount, alignment: 'center'}],
  //             // [{border: [true, true, true, true],text:'Balance Amount',alignment:'left'}, {border: [false, false, false, false],text:cb.budgetAllocated-(cb.progressiveBill+cb.amount)}]
  //           ]
  //         }
  //       }
  //     ],	styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         margin: [0, 0, 0, 10]
  //       },
  //       subheader: {
  //         fontSize: 16,
  //         bold: true,
  //         margin: [0, 10, 0, 5]
  //       },
  //       tableExample: {
  //         margin: [0, 5, 0, 15]
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 13,
  //         color: 'black'
  //       }
  //     }
  //   };
  //   pdfMake.createPdf(documentDefinition).open();
  // }
  // setReport(cb:any) {
  //   const report:cbReport= {
  //     date: cb.date,
  //     cbNo: cb.cbNo,
  //     quarter: "1st",
  //     firm: cb.firmName,
  //     authority: cb.authority,
  //     sanctionNo: "sanction No",
  //     sanctionDate: "sancDate",
  //     amount: cb.amount,
  //     budgetAllocated: cb.budgetAllocated,
  //     progressiveBill: cb.progressiveAmount,
  //     categoryCode: "category",
  //     invoiceDate: '',
  //     invoiceNo: '',
  //     quarterStartDate: '',
  //     quarterEndDate: '',
  //     details: ''
  //   };
  //   this.generatePdf(report);
  //   console.log(cb);
  // }
}
