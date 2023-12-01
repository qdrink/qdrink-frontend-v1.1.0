import { Component, OnInit,NgZone } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute} from '@angular/router';
import { Observable } from  "rxjs/Observable";



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {

  editClient: FormGroup;
  id: string;
  constructor(
    private actRoute: ActivatedRoute,
    private dataService:DataService,
    private httpClient: HttpClient,
    private router: Router,
    public fb: FormBuilder,
    ) {
      
    this.id = this.actRoute.snapshot.queryParams.id;

    this.editClient = new FormGroup({
      nombre: new FormControl(Validators.required),
      apellido: new FormControl(),
      dni: new FormControl(),
      dinero: new FormControl(),
      provincia: new FormControl(),
      pais: new FormControl(),
      mail: new FormControl(''),
      cel: new FormControl(''),
      ocupado: new FormControl(''),
      nacimiento: new FormControl('')

    });
  
    this.httpClient.get<any>(this.dataService.obtenerUrlServer()+'clients/info/'+this.id).subscribe(
      (res) => {
      this.editClient = this.fb.group({
        nombre: res.client.nombre,
        apellido: res.client.apellido,
        dni: res.client.dni,
        provincia: res.client.provincia,
        pais:res.client.pais,
        cel: res.client.cel,
        mail:res.client.mail,
        ocupado:res.client.ocupado,
        nacimiento: res.client.nacimiento
      })
      }
      ,
      (err) => console.log(err)
    );
  }

   ngOnInit(): void {
    
  }
  onSubmit() {
    
     this.httpClient.put<any>(this.dataService.obtenerUrlServer()+'clients/'+this.id, this.editClient.value).subscribe(
       (res) => {
       this.router.navigate(['/list']);
       }
       ,
       (err) => console.log(err)
     );
     }

}
