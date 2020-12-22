import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import * as CryptoJS from 'crypto-js';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '';
  ///
  elementType1 = NgxQrcodeElementTypes.URL;
  correctionLevel1 = NgxQrcodeErrorCorrectionLevels.HIGH;
  value1 = '';
  //
  elementType2 = NgxQrcodeElementTypes.URL;
  correctionLevel2 = NgxQrcodeErrorCorrectionLevels.HIGH;
  value2 = '';
  //
  mailForm: FormGroup; //configuracion pico
  mailForm1: FormGroup;//cliente general
  mailForm2: FormGroup;//configuracion local

  //
  info: Info
  errores
  constructor(
    private httpClient: HttpClient,
    private dataService: DataService) {
    this.info = {
      transactions: '',
      ingreso: '',
      users: '',
      salida: ''
    }
   // this.errores = this.numToBit(10)
    console.log(this.errores);
    this.generar()
    this.generar1()
    this.generar2()
    this.mailForm = new FormGroup({
      mail: new FormControl('rdcocuelle@yahoo.com.ar', [Validators.required]),

    });
    this.mailForm1 = new FormGroup({
      mail1: new FormControl('rdcocuelle@yahoo.com.ar', [Validators.required]),

    });
    this.mailForm2 = new FormGroup({
      mail2: new FormControl('rdcocuelle@yahoo.com.ar', [Validators.required]),

    });
  }


  generar() {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify('ConfiguracionPico'), 'MdMiAJOREGeA').toString();
    this.value = ciphertext;
    console.log(ciphertext);
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'MdMiAJOREGeA');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData);
  }
  numToBit(num) {
    var number = num
    var result = []
    for (let i = 0; i < 6; i++)
      result[i] = '0'

    if (num >= 32) {
      result[5] = '1'
      num = num - 32
    }
    if (num >= 16) {
      result[4] = '1'
      num = num - 16
    }
    if (num >= 8) {
      result[3] = '1'
      num = num - 8
    }
    if (num >= 4) {
      result[2] = '1'
      num = num - 4
    }
    if (num >= 2) {
      result[1] = '1'
      num = num - 2
    }
    if (num >= 1) {
      result[0] = '1'
      num = num - 1
    }
    return result
  }
  generar1() {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify('ClienteGeneral'), 'MdMiAJOREGeA').toString();
    this.value1 = ciphertext;
    console.log(ciphertext);
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'MdMiAJOREGeA');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData);
  }
  generar2() {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify('ConfiguracionLocal'), 'MdMiAJOREGeA').toString();
    this.value2 = ciphertext;
    console.log(ciphertext);
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'MdMiAJOREGeA');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData);
  }
  onSend() {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify('ConfiguracionPico'), 'MdMiAJOREGeA').toString();
    this.httpClient.post<any>(this.dataService.obtenerUrlServer() + "clients/mail", { texto: 'Código QR - Configuracíon pico', mail: this.mailForm.controls['mail'].value, qr: ciphertext }).subscribe(
      (res) => {
        Swal.fire('Envio realizado!', '', 'success')
      }
      ,
      (err) => console.log(err)
    );
  }
  onSend1() {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify('ClienteGeneral'), 'MdMiAJOREGeA').toString();
    this.httpClient.post<any>(this.dataService.obtenerUrlServer() + "clients/mail", { texto: 'Código QR - Cliente General', mail: this.mailForm1.controls['mail1'].value, qr: ciphertext }).subscribe(
      (res) => {
        Swal.fire('Envio realizado!', '', 'success')
      }
      ,
      (err) => console.log(err)
    );
  }
  onSend2() {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify('ConfiguracionLocal'), 'MdMiAJOREGeA').toString();
    this.httpClient.post<any>(this.dataService.obtenerUrlServer() + "clients/mail", { texto: 'Código QR - Configuracion tablet', mail: this.mailForm2.controls['mail2'].value, qr: ciphertext }).subscribe(
      (res) => {
        Swal.fire('Envio realizado!', '', 'success')
      }
      ,
      (err) => console.log(err)
    );
  }
  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };
  ngOnInit() {
    ////
    this.httpClient.get<any>(this.dataService.obtenerUrlServer() + 'clients/info').subscribe(data => {
      //console.log(data);
      this.info = data
    })
    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    const dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);


    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    }

    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);



    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

}
export class Info {
  constructor(public users: string, public ingreso: string, public salida: string, public transactions: string) {
  }
}