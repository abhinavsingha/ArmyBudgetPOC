import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCallingServiceService } from '../services/api-calling/api-calling-service.service';
import { ConstantsService } from '../services/constants/constants.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../services/common/common.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared/shared.service';
import * as $ from 'jquery';
// import { UploadDocuments } from '../model/upload-documents';

@Component({
  selector: 'app-new-contigent-bill',
  templateUrl: './sanction.component.html',
  styleUrls: ['./sanction.component.scss'],
})
export class SanctionComponent implements OnInit {
  @ViewChild('browseFileInput') browseFileInput: any;
  @ViewChild('invoiceFileInput') invoiceFileInput: any;
  @ViewChild('uploadFileInput') uploadFileInput: any;

  formData = new FormGroup({
    uploadFile: new FormControl(),
  });
  formdata = new FormGroup({
    finYearName:new FormControl(),
    sanctionNumber:new FormControl(),
    sanctionName:new FormControl(),
    sanctionDate:new FormControl(),
    sanctionType:new FormControl(),
    sanctionAmount:new FormControl(),
    firmName:new FormControl(),
    workOrderNo:new FormControl(),
    invoiceNo:new FormControl(),
    invoiceDate:new FormControl(),
    file:new FormControl(),
    sanctionDetail:new FormControl(),
    authDetail:new FormControl(),
  });
  invoice: any;
  browse: any;
  private uploadFileDate: any;
  private invoicePath: any;
  finYearData: any;
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

  ngOnInit(): void {
    this.sharedService.updateInbox();
    $.getScript('assets/js/adminlte.js');

    this.getFinancialYear();

  }






  getFinancialYear() {
    const tokenValueHeader = localStorage.getItem('newToken');
    this.SpinnerService.show();
    this.apiService.getApi(this.cons.api.getBudgetFinYear).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let result: { [key: string]: any } = results;
        this.finYearData = result['response'];
        // this.formdata.get('finYearName')?.setValue(this.finYearData[0]);
      },
      (error) => {
        console.error(error);
        this.SpinnerService.hide();
      }
    );
  }










  upload(key: string) {
    if (key == 'invoice') {
      const file: File = this.invoiceFileInput.nativeElement.files[0];
      // console.log(file);
      const formData = new FormData();
      // console.log(this.formdata.get('file')?.value);
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
            this.invoicePath = result['response'].uploadPathUrl;
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
    } else {
      const file: File = this.browseFileInput.nativeElement.files[0];
      // console.log(file);
      const formData = new FormData();
      // console.log(this.formdata.get('file')?.value);
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
            this.browse = result['response'].uploadDocId;
            this.uploadFileDate = this.datePipe.transform(
              new Date(),
              'yyyy-MM-dd'
            );
            // console.log(this.uploadFileDate);
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
  }
  cdaDatacb:any;
  sanctionType: any;
  sanctionTypes: any[]=[{value:'Transfer'}];




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

      }else{

      }
    });
  }


  submitList(formData:any)
  {

  }
}
