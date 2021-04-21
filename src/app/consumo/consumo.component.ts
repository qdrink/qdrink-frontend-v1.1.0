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
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.css']
})
export class ConsumoComponent implements OnInit {

  searchConsumo: FormGroup;
  transaciones = [];
  totalDinero: number = 0
  numero:number=0
  /**/
  columnas: string[] = ['createdAt', 'dinero'];
  datos: Transaction[] = [];
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /**/

  constructor(private dataService: DataService, private httpClient: HttpClient, private router: Router) {

    this.searchConsumo = new FormGroup({
      inicio: new FormControl(null, Validators.required),
      final: new FormControl(null, Validators.required)

    });
  }

  ngOnInit(): void {
  }
  calculation() {
    return this.dataSource.data.reduce((summ, v) => summ += parseInt(v.dinero), 0)
  }
  onSubmit() {
    this.httpClient.post<any>(this.dataService.obtenerUrlServer() + 'transactions/search', this.searchConsumo.value).subscribe(
      (res: Transaction[]) => {
        console.log(res)
        this.transaciones = res
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalDinero = this.dataSource.data.reduce((summ, v) => summ += parseInt(v.dinero), 0)
        this.numero= res.length
      }
      ,
      (err) => {
        console.log(err)
        Swal.fire('Se ha producido un error!', err.error.error, 'error')
      }
    );
  }
}
export class Transaction {
  constructor(public createdAt: string, public ingreso: Boolean, public dinero: string) {
  }
}