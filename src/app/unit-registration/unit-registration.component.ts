import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unit-registration',
  templateUrl: './unit-registration.component.html',
  styleUrls: ['./unit-registration.component.scss']
})
export class UnitRegistrationComponent implements OnInit{
  ngOnInit(): void {
    $.getScript('assets/js/adminlte.js');
  
  }

}
