import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';

import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '';
  id: string;
  client: Client;

  columnas: string[] = ['createdAt', 'dinero', 'acciones'];
  datos: Transaction[] = [];
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  transForm: FormGroup;
  mailForm: FormGroup;

  constructor(
    private actRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private dataService: DataService,

  ) {

    //
    this.id = this.actRoute.snapshot.queryParams.id;
    this.client = {
      nombre: '',
      apellido: '',
      dni: '',
      cel: '',
      mail: '',
      createdAt: '',
      dinero: 0,
      provincia: '',
      pais: ''
    }
    //
    this.transForm = new FormGroup({
      dinero: new FormControl(null, [Validators.required, Validators.min(0)]),
      ingreso: new FormControl(true),
      client: new FormControl(this.id)

    });
    this.mailForm = new FormGroup({
      mail: new FormControl(null, [Validators.required]),
     
    });
    this.actRoute.paramMap.subscribe(params => {
      this.ngOnInit();
    });



  }

  ngOnInit() {
    this.httpClient.get<any>(this.dataService.obtenerUrlServer() + 'clients/info/' + this.id).subscribe(
      (res) => {

        console.log(res)
        this.client = res.client;
        console.log(this.client)
        this.mailForm.controls['mail'].setValue(this.client.mail)
        this.dataSource = new MatTableDataSource(res.transactions);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.generar() 
      }
      ,
      (err) => console.log(err)
    );
  }
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
  generar() {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.id), 'MdMiAJOREGeA').toString();
    this.value = ciphertext;
    console.log(ciphertext);
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'MdMiAJOREGeA');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData);
  }
  onSubmit() {
    this.httpClient.post<any>(this.dataService.obtenerUrlServer() + "transactions", this.transForm.value).subscribe(
      (res) => {
        Swal.fire('Recarga realizada!', '', 'success')
        this.transForm.controls['dinero'].setValue('')
        this.ngOnInit();
      }
      ,
      (err) => console.log(err)
    );
    console.log(this.transForm.value)
  }
  onSend(){
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.id), 'MdMiAJOREGeA').toString();
    this.httpClient.post<any>(this.dataService.obtenerUrlServer() + "clients/mail", {mail: this.mailForm.controls['mail'].value,qr:ciphertext}).subscribe(
      (res) => {
        Swal.fire('Envio realizado!', '', 'success')      
      }
      ,
      (err) => console.log(err)
    );
    console.log(this.transForm.value)
  }
}
export class Client {
  constructor(public nombre: string, public cel: string, public mail: string, public createdAt: string, public dni: string, public provincia: string, public pais: string, public apellido: string, public dinero: number) {
  }
}
export class Transaction {
  constructor(public createdAt: string, public ingreso: Boolean, public dinero: string) {
  }
}