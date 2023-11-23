import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addClient: FormGroup;

  constructor(private dataService: DataService, private httpClient: HttpClient, private router: Router) {

    this.addClient = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      apellido: new FormControl(null),
      dni: new FormControl(null),
      provincia: new FormControl('San Juan'),
      pais: new FormControl('Argentina'),
      mail: new FormControl(''),
      cel: new FormControl('549264', Validators.required),
      nacimiento: new FormControl(''),

    });
  }

  ngOnInit(): void {
  }
  onSubmit() {
    this.httpClient.post<any>(this.dataService.obtenerUrlServer()+'clients', this.addClient.value).subscribe(
      (res) => {
        Swal.fire('Recarga realizada!','', 'success')
        this.router.navigate(['/list']);
      }
      ,
      (err) => {console.log(err)
        Swal.fire('Se ha producido un error!',err.error.error, 'error')}
    );
  }
}
