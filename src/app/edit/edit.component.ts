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
      apellido: new FormControl(Validators.required),
      dni: new FormControl(Validators.requiredTrue),
      dinero: new FormControl(),
      provincia: new FormControl(),
      pais: new FormControl(),
      mail: new FormControl(''),
      cel: new FormControl(''),

    });
  
    this.httpClient.get<any>(this.dataService.obtenerUrlServer()+'clients/'+this.id).subscribe(
      (res) => {
      this.editClient = this.fb.group({
        nombre: res.nombre,
        apellido: res.apellido,
        dni: res.dni,
        provincia: res.provincia,
        pais:res.pais,
        cel: res.cel,
        mail:res.mail,
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
