import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {

  clients = [];

  columnas: string[] = ['apellido', 'nombre', 'dni', 'dinero', 'acciones'];

  datos: Client[] = [];
  dataSource: MatTableDataSource<Client>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private dataService: DataService,
    private httpClient: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.httpClient.get<any>(this.dataService.obtenerUrlServer() + 'clients').subscribe((data: Client[]) => {
      console.log(data);
      this.clients = data;
      this.dataSource = new MatTableDataSource(this.clients);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
  delete(id: any) {
    console.log(id)
    this.httpClient.delete<any>(this.dataService.obtenerUrlServer() + 'clients/' + id).subscribe(
      (res) => {
        console.log(res)
        this.ngOnInit();
      }
      ,
      (err) => console.log(err)
    );
  }

}
export class Articulo {
  constructor(public name: string, public descripcion: string, public precio: number) {
  }

}
export class Client {
  constructor(public nombre: string, public apellido: string, public dni: string, public dinero: number) {
  }
}