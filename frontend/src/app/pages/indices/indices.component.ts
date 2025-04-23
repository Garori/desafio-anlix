import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { IntegrationAPIService } from '../../integration-api.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ExportToCSVComponent } from '../../components/export-to-csv/export-to-csv.component';
import { ExportService } from '../../export.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-indices',
  imports: [ExportToCSVComponent, CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, MatDividerModule, MatExpansionModule, MatTableModule],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  templateUrl: './indices.component.html',
  styleUrl: './indices.component.scss'
})
export class IndicesComponent {

  constructor(private integrationAPIService: IntegrationAPIService, private exportService: ExportService) {
  }
  datesIndices: any[] = [];

  displayedColumnsCardiaco: string[] = ['datetime', 'indice_cardiaco'];
  displayedColumnsPulmonar: string[] = ['datetime', 'indice_pulmonar'];

  data_str = ""
  data_final_str = ""

  
  indicesForm = new FormGroup({
    data: new FormControl(moment(), [Validators.required, Validators.minLength(5)]),
    data_final: new FormControl(moment() ),
  });

  handleExport(){
    console.log("entrei");
    let to_export:object[] = [];
    this.datesIndices.forEach(element => {
      // let aux:{[key:string]:any} = {}
      element["data"]["cardiaco"].forEach((element2: { [x: string]: any; }) => {
        element2["nome"] = element["data"]["nome"];
        element2["cpf"] = element["data"]["cpf"];
        element2["indice_pulmonar"] = "-";
        to_export.push(element2);
      });

      element["data"]["pulmonar"].forEach((element2: { [x: string]: any; }) => {
        element2["nome"] = element["data"]["nome"];
        element2["cpf"] = element["data"]["cpf"];
        element2["indice_cardiaco"] = "-";
        to_export.push(element2);
      }
    );
      // to_export.push({element["data"]:})
    });
    console.log(to_export)
    this.exportService.exportToCsv(to_export, this.data_str+" to "+this.data_final_str);
  }

  handleSubmit(){
    // console.log(this.indicesForm.value.data);
    this.data_str = this.indicesForm.value.data?.format("YYYY-MM-DD") as string;
    this.data_final_str = this.indicesForm.value.data_final?.format("YYYY-MM-DD") as string;
    let body = { "date": this.data_str, "final_date": this.data_final_str }
    this.integrationAPIService.getDatesIndices(body).subscribe(res => {
      this.datesIndices = res;
      // console.log(res)
    });
  }
}
//   datesIndices:any[] = [
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 19:47",
//             "indice_cardiaco": 0.508525
//           },
//           {
//             "datetime": "21/06/2021 20:49",
//             "indice_cardiaco": 0.63162
//           },
//           {
//             "datetime": "21/06/2021 15:02",
//             "indice_cardiaco": 0.860106
//           },
//           {
//             "datetime": "21/06/2021 21:48",
//             "indice_cardiaco": 0.706521
//           },
//           {
//             "datetime": "21/06/2021 18:55",
//             "indice_cardiaco": 0.01162
//           },
//           {
//             "datetime": "21/06/2021 14:24",
//             "indice_cardiaco": 0.484058
//           },
//           {
//             "datetime": "21/06/2021 13:40",
//             "indice_cardiaco": 0.892118
//           },
//           {
//             "datetime": "21/06/2021 00:44",
//             "indice_cardiaco": 0.547904
//           },
//           {
//             "datetime": "21/06/2021 05:18",
//             "indice_cardiaco": 0.957811
//           },
//           {
//             "datetime": "21/06/2021 00:06",
//             "indice_cardiaco": 0.577039
//           },
//           {
//             "datetime": "21/06/2021 19:48",
//             "indice_cardiaco": 0.273607
//           },
//           {
//             "datetime": "21/06/2021 15:49",
//             "indice_cardiaco": 0.753404
//           },
//           {
//             "datetime": "21/06/2021 21:39",
//             "indice_cardiaco": 0.901889
//           },
//           {
//             "datetime": "21/06/2021 08:23",
//             "indice_cardiaco": 0.77634
//           }
//         ],
//         "cpf": "807.218.405-90",
//         "nome": "Caio Ryan Augusto Corte Real",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 22:47",
//             "indice_pulmonar": 0.961592
//           },
//           {
//             "datetime": "21/06/2021 20:35",
//             "indice_pulmonar": 0.771173
//           },
//           {
//             "datetime": "21/06/2021 18:29",
//             "indice_pulmonar": 0.340985
//           }
//         ]
//       },
//       "id": "38"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 14:23",
//             "indice_cardiaco": 0.177078
//           },
//           {
//             "datetime": "21/06/2021 18:51",
//             "indice_cardiaco": 0.292068
//           },
//           {
//             "datetime": "21/06/2021 18:31",
//             "indice_cardiaco": 0.134473
//           },
//           {
//             "datetime": "21/06/2021 01:18",
//             "indice_cardiaco": 0.667073
//           },
//           {
//             "datetime": "21/06/2021 13:20",
//             "indice_cardiaco": 0.43794
//           },
//           {
//             "datetime": "21/06/2021 05:29",
//             "indice_cardiaco": 0.51171
//           },
//           {
//             "datetime": "21/06/2021 23:06",
//             "indice_cardiaco": 0.79744
//           },
//           {
//             "datetime": "21/06/2021 13:04",
//             "indice_cardiaco": 0.421852
//           }
//         ],
//         "cpf": "849.516.160-50",
//         "nome": "Sabrina Priscila Lavínia Lima",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 10:32",
//             "indice_pulmonar": 0.625818
//           },
//           {
//             "datetime": "21/06/2021 02:11",
//             "indice_pulmonar": 0.173734
//           },
//           {
//             "datetime": "21/06/2021 07:47",
//             "indice_pulmonar": 0.215307
//           },
//           {
//             "datetime": "21/06/2021 22:16",
//             "indice_pulmonar": 0.483703
//           },
//           {
//             "datetime": "21/06/2021 11:03",
//             "indice_pulmonar": 0.186354
//           },
//           {
//             "datetime": "21/06/2021 01:08",
//             "indice_pulmonar": 0.706892
//           },
//           {
//             "datetime": "21/06/2021 18:54",
//             "indice_pulmonar": 0.075148
//           }
//         ]
//       },
//       "id": "9"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 08:54",
//             "indice_cardiaco": 0.133117
//           },
//           {
//             "datetime": "21/06/2021 23:23",
//             "indice_cardiaco": 0.658018
//           },
//           {
//             "datetime": "21/06/2021 18:50",
//             "indice_cardiaco": 0.948854
//           },
//           {
//             "datetime": "21/06/2021 08:42",
//             "indice_cardiaco": 0.207822
//           },
//           {
//             "datetime": "21/06/2021 02:17",
//             "indice_cardiaco": 0.616761
//           },
//           {
//             "datetime": "21/06/2021 01:34",
//             "indice_cardiaco": 0.047246
//           }
//         ],
//         "cpf": "885.367.016-92",
//         "nome": "Kevin Thomas Bruno Pires",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 06:11",
//             "indice_pulmonar": 0.388276
//           },
//           {
//             "datetime": "21/06/2021 10:10",
//             "indice_pulmonar": 0.187883
//           },
//           {
//             "datetime": "21/06/2021 22:36",
//             "indice_pulmonar": 0.105079
//           },
//           {
//             "datetime": "21/06/2021 01:43",
//             "indice_pulmonar": 0.604838
//           }
//         ]
//       },
//       "id": "54"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 21:04",
//             "indice_cardiaco": 0.67752
//           },
//           {
//             "datetime": "21/06/2021 12:14",
//             "indice_cardiaco": 0.975374
//           },
//           {
//             "datetime": "21/06/2021 01:45",
//             "indice_cardiaco": 0.367805
//           },
//           {
//             "datetime": "21/06/2021 19:43",
//             "indice_cardiaco": 0.473733
//           },
//           {
//             "datetime": "21/06/2021 17:37",
//             "indice_cardiaco": 0.148269
//           },
//           {
//             "datetime": "21/06/2021 15:13",
//             "indice_cardiaco": 0.614645
//           },
//           {
//             "datetime": "21/06/2021 16:58",
//             "indice_cardiaco": 0.634905
//           },
//           {
//             "datetime": "21/06/2021 20:49",
//             "indice_cardiaco": 0.468612
//           },
//           {
//             "datetime": "21/06/2021 21:16",
//             "indice_cardiaco": 0.802678
//           },
//           {
//             "datetime": "21/06/2021 00:37",
//             "indice_cardiaco": 0.208123
//           },
//           {
//             "datetime": "21/06/2021 07:08",
//             "indice_cardiaco": 0.604528
//           },
//           {
//             "datetime": "21/06/2021 13:07",
//             "indice_cardiaco": 0.991228
//           },
//           {
//             "datetime": "21/06/2021 11:02",
//             "indice_cardiaco": 0.773689
//           }
//         ],
//         "cpf": "361.104.497-09",
//         "nome": "Jennifer Amanda Aline Figueiredo",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 06:12",
//             "indice_pulmonar": 0.28815
//           },
//           {
//             "datetime": "21/06/2021 16:19",
//             "indice_pulmonar": 0.825807
//           },
//           {
//             "datetime": "21/06/2021 09:47",
//             "indice_pulmonar": 0.656014
//           },
//           {
//             "datetime": "21/06/2021 11:53",
//             "indice_pulmonar": 0.087573
//           },
//           {
//             "datetime": "21/06/2021 00:53",
//             "indice_pulmonar": 0.849978
//           },
//           {
//             "datetime": "21/06/2021 04:18",
//             "indice_pulmonar": 0.327427
//           }
//         ]
//       },
//       "id": "5"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 06:59",
//             "indice_cardiaco": 0.061523
//           },
//           {
//             "datetime": "21/06/2021 08:59",
//             "indice_cardiaco": 0.673286
//           },
//           {
//             "datetime": "21/06/2021 13:51",
//             "indice_cardiaco": 0.738931
//           },
//           {
//             "datetime": "21/06/2021 05:40",
//             "indice_cardiaco": 0.853962
//           },
//           {
//             "datetime": "21/06/2021 23:30",
//             "indice_cardiaco": 0.744229
//           },
//           {
//             "datetime": "21/06/2021 14:07",
//             "indice_cardiaco": 0.359718
//           },
//           {
//             "datetime": "21/06/2021 04:11",
//             "indice_cardiaco": 0.084331
//           },
//           {
//             "datetime": "21/06/2021 08:29",
//             "indice_cardiaco": 0.185891
//           },
//           {
//             "datetime": "21/06/2021 23:18",
//             "indice_cardiaco": 0.254746
//           },
//           {
//             "datetime": "21/06/2021 22:06",
//             "indice_cardiaco": 0.096758
//           },
//           {
//             "datetime": "21/06/2021 07:43",
//             "indice_cardiaco": 0.234464
//           },
//           {
//             "datetime": "21/06/2021 08:31",
//             "indice_cardiaco": 0.751645
//           }
//         ],
//         "cpf": "997.103.265-11",
//         "nome": "Kaique Pietro Felipe Rezende",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 13:14",
//             "indice_pulmonar": 0.24183
//           },
//           {
//             "datetime": "21/06/2021 10:45",
//             "indice_pulmonar": 0.201201
//           },
//           {
//             "datetime": "21/06/2021 09:17",
//             "indice_pulmonar": 0.343528
//           },
//           {
//             "datetime": "21/06/2021 14:29",
//             "indice_pulmonar": 0.00793
//           },
//           {
//             "datetime": "21/06/2021 17:35",
//             "indice_pulmonar": 0.59882
//           },
//           {
//             "datetime": "21/06/2021 02:54",
//             "indice_pulmonar": 0.784907
//           },
//           {
//             "datetime": "21/06/2021 20:14",
//             "indice_pulmonar": 0.514223
//           },
//           {
//             "datetime": "21/06/2021 17:20",
//             "indice_pulmonar": 0.83798
//           },
//           {
//             "datetime": "21/06/2021 10:58",
//             "indice_pulmonar": 0.564237
//           },
//           {
//             "datetime": "21/06/2021 08:43",
//             "indice_pulmonar": 0.62829
//           },
//           {
//             "datetime": "21/06/2021 00:37",
//             "indice_pulmonar": 0.229873
//           },
//           {
//             "datetime": "21/06/2021 19:44",
//             "indice_pulmonar": 0.226629
//           },
//           {
//             "datetime": "21/06/2021 01:33",
//             "indice_pulmonar": 0.200557
//           },
//           {
//             "datetime": "21/06/2021 02:21",
//             "indice_pulmonar": 0.173769
//           }
//         ]
//       },
//       "id": "27"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 23:32",
//             "indice_cardiaco": 0.548307
//           },
//           {
//             "datetime": "21/06/2021 02:29",
//             "indice_cardiaco": 0.095496
//           },
//           {
//             "datetime": "21/06/2021 17:32",
//             "indice_cardiaco": 0.502542
//           },
//           {
//             "datetime": "21/06/2021 05:51",
//             "indice_cardiaco": 0.332929
//           },
//           {
//             "datetime": "21/06/2021 02:53",
//             "indice_cardiaco": 0.419761
//           },
//           {
//             "datetime": "21/06/2021 15:57",
//             "indice_cardiaco": 0.670087
//           },
//           {
//             "datetime": "21/06/2021 06:48",
//             "indice_cardiaco": 0.206629
//           },
//           {
//             "datetime": "21/06/2021 18:48",
//             "indice_cardiaco": 0.077193
//           },
//           {
//             "datetime": "21/06/2021 09:24",
//             "indice_cardiaco": 0.438271
//           }
//         ],
//         "cpf": "285.773.707-63",
//         "nome": "Miguel Renato Henrique da Rocha",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 18:47",
//             "indice_pulmonar": 0.768807
//           },
//           {
//             "datetime": "21/06/2021 05:17",
//             "indice_pulmonar": 0.317997
//           },
//           {
//             "datetime": "21/06/2021 20:26",
//             "indice_pulmonar": 0.428947
//           }
//         ]
//       },
//       "id": "12"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 12:43",
//             "indice_cardiaco": 0.380194
//           },
//           {
//             "datetime": "21/06/2021 01:47",
//             "indice_cardiaco": 0.283222
//           },
//           {
//             "datetime": "21/06/2021 00:29",
//             "indice_cardiaco": 0.543062
//           },
//           {
//             "datetime": "21/06/2021 22:07",
//             "indice_cardiaco": 0.447743
//           },
//           {
//             "datetime": "21/06/2021 08:03",
//             "indice_cardiaco": 0.066391
//           },
//           {
//             "datetime": "21/06/2021 20:18",
//             "indice_cardiaco": 0.047512
//           },
//           {
//             "datetime": "21/06/2021 17:07",
//             "indice_cardiaco": 0.184051
//           }
//         ],
//         "cpf": "693.655.491-16",
//         "nome": "Tomás Filipe Cavalcanti",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 01:38",
//             "indice_pulmonar": 0.199548
//           },
//           {
//             "datetime": "21/06/2021 00:50",
//             "indice_pulmonar": 0.789447
//           },
//           {
//             "datetime": "21/06/2021 11:14",
//             "indice_pulmonar": 0.95278
//           },
//           {
//             "datetime": "21/06/2021 08:10",
//             "indice_pulmonar": 0.378454
//           }
//         ]
//       },
//       "id": "7"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 18:38",
//             "indice_cardiaco": 0.917845
//           },
//           {
//             "datetime": "21/06/2021 10:04",
//             "indice_cardiaco": 0.852834
//           },
//           {
//             "datetime": "21/06/2021 23:50",
//             "indice_cardiaco": 0.662953
//           },
//           {
//             "datetime": "21/06/2021 02:09",
//             "indice_cardiaco": 0.633995
//           },
//           {
//             "datetime": "21/06/2021 16:32",
//             "indice_cardiaco": 0.209466
//           },
//           {
//             "datetime": "21/06/2021 23:28",
//             "indice_cardiaco": 0.091022
//           }
//         ],
//         "cpf": "974.642.524-20",
//         "nome": "Alexandre Caleb Costa",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 01:24",
//             "indice_pulmonar": 0.161037
//           },
//           {
//             "datetime": "21/06/2021 03:02",
//             "indice_pulmonar": 0.085284
//           }
//         ]
//       },
//       "id": "1"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 09:46",
//             "indice_cardiaco": 0.573905
//           },
//           {
//             "datetime": "21/06/2021 14:04",
//             "indice_cardiaco": 0.95256
//           },
//           {
//             "datetime": "21/06/2021 01:16",
//             "indice_cardiaco": 0.249997
//           }
//         ],
//         "cpf": "045.456.503-84",
//         "nome": "Márcio Leandro Daniel Assunção",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 23:09",
//             "indice_pulmonar": 0.601575
//           },
//           {
//             "datetime": "21/06/2021 17:37",
//             "indice_pulmonar": 0.693869
//           },
//           {
//             "datetime": "21/06/2021 11:02",
//             "indice_pulmonar": 0.913718
//           },
//           {
//             "datetime": "21/06/2021 05:25",
//             "indice_pulmonar": 0.488905
//           },
//           {
//             "datetime": "21/06/2021 07:41",
//             "indice_pulmonar": 0.735377
//           },
//           {
//             "datetime": "21/06/2021 01:49",
//             "indice_pulmonar": 0.427591
//           },
//           {
//             "datetime": "21/06/2021 05:39",
//             "indice_pulmonar": 0.781737
//           }
//         ]
//       },
//       "id": "55"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 22:48",
//             "indice_cardiaco": 0.627148
//           },
//           {
//             "datetime": "21/06/2021 04:11",
//             "indice_cardiaco": 0.217878
//           },
//           {
//             "datetime": "21/06/2021 12:26",
//             "indice_cardiaco": 0.846933
//           },
//           {
//             "datetime": "21/06/2021 15:00",
//             "indice_cardiaco": 0.919063
//           },
//           {
//             "datetime": "21/06/2021 12:44",
//             "indice_cardiaco": 0.668757
//           },
//           {
//             "datetime": "21/06/2021 01:18",
//             "indice_cardiaco": 0.138863
//           },
//           {
//             "datetime": "21/06/2021 18:10",
//             "indice_cardiaco": 0.865171
//           }
//         ],
//         "cpf": "436.612.686-94",
//         "nome": "Levi Sérgio Pietro Martins",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 23:20",
//             "indice_pulmonar": 0.676293
//           },
//           {
//             "datetime": "21/06/2021 02:03",
//             "indice_pulmonar": 0.124328
//           },
//           {
//             "datetime": "21/06/2021 19:09",
//             "indice_pulmonar": 0.551266
//           },
//           {
//             "datetime": "21/06/2021 17:33",
//             "indice_pulmonar": 0.737152
//           },
//           {
//             "datetime": "21/06/2021 14:47",
//             "indice_pulmonar": 0.534119
//           },
//           {
//             "datetime": "21/06/2021 14:52",
//             "indice_pulmonar": 0.820858
//           }
//         ]
//       },
//       "id": "6"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 23:41",
//             "indice_cardiaco": 0.931812
//           },
//           {
//             "datetime": "21/06/2021 20:50",
//             "indice_cardiaco": 0.787051
//           },
//           {
//             "datetime": "21/06/2021 16:44",
//             "indice_cardiaco": 0.562328
//           },
//           {
//             "datetime": "21/06/2021 18:31",
//             "indice_cardiaco": 0.832697
//           },
//           {
//             "datetime": "21/06/2021 05:36",
//             "indice_cardiaco": 0.555906
//           },
//           {
//             "datetime": "21/06/2021 13:55",
//             "indice_cardiaco": 0.73659
//           }
//         ],
//         "cpf": "664.440.515-09",
//         "nome": "Simone Malu Santos",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 22:02",
//             "indice_pulmonar": 0.100209
//           },
//           {
//             "datetime": "21/06/2021 23:09",
//             "indice_pulmonar": 0.075382
//           },
//           {
//             "datetime": "21/06/2021 18:09",
//             "indice_pulmonar": 0.02127
//           },
//           {
//             "datetime": "21/06/2021 11:48",
//             "indice_pulmonar": 0.007165
//           },
//           {
//             "datetime": "21/06/2021 11:31",
//             "indice_pulmonar": 0.681114
//           },
//           {
//             "datetime": "21/06/2021 08:49",
//             "indice_pulmonar": 0.656071
//           },
//           {
//             "datetime": "21/06/2021 09:41",
//             "indice_pulmonar": 0.332533
//           },
//           {
//             "datetime": "21/06/2021 15:25",
//             "indice_pulmonar": 0.019582
//           },
//           {
//             "datetime": "21/06/2021 18:33",
//             "indice_pulmonar": 0.814607
//           },
//           {
//             "datetime": "21/06/2021 13:41",
//             "indice_pulmonar": 0.343977
//           }
//         ]
//       },
//       "id": "28"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 12:22",
//             "indice_cardiaco": 0.940809
//           },
//           {
//             "datetime": "21/06/2021 16:56",
//             "indice_cardiaco": 0.832303
//           },
//           {
//             "datetime": "21/06/2021 14:18",
//             "indice_cardiaco": 0.855344
//           },
//           {
//             "datetime": "21/06/2021 17:08",
//             "indice_cardiaco": 0.300239
//           },
//           {
//             "datetime": "21/06/2021 13:56",
//             "indice_cardiaco": 0.903914
//           },
//           {
//             "datetime": "21/06/2021 19:28",
//             "indice_cardiaco": 0.903461
//           }
//         ],
//         "cpf": "051.850.051-90",
//         "nome": "Nair Kamilly Fátima Oliveira",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 12:12",
//             "indice_pulmonar": 0.391648
//           },
//           {
//             "datetime": "21/06/2021 11:38",
//             "indice_pulmonar": 0.829473
//           },
//           {
//             "datetime": "21/06/2021 14:48",
//             "indice_pulmonar": 0.288816
//           },
//           {
//             "datetime": "21/06/2021 07:51",
//             "indice_pulmonar": 0.866582
//           },
//           {
//             "datetime": "21/06/2021 01:57",
//             "indice_pulmonar": 0.152982
//           },
//           {
//             "datetime": "21/06/2021 22:17",
//             "indice_pulmonar": 0.246883
//           },
//           {
//             "datetime": "21/06/2021 12:40",
//             "indice_pulmonar": 0.201281
//           },
//           {
//             "datetime": "21/06/2021 07:40",
//             "indice_pulmonar": 0.593213
//           },
//           {
//             "datetime": "21/06/2021 20:25",
//             "indice_pulmonar": 0.117912
//           }
//         ]
//       },
//       "id": "24"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 12:04",
//             "indice_cardiaco": 0.68811
//           },
//           {
//             "datetime": "21/06/2021 21:59",
//             "indice_cardiaco": 0.832286
//           },
//           {
//             "datetime": "21/06/2021 16:24",
//             "indice_cardiaco": 0.913397
//           },
//           {
//             "datetime": "21/06/2021 05:11",
//             "indice_cardiaco": 0.58471
//           },
//           {
//             "datetime": "21/06/2021 01:48",
//             "indice_cardiaco": 0.862638
//           },
//           {
//             "datetime": "21/06/2021 15:02",
//             "indice_cardiaco": 0.813743
//           },
//           {
//             "datetime": "21/06/2021 22:59",
//             "indice_cardiaco": 0.910889
//           },
//           {
//             "datetime": "21/06/2021 23:08",
//             "indice_cardiaco": 0.834469
//           },
//           {
//             "datetime": "21/06/2021 17:41",
//             "indice_cardiaco": 0.122487
//           }
//         ],
//         "cpf": "955.930.874-23",
//         "nome": "Diogo Marcos Fogaça",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 05:37",
//             "indice_pulmonar": 0.116864
//           },
//           {
//             "datetime": "21/06/2021 11:35",
//             "indice_pulmonar": 0.9837
//           },
//           {
//             "datetime": "21/06/2021 07:24",
//             "indice_pulmonar": 0.917972
//           },
//           {
//             "datetime": "21/06/2021 18:37",
//             "indice_pulmonar": 0.553111
//           },
//           {
//             "datetime": "21/06/2021 16:30",
//             "indice_pulmonar": 0.78571
//           },
//           {
//             "datetime": "21/06/2021 08:22",
//             "indice_pulmonar": 0.803442
//           },
//           {
//             "datetime": "21/06/2021 16:41",
//             "indice_pulmonar": 0.391667
//           },
//           {
//             "datetime": "21/06/2021 22:25",
//             "indice_pulmonar": 0.422786
//           },
//           {
//             "datetime": "21/06/2021 16:42",
//             "indice_pulmonar": 0.890605
//           }
//         ]
//       },
//       "id": "39"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 05:09",
//             "indice_cardiaco": 0.969078
//           },
//           {
//             "datetime": "21/06/2021 07:26",
//             "indice_cardiaco": 0.254604
//           },
//           {
//             "datetime": "21/06/2021 11:50",
//             "indice_cardiaco": 0.934981
//           },
//           {
//             "datetime": "21/06/2021 13:09",
//             "indice_cardiaco": 0.934961
//           },
//           {
//             "datetime": "21/06/2021 20:04",
//             "indice_cardiaco": 0.285963
//           },
//           {
//             "datetime": "21/06/2021 05:23",
//             "indice_cardiaco": 0.849125
//           }
//         ],
//         "cpf": "272.846.051-54",
//         "nome": "Murilo Paulo Diogo Lima",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 13:16",
//             "indice_pulmonar": 0.052205
//           },
//           {
//             "datetime": "21/06/2021 22:03",
//             "indice_pulmonar": 0.531507
//           },
//           {
//             "datetime": "21/06/2021 18:15",
//             "indice_pulmonar": 0.61377
//           },
//           {
//             "datetime": "21/06/2021 23:55",
//             "indice_pulmonar": 0.658707
//           },
//           {
//             "datetime": "21/06/2021 22:08",
//             "indice_pulmonar": 0.287103
//           },
//           {
//             "datetime": "21/06/2021 11:33",
//             "indice_pulmonar": 0.101668
//           },
//           {
//             "datetime": "21/06/2021 01:09",
//             "indice_pulmonar": 0.562389
//           },
//           {
//             "datetime": "21/06/2021 16:46",
//             "indice_pulmonar": 0.186256
//           },
//           {
//             "datetime": "21/06/2021 11:25",
//             "indice_pulmonar": 0.896187
//           },
//           {
//             "datetime": "21/06/2021 02:07",
//             "indice_pulmonar": 0.289916
//           }
//         ]
//       },
//       "id": "35"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 05:25",
//             "indice_cardiaco": 0.455538
//           },
//           {
//             "datetime": "21/06/2021 16:18",
//             "indice_cardiaco": 0.718288
//           },
//           {
//             "datetime": "21/06/2021 10:31",
//             "indice_cardiaco": 0.015306
//           }
//         ],
//         "cpf": "777.421.360-07",
//         "nome": "Benedita Mirella Aurora Alves",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 07:09",
//             "indice_pulmonar": 0.05406
//           },
//           {
//             "datetime": "21/06/2021 17:40",
//             "indice_pulmonar": 0.830454
//           },
//           {
//             "datetime": "21/06/2021 20:01",
//             "indice_pulmonar": 0.639532
//           },
//           {
//             "datetime": "21/06/2021 02:39",
//             "indice_pulmonar": 0.941829
//           },
//           {
//             "datetime": "21/06/2021 18:45",
//             "indice_pulmonar": 0.966062
//           },
//           {
//             "datetime": "21/06/2021 19:03",
//             "indice_pulmonar": 0.466462
//           },
//           {
//             "datetime": "21/06/2021 12:13",
//             "indice_pulmonar": 0.949481
//           },
//           {
//             "datetime": "21/06/2021 02:26",
//             "indice_pulmonar": 0.500172
//           }
//         ]
//       },
//       "id": "45"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 08:08",
//             "indice_cardiaco": 0.56774
//           },
//           {
//             "datetime": "21/06/2021 10:20",
//             "indice_cardiaco": 0.401401
//           },
//           {
//             "datetime": "21/06/2021 20:43",
//             "indice_cardiaco": 0.601067
//           },
//           {
//             "datetime": "21/06/2021 13:00",
//             "indice_cardiaco": 0.629208
//           },
//           {
//             "datetime": "21/06/2021 12:34",
//             "indice_cardiaco": 0.827106
//           }
//         ],
//         "cpf": "166.456.724-03",
//         "nome": "Andrea Aurora Carvalho",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 05:10",
//             "indice_pulmonar": 0.08845
//           },
//           {
//             "datetime": "21/06/2021 16:20",
//             "indice_pulmonar": 0.519807
//           },
//           {
//             "datetime": "21/06/2021 01:18",
//             "indice_pulmonar": 0.839177
//           },
//           {
//             "datetime": "21/06/2021 00:38",
//             "indice_pulmonar": 0.543263
//           },
//           {
//             "datetime": "21/06/2021 22:31",
//             "indice_pulmonar": 0.086975
//           },
//           {
//             "datetime": "21/06/2021 10:01",
//             "indice_pulmonar": 0.416738
//           },
//           {
//             "datetime": "21/06/2021 20:48",
//             "indice_pulmonar": 0.467692
//           },
//           {
//             "datetime": "21/06/2021 03:08",
//             "indice_pulmonar": 0.345854
//           }
//         ]
//       },
//       "id": "53"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 13:42",
//             "indice_cardiaco": 0.175634
//           },
//           {
//             "datetime": "21/06/2021 05:58",
//             "indice_cardiaco": 0.542687
//           },
//           {
//             "datetime": "21/06/2021 11:49",
//             "indice_cardiaco": 0.603141
//           },
//           {
//             "datetime": "21/06/2021 06:09",
//             "indice_cardiaco": 0.584636
//           },
//           {
//             "datetime": "21/06/2021 03:48",
//             "indice_cardiaco": 0.624135
//           },
//           {
//             "datetime": "21/06/2021 06:59",
//             "indice_cardiaco": 0.840589
//           },
//           {
//             "datetime": "21/06/2021 18:31",
//             "indice_cardiaco": 0.350424
//           },
//           {
//             "datetime": "21/06/2021 17:23",
//             "indice_cardiaco": 0.787521
//           },
//           {
//             "datetime": "21/06/2021 05:40",
//             "indice_cardiaco": 0.047359
//           }
//         ],
//         "cpf": "986.083.116-58",
//         "nome": "Anthony Caio Hugo da Costa",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 06:42",
//             "indice_pulmonar": 0.257995
//           },
//           {
//             "datetime": "21/06/2021 09:05",
//             "indice_pulmonar": 0.969531
//           },
//           {
//             "datetime": "21/06/2021 14:06",
//             "indice_pulmonar": 0.135215
//           },
//           {
//             "datetime": "21/06/2021 17:42",
//             "indice_pulmonar": 0.172599
//           },
//           {
//             "datetime": "21/06/2021 07:27",
//             "indice_pulmonar": 0.647953
//           },
//           {
//             "datetime": "21/06/2021 09:03",
//             "indice_pulmonar": 0.424632
//           },
//           {
//             "datetime": "21/06/2021 13:21",
//             "indice_pulmonar": 0.043385
//           }
//         ]
//       },
//       "id": "22"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 03:05",
//             "indice_cardiaco": 0.754512
//           },
//           {
//             "datetime": "21/06/2021 03:55",
//             "indice_cardiaco": 0.474273
//           },
//           {
//             "datetime": "21/06/2021 15:17",
//             "indice_cardiaco": 0.832041
//           },
//           {
//             "datetime": "21/06/2021 16:08",
//             "indice_cardiaco": 0.647799
//           },
//           {
//             "datetime": "21/06/2021 16:55",
//             "indice_cardiaco": 0.685478
//           }
//         ],
//         "cpf": "167.491.690-66",
//         "nome": "Gabrielly Emanuelly Olivia Viana",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 07:30",
//             "indice_pulmonar": 0.418303
//           },
//           {
//             "datetime": "21/06/2021 10:37",
//             "indice_pulmonar": 0.573454
//           },
//           {
//             "datetime": "21/06/2021 21:37",
//             "indice_pulmonar": 0.163737
//           },
//           {
//             "datetime": "21/06/2021 11:25",
//             "indice_pulmonar": 0.991073
//           },
//           {
//             "datetime": "21/06/2021 13:01",
//             "indice_pulmonar": 0.926366
//           },
//           {
//             "datetime": "21/06/2021 10:39",
//             "indice_pulmonar": 0.035146
//           },
//           {
//             "datetime": "21/06/2021 14:08",
//             "indice_pulmonar": 0.316676
//           },
//           {
//             "datetime": "21/06/2021 15:54",
//             "indice_pulmonar": 0.927876
//           }
//         ]
//       },
//       "id": "25"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 03:22",
//             "indice_cardiaco": 0.20722
//           },
//           {
//             "datetime": "21/06/2021 15:51",
//             "indice_cardiaco": 0.391878
//           },
//           {
//             "datetime": "21/06/2021 08:53",
//             "indice_cardiaco": 0.339433
//           },
//           {
//             "datetime": "21/06/2021 15:43",
//             "indice_cardiaco": 0.062879
//           },
//           {
//             "datetime": "21/06/2021 11:11",
//             "indice_cardiaco": 0.340878
//           },
//           {
//             "datetime": "21/06/2021 21:19",
//             "indice_cardiaco": 0.262774
//           },
//           {
//             "datetime": "21/06/2021 19:15",
//             "indice_cardiaco": 0.07246
//           },
//           {
//             "datetime": "21/06/2021 23:35",
//             "indice_cardiaco": 0.563628
//           },
//           {
//             "datetime": "21/06/2021 04:59",
//             "indice_cardiaco": 0.169175
//           },
//           {
//             "datetime": "21/06/2021 22:52",
//             "indice_cardiaco": 0.665636
//           },
//           {
//             "datetime": "21/06/2021 17:05",
//             "indice_cardiaco": 0.574287
//           }
//         ],
//         "cpf": "041.897.838-70",
//         "nome": "Vera Natália Costa",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 20:58",
//             "indice_pulmonar": 0.463437
//           },
//           {
//             "datetime": "21/06/2021 19:29",
//             "indice_pulmonar": 0.00381
//           },
//           {
//             "datetime": "21/06/2021 19:37",
//             "indice_pulmonar": 0.045069
//           },
//           {
//             "datetime": "21/06/2021 20:55",
//             "indice_pulmonar": 0.431336
//           },
//           {
//             "datetime": "21/06/2021 02:45",
//             "indice_pulmonar": 0.599048
//           }
//         ]
//       },
//       "id": "4"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 01:29",
//             "indice_cardiaco": 0.348245
//           },
//           {
//             "datetime": "21/06/2021 01:25",
//             "indice_cardiaco": 0.012207
//           },
//           {
//             "datetime": "21/06/2021 14:03",
//             "indice_cardiaco": 0.0755
//           },
//           {
//             "datetime": "21/06/2021 20:24",
//             "indice_cardiaco": 0.3849
//           },
//           {
//             "datetime": "21/06/2021 10:12",
//             "indice_cardiaco": 0.903018
//           },
//           {
//             "datetime": "21/06/2021 04:52",
//             "indice_cardiaco": 0.900641
//           }
//         ],
//         "cpf": "281.095.010-52",
//         "nome": "Marcos Henrique Miguel da Cunha",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 02:05",
//             "indice_pulmonar": 0.256002
//           },
//           {
//             "datetime": "21/06/2021 15:59",
//             "indice_pulmonar": 0.629288
//           },
//           {
//             "datetime": "21/06/2021 15:06",
//             "indice_pulmonar": 0.064046
//           }
//         ]
//       },
//       "id": "17"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 15:11",
//             "indice_cardiaco": 0.462057
//           },
//           {
//             "datetime": "21/06/2021 02:43",
//             "indice_cardiaco": 0.220121
//           },
//           {
//             "datetime": "21/06/2021 11:50",
//             "indice_cardiaco": 0.572786
//           },
//           {
//             "datetime": "21/06/2021 23:23",
//             "indice_cardiaco": 0.494498
//           },
//           {
//             "datetime": "21/06/2021 16:45",
//             "indice_cardiaco": 0.05123
//           }
//         ],
//         "cpf": "563.284.066-22",
//         "nome": "Laura Isabelle Carvalho",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 04:04",
//             "indice_pulmonar": 0.907228
//           },
//           {
//             "datetime": "21/06/2021 15:29",
//             "indice_pulmonar": 0.424231
//           },
//           {
//             "datetime": "21/06/2021 03:18",
//             "indice_pulmonar": 0.468169
//           },
//           {
//             "datetime": "21/06/2021 04:09",
//             "indice_pulmonar": 0.063015
//           },
//           {
//             "datetime": "21/06/2021 23:58",
//             "indice_pulmonar": 0.085801
//           },
//           {
//             "datetime": "21/06/2021 19:07",
//             "indice_pulmonar": 0.302003
//           },
//           {
//             "datetime": "21/06/2021 02:26",
//             "indice_pulmonar": 0.007275
//           },
//           {
//             "datetime": "21/06/2021 18:03",
//             "indice_pulmonar": 0.95928
//           },
//           {
//             "datetime": "21/06/2021 00:49",
//             "indice_pulmonar": 0.149045
//           }
//         ]
//       },
//       "id": "30"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 09:20",
//             "indice_cardiaco": 0.123499
//           },
//           {
//             "datetime": "21/06/2021 16:57",
//             "indice_cardiaco": 0.548164
//           },
//           {
//             "datetime": "21/06/2021 21:20",
//             "indice_cardiaco": 0.463502
//           },
//           {
//             "datetime": "21/06/2021 01:15",
//             "indice_cardiaco": 0.882689
//           },
//           {
//             "datetime": "21/06/2021 03:28",
//             "indice_cardiaco": 0.835023
//           },
//           {
//             "datetime": "21/06/2021 22:33",
//             "indice_cardiaco": 0.808125
//           }
//         ],
//         "cpf": "441.889.415-29",
//         "nome": "Vanessa Isabella Mariane Novaes",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 17:37",
//             "indice_pulmonar": 0.781786
//           },
//           {
//             "datetime": "21/06/2021 11:19",
//             "indice_pulmonar": 0.420089
//           },
//           {
//             "datetime": "21/06/2021 03:40",
//             "indice_pulmonar": 0.403574
//           }
//         ]
//       },
//       "id": "34"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 06:02",
//             "indice_cardiaco": 0.39659
//           },
//           {
//             "datetime": "21/06/2021 09:53",
//             "indice_cardiaco": 0.950276
//           },
//           {
//             "datetime": "21/06/2021 01:57",
//             "indice_cardiaco": 0.716281
//           },
//           {
//             "datetime": "21/06/2021 01:55",
//             "indice_cardiaco": 0.739047
//           },
//           {
//             "datetime": "21/06/2021 13:41",
//             "indice_cardiaco": 0.233028
//           },
//           {
//             "datetime": "21/06/2021 12:12",
//             "indice_cardiaco": 0.958597
//           },
//           {
//             "datetime": "21/06/2021 14:51",
//             "indice_cardiaco": 0.654549
//           }
//         ],
//         "cpf": "591.403.676-30",
//         "nome": "Emilly Laura Figueiredo",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 05:15",
//             "indice_pulmonar": 0.395622
//           },
//           {
//             "datetime": "21/06/2021 23:15",
//             "indice_pulmonar": 0.230242
//           },
//           {
//             "datetime": "21/06/2021 04:03",
//             "indice_pulmonar": 0.715461
//           },
//           {
//             "datetime": "21/06/2021 19:51",
//             "indice_pulmonar": 0.4967
//           },
//           {
//             "datetime": "21/06/2021 04:18",
//             "indice_pulmonar": 0.567892
//           }
//         ]
//       },
//       "id": "16"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 01:33",
//             "indice_cardiaco": 0.442837
//           },
//           {
//             "datetime": "21/06/2021 17:31",
//             "indice_cardiaco": 0.348891
//           },
//           {
//             "datetime": "21/06/2021 00:09",
//             "indice_cardiaco": 0.642821
//           },
//           {
//             "datetime": "21/06/2021 06:28",
//             "indice_cardiaco": 0.772936
//           },
//           {
//             "datetime": "21/06/2021 19:35",
//             "indice_cardiaco": 0.956998
//           },
//           {
//             "datetime": "21/06/2021 20:14",
//             "indice_cardiaco": 0.75998
//           }
//         ],
//         "cpf": "691.003.770-74",
//         "nome": "Thales Arthur Rocha",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 01:37",
//             "indice_pulmonar": 0.255708
//           },
//           {
//             "datetime": "21/06/2021 10:28",
//             "indice_pulmonar": 0.576697
//           },
//           {
//             "datetime": "21/06/2021 00:56",
//             "indice_pulmonar": 0.212074
//           },
//           {
//             "datetime": "21/06/2021 18:27",
//             "indice_pulmonar": 0.110041
//           },
//           {
//             "datetime": "21/06/2021 06:11",
//             "indice_pulmonar": 0.461703
//           },
//           {
//             "datetime": "21/06/2021 11:50",
//             "indice_pulmonar": 0.289707
//           }
//         ]
//       },
//       "id": "15"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 21:35",
//             "indice_cardiaco": 0.07443
//           },
//           {
//             "datetime": "21/06/2021 20:00",
//             "indice_cardiaco": 0.122033
//           },
//           {
//             "datetime": "21/06/2021 08:56",
//             "indice_cardiaco": 0.928091
//           },
//           {
//             "datetime": "21/06/2021 22:23",
//             "indice_cardiaco": 0.491501
//           },
//           {
//             "datetime": "21/06/2021 19:37",
//             "indice_cardiaco": 0.358323
//           },
//           {
//             "datetime": "21/06/2021 15:16",
//             "indice_cardiaco": 0.586658
//           },
//           {
//             "datetime": "21/06/2021 04:26",
//             "indice_cardiaco": 0.253471
//           },
//           {
//             "datetime": "21/06/2021 23:01",
//             "indice_cardiaco": 0.012664
//           }
//         ],
//         "cpf": "055.613.208-40",
//         "nome": "Luiza Laís Alice Gomes",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 18:33",
//             "indice_pulmonar": 0.974598
//           },
//           {
//             "datetime": "21/06/2021 04:12",
//             "indice_pulmonar": 0.146298
//           }
//         ]
//       },
//       "id": "50"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 04:01",
//             "indice_cardiaco": 0.343924
//           },
//           {
//             "datetime": "21/06/2021 19:27",
//             "indice_cardiaco": 0.272572
//           },
//           {
//             "datetime": "21/06/2021 07:20",
//             "indice_cardiaco": 0.154623
//           },
//           {
//             "datetime": "21/06/2021 21:59",
//             "indice_cardiaco": 0.951819
//           },
//           {
//             "datetime": "21/06/2021 06:44",
//             "indice_cardiaco": 0.974129
//           },
//           {
//             "datetime": "21/06/2021 08:43",
//             "indice_cardiaco": 0.720491
//           },
//           {
//             "datetime": "21/06/2021 13:48",
//             "indice_cardiaco": 0.324897
//           },
//           {
//             "datetime": "21/06/2021 03:31",
//             "indice_cardiaco": 0.648488
//           },
//           {
//             "datetime": "21/06/2021 06:26",
//             "indice_cardiaco": 0.132877
//           }
//         ],
//         "cpf": "962.194.050-80",
//         "nome": "Guilherme Ruan Castro",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 08:47",
//             "indice_pulmonar": 0.458395
//           },
//           {
//             "datetime": "21/06/2021 01:26",
//             "indice_pulmonar": 0.006742
//           },
//           {
//             "datetime": "21/06/2021 05:52",
//             "indice_pulmonar": 0.564136
//           },
//           {
//             "datetime": "21/06/2021 03:21",
//             "indice_pulmonar": 0.728583
//           },
//           {
//             "datetime": "21/06/2021 10:32",
//             "indice_pulmonar": 0.528865
//           },
//           {
//             "datetime": "21/06/2021 15:28",
//             "indice_pulmonar": 0.021103
//           },
//           {
//             "datetime": "21/06/2021 00:59",
//             "indice_pulmonar": 0.26079
//           },
//           {
//             "datetime": "21/06/2021 20:15",
//             "indice_pulmonar": 0.634556
//           },
//           {
//             "datetime": "21/06/2021 11:15",
//             "indice_pulmonar": 0.142746
//           }
//         ]
//       },
//       "id": "44"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 19:13",
//             "indice_cardiaco": 0.515775
//           },
//           {
//             "datetime": "21/06/2021 05:56",
//             "indice_cardiaco": 0.630387
//           },
//           {
//             "datetime": "21/06/2021 12:37",
//             "indice_cardiaco": 0.872473
//           }
//         ],
//         "cpf": "069.221.825-45",
//         "nome": "Alice Analu Lavínia da Cruz",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 01:38",
//             "indice_pulmonar": 0.150521
//           },
//           {
//             "datetime": "21/06/2021 11:48",
//             "indice_pulmonar": 0.788541
//           },
//           {
//             "datetime": "21/06/2021 21:56",
//             "indice_pulmonar": 0.904613
//           },
//           {
//             "datetime": "21/06/2021 05:14",
//             "indice_pulmonar": 0.92475
//           },
//           {
//             "datetime": "21/06/2021 23:40",
//             "indice_pulmonar": 0.856298
//           }
//         ]
//       },
//       "id": "18"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 10:52",
//             "indice_cardiaco": 0.457146
//           },
//           {
//             "datetime": "21/06/2021 14:14",
//             "indice_cardiaco": 0.582233
//           },
//           {
//             "datetime": "21/06/2021 21:20",
//             "indice_cardiaco": 0.296775
//           },
//           {
//             "datetime": "21/06/2021 15:39",
//             "indice_cardiaco": 0.215733
//           },
//           {
//             "datetime": "21/06/2021 18:11",
//             "indice_cardiaco": 0.518506
//           },
//           {
//             "datetime": "21/06/2021 20:52",
//             "indice_cardiaco": 0.206597
//           }
//         ],
//         "cpf": "785.166.382-27",
//         "nome": "Elaine Adriana Luana das Neves",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 21:08",
//             "indice_pulmonar": 0.628114
//           },
//           {
//             "datetime": "21/06/2021 12:02",
//             "indice_pulmonar": 0.811248
//           },
//           {
//             "datetime": "21/06/2021 11:50",
//             "indice_pulmonar": 0.400431
//           },
//           {
//             "datetime": "21/06/2021 06:05",
//             "indice_pulmonar": 0.616759
//           },
//           {
//             "datetime": "21/06/2021 16:41",
//             "indice_pulmonar": 0.597479
//           },
//           {
//             "datetime": "21/06/2021 09:49",
//             "indice_pulmonar": 0.642678
//           }
//         ]
//       },
//       "id": "20"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 08:11",
//             "indice_cardiaco": 0.972024
//           },
//           {
//             "datetime": "21/06/2021 02:41",
//             "indice_cardiaco": 0.219335
//           },
//           {
//             "datetime": "21/06/2021 05:39",
//             "indice_cardiaco": 0.334393
//           },
//           {
//             "datetime": "21/06/2021 15:20",
//             "indice_cardiaco": 0.188598
//           },
//           {
//             "datetime": "21/06/2021 11:16",
//             "indice_cardiaco": 0.413217
//           }
//         ],
//         "cpf": "489.164.899-62",
//         "nome": "Agatha Bruna da Rosa",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 14:30",
//             "indice_pulmonar": 0.574619
//           },
//           {
//             "datetime": "21/06/2021 22:45",
//             "indice_pulmonar": 0.275098
//           },
//           {
//             "datetime": "21/06/2021 20:00",
//             "indice_pulmonar": 0.721187
//           },
//           {
//             "datetime": "21/06/2021 21:32",
//             "indice_pulmonar": 0.981403
//           },
//           {
//             "datetime": "21/06/2021 18:17",
//             "indice_pulmonar": 0.097931
//           },
//           {
//             "datetime": "21/06/2021 03:12",
//             "indice_pulmonar": 0.563682
//           },
//           {
//             "datetime": "21/06/2021 09:12",
//             "indice_pulmonar": 0.998745
//           },
//           {
//             "datetime": "21/06/2021 06:23",
//             "indice_pulmonar": 0.409204
//           }
//         ]
//       },
//       "id": "33"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 13:38",
//             "indice_cardiaco": 0.66511
//           },
//           {
//             "datetime": "21/06/2021 00:13",
//             "indice_cardiaco": 0.309602
//           },
//           {
//             "datetime": "21/06/2021 09:12",
//             "indice_cardiaco": 0.595573
//           },
//           {
//             "datetime": "21/06/2021 11:20",
//             "indice_cardiaco": 0.134205
//           },
//           {
//             "datetime": "21/06/2021 18:46",
//             "indice_cardiaco": 0.264251
//           },
//           {
//             "datetime": "21/06/2021 01:15",
//             "indice_cardiaco": 0.979088
//           },
//           {
//             "datetime": "21/06/2021 23:18",
//             "indice_cardiaco": 0.35579
//           }
//         ],
//         "cpf": "909.078.564-70",
//         "nome": "Patrícia Isabelly Tereza da Paz",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 22:30",
//             "indice_pulmonar": 0.381886
//           },
//           {
//             "datetime": "21/06/2021 18:22",
//             "indice_pulmonar": 0.856833
//           },
//           {
//             "datetime": "21/06/2021 05:37",
//             "indice_pulmonar": 0.033298
//           },
//           {
//             "datetime": "21/06/2021 06:00",
//             "indice_pulmonar": 0.258745
//           },
//           {
//             "datetime": "21/06/2021 05:11",
//             "indice_pulmonar": 0.50881
//           },
//           {
//             "datetime": "21/06/2021 06:10",
//             "indice_pulmonar": 0.114851
//           }
//         ]
//       },
//       "id": "40"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 12:24",
//             "indice_cardiaco": 0.68377
//           },
//           {
//             "datetime": "21/06/2021 07:14",
//             "indice_cardiaco": 0.77394
//           },
//           {
//             "datetime": "21/06/2021 12:14",
//             "indice_cardiaco": 0.244193
//           },
//           {
//             "datetime": "21/06/2021 01:51",
//             "indice_cardiaco": 0.719901
//           },
//           {
//             "datetime": "21/06/2021 12:48",
//             "indice_cardiaco": 0.776233
//           },
//           {
//             "datetime": "21/06/2021 02:45",
//             "indice_cardiaco": 0.54328
//           },
//           {
//             "datetime": "21/06/2021 14:35",
//             "indice_cardiaco": 0.555921
//           },
//           {
//             "datetime": "21/06/2021 12:44",
//             "indice_cardiaco": 0.133072
//           },
//           {
//             "datetime": "21/06/2021 16:13",
//             "indice_cardiaco": 0.061018
//           }
//         ],
//         "cpf": "218.543.660-09",
//         "nome": "Rita Marcela Castro",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 02:38",
//             "indice_pulmonar": 0.915911
//           },
//           {
//             "datetime": "21/06/2021 10:58",
//             "indice_pulmonar": 0.434519
//           },
//           {
//             "datetime": "21/06/2021 15:31",
//             "indice_pulmonar": 0.796876
//           },
//           {
//             "datetime": "21/06/2021 03:49",
//             "indice_pulmonar": 0.28859
//           },
//           {
//             "datetime": "21/06/2021 10:07",
//             "indice_pulmonar": 0.233201
//           },
//           {
//             "datetime": "21/06/2021 01:39",
//             "indice_pulmonar": 0.588084
//           },
//           {
//             "datetime": "21/06/2021 14:30",
//             "indice_pulmonar": 0.352273
//           },
//           {
//             "datetime": "21/06/2021 03:10",
//             "indice_pulmonar": 0.364417
//           },
//           {
//             "datetime": "21/06/2021 22:09",
//             "indice_pulmonar": 0.833557
//           }
//         ]
//       },
//       "id": "41"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 10:20",
//             "indice_cardiaco": 0.120688
//           },
//           {
//             "datetime": "21/06/2021 00:08",
//             "indice_cardiaco": 0.016135
//           },
//           {
//             "datetime": "21/06/2021 08:51",
//             "indice_cardiaco": 0.595755
//           }
//         ],
//         "cpf": "312.614.188-91",
//         "nome": "Tomás Nelson Vieira",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 19:11",
//             "indice_pulmonar": 0.789473
//           },
//           {
//             "datetime": "21/06/2021 09:21",
//             "indice_pulmonar": 0.531238
//           },
//           {
//             "datetime": "21/06/2021 07:53",
//             "indice_pulmonar": 0.573112
//           },
//           {
//             "datetime": "21/06/2021 09:20",
//             "indice_pulmonar": 0.945158
//           },
//           {
//             "datetime": "21/06/2021 02:54",
//             "indice_pulmonar": 0.532971
//           }
//         ]
//       },
//       "id": "29"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 09:02",
//             "indice_cardiaco": 0.915891
//           },
//           {
//             "datetime": "21/06/2021 14:08",
//             "indice_cardiaco": 0.675762
//           },
//           {
//             "datetime": "21/06/2021 23:51",
//             "indice_cardiaco": 0.14753
//           },
//           {
//             "datetime": "21/06/2021 02:23",
//             "indice_cardiaco": 0.592147
//           },
//           {
//             "datetime": "21/06/2021 10:29",
//             "indice_cardiaco": 0.678554
//           },
//           {
//             "datetime": "21/06/2021 07:27",
//             "indice_cardiaco": 0.25207
//           },
//           {
//             "datetime": "21/06/2021 17:25",
//             "indice_cardiaco": 0.337837
//           },
//           {
//             "datetime": "21/06/2021 00:24",
//             "indice_cardiaco": 0.058323
//           },
//           {
//             "datetime": "21/06/2021 07:38",
//             "indice_cardiaco": 0.289724
//           }
//         ],
//         "cpf": "868.546.031-02",
//         "nome": "Severino Isaac Osvaldo Pires",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 03:59",
//             "indice_pulmonar": 0.972461
//           },
//           {
//             "datetime": "21/06/2021 12:06",
//             "indice_pulmonar": 0.4745
//           },
//           {
//             "datetime": "21/06/2021 14:04",
//             "indice_pulmonar": 0.176478
//           },
//           {
//             "datetime": "21/06/2021 16:55",
//             "indice_pulmonar": 0.450484
//           },
//           {
//             "datetime": "21/06/2021 03:43",
//             "indice_pulmonar": 0.696408
//           },
//           {
//             "datetime": "21/06/2021 12:37",
//             "indice_pulmonar": 0.283603
//           },
//           {
//             "datetime": "21/06/2021 04:17",
//             "indice_pulmonar": 0.088132
//           }
//         ]
//       },
//       "id": "36"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 22:36",
//             "indice_cardiaco": 0.338038
//           },
//           {
//             "datetime": "21/06/2021 15:36",
//             "indice_cardiaco": 0.405263
//           },
//           {
//             "datetime": "21/06/2021 21:30",
//             "indice_cardiaco": 0.913737
//           }
//         ],
//         "cpf": "131.703.640-90",
//         "nome": "Thales Yuri Antonio Costa",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 13:15",
//             "indice_pulmonar": 0.365761
//           },
//           {
//             "datetime": "21/06/2021 05:25",
//             "indice_pulmonar": 0.621404
//           },
//           {
//             "datetime": "21/06/2021 13:01",
//             "indice_pulmonar": 0.312868
//           },
//           {
//             "datetime": "21/06/2021 23:29",
//             "indice_pulmonar": 0.99511
//           },
//           {
//             "datetime": "21/06/2021 04:19",
//             "indice_pulmonar": 0.263646
//           },
//           {
//             "datetime": "21/06/2021 04:03",
//             "indice_pulmonar": 0.393956
//           },
//           {
//             "datetime": "21/06/2021 09:53",
//             "indice_pulmonar": 0.052999
//           }
//         ]
//       },
//       "id": "48"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 19:26",
//             "indice_cardiaco": 0.445971
//           },
//           {
//             "datetime": "21/06/2021 08:18",
//             "indice_cardiaco": 0.123898
//           },
//           {
//             "datetime": "21/06/2021 22:38",
//             "indice_cardiaco": 0.872054
//           },
//           {
//             "datetime": "21/06/2021 20:56",
//             "indice_cardiaco": 0.611003
//           },
//           {
//             "datetime": "21/06/2021 01:28",
//             "indice_cardiaco": 0.585879
//           },
//           {
//             "datetime": "21/06/2021 23:29",
//             "indice_cardiaco": 0.747962
//           },
//           {
//             "datetime": "21/06/2021 01:18",
//             "indice_cardiaco": 0.863038
//           },
//           {
//             "datetime": "21/06/2021 21:35",
//             "indice_cardiaco": 0.024452
//           },
//           {
//             "datetime": "21/06/2021 11:27",
//             "indice_cardiaco": 0.9789
//           },
//           {
//             "datetime": "21/06/2021 02:12",
//             "indice_cardiaco": 0.834403
//           }
//         ],
//         "cpf": "448.984.629-01",
//         "nome": "Francisca Elaine Lopes",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 04:22",
//             "indice_pulmonar": 0.881575
//           },
//           {
//             "datetime": "21/06/2021 16:53",
//             "indice_pulmonar": 0.740198
//           },
//           {
//             "datetime": "21/06/2021 13:36",
//             "indice_pulmonar": 0.809168
//           },
//           {
//             "datetime": "21/06/2021 23:59",
//             "indice_pulmonar": 0.741532
//           },
//           {
//             "datetime": "21/06/2021 11:51",
//             "indice_pulmonar": 0.968443
//           },
//           {
//             "datetime": "21/06/2021 05:50",
//             "indice_pulmonar": 0.840365
//           },
//           {
//             "datetime": "21/06/2021 14:24",
//             "indice_pulmonar": 0.155729
//           },
//           {
//             "datetime": "21/06/2021 17:34",
//             "indice_pulmonar": 0.172704
//           }
//         ]
//       },
//       "id": "57"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 05:00",
//             "indice_cardiaco": 0.144111
//           },
//           {
//             "datetime": "21/06/2021 05:13",
//             "indice_cardiaco": 0.267091
//           },
//           {
//             "datetime": "21/06/2021 19:31",
//             "indice_cardiaco": 0.807687
//           },
//           {
//             "datetime": "21/06/2021 23:54",
//             "indice_cardiaco": 0.822378
//           },
//           {
//             "datetime": "21/06/2021 03:08",
//             "indice_cardiaco": 0.144169
//           },
//           {
//             "datetime": "21/06/2021 21:48",
//             "indice_cardiaco": 0.605922
//           },
//           {
//             "datetime": "21/06/2021 00:30",
//             "indice_cardiaco": 0.99155
//           }
//         ],
//         "cpf": "445.336.950-60",
//         "nome": "Sandra Jaqueline Patrícia da Cunha",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 10:56",
//             "indice_pulmonar": 0.051483
//           },
//           {
//             "datetime": "21/06/2021 01:20",
//             "indice_pulmonar": 0.336522
//           },
//           {
//             "datetime": "21/06/2021 05:24",
//             "indice_pulmonar": 0.783487
//           },
//           {
//             "datetime": "21/06/2021 06:41",
//             "indice_pulmonar": 0.639631
//           },
//           {
//             "datetime": "21/06/2021 16:05",
//             "indice_pulmonar": 0.967094
//           },
//           {
//             "datetime": "21/06/2021 10:11",
//             "indice_pulmonar": 0.458522
//           },
//           {
//             "datetime": "21/06/2021 18:06",
//             "indice_pulmonar": 0.603418
//           },
//           {
//             "datetime": "21/06/2021 04:00",
//             "indice_pulmonar": 0.856054
//           }
//         ]
//       },
//       "id": "46"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 09:26",
//             "indice_cardiaco": 0.124764
//           },
//           {
//             "datetime": "21/06/2021 09:47",
//             "indice_cardiaco": 0.847021
//           },
//           {
//             "datetime": "21/06/2021 18:13",
//             "indice_cardiaco": 0.181506
//           }
//         ],
//         "cpf": "974.340.772-39",
//         "nome": "Caio Benedito Erick Caldeira",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 09:59",
//             "indice_pulmonar": 0.193193
//           },
//           {
//             "datetime": "21/06/2021 15:13",
//             "indice_pulmonar": 0.078702
//           },
//           {
//             "datetime": "21/06/2021 11:27",
//             "indice_pulmonar": 0.062924
//           },
//           {
//             "datetime": "21/06/2021 13:01",
//             "indice_pulmonar": 0.31845
//           },
//           {
//             "datetime": "21/06/2021 08:36",
//             "indice_pulmonar": 0.75606
//           },
//           {
//             "datetime": "21/06/2021 16:18",
//             "indice_pulmonar": 0.080588
//           },
//           {
//             "datetime": "21/06/2021 20:55",
//             "indice_pulmonar": 0.141379
//           },
//           {
//             "datetime": "21/06/2021 21:38",
//             "indice_pulmonar": 0.265589
//           },
//           {
//             "datetime": "21/06/2021 19:20",
//             "indice_pulmonar": 0.882912
//           },
//           {
//             "datetime": "21/06/2021 08:09",
//             "indice_pulmonar": 0.558633
//           },
//           {
//             "datetime": "21/06/2021 00:08",
//             "indice_pulmonar": 0.191156
//           },
//           {
//             "datetime": "21/06/2021 18:34",
//             "indice_pulmonar": 0.196383
//           }
//         ]
//       },
//       "id": "49"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 02:43",
//             "indice_cardiaco": 0.710427
//           },
//           {
//             "datetime": "21/06/2021 14:35",
//             "indice_cardiaco": 0.928868
//           },
//           {
//             "datetime": "21/06/2021 13:57",
//             "indice_cardiaco": 0.502937
//           },
//           {
//             "datetime": "21/06/2021 07:00",
//             "indice_cardiaco": 0.874509
//           },
//           {
//             "datetime": "21/06/2021 07:37",
//             "indice_cardiaco": 0.535026
//           },
//           {
//             "datetime": "21/06/2021 08:00",
//             "indice_cardiaco": 0.845959
//           },
//           {
//             "datetime": "21/06/2021 03:47",
//             "indice_cardiaco": 0.378794
//           },
//           {
//             "datetime": "21/06/2021 18:18",
//             "indice_cardiaco": 0.148859
//           }
//         ],
//         "cpf": "841.677.523-01",
//         "nome": "Rafaela Gabrielly Nicole Barros",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 03:56",
//             "indice_pulmonar": 0.714919
//           },
//           {
//             "datetime": "21/06/2021 08:46",
//             "indice_pulmonar": 0.6415
//           },
//           {
//             "datetime": "21/06/2021 06:09",
//             "indice_pulmonar": 0.00882
//           },
//           {
//             "datetime": "21/06/2021 02:00",
//             "indice_pulmonar": 0.588758
//           },
//           {
//             "datetime": "21/06/2021 22:21",
//             "indice_pulmonar": 0.002174
//           }
//         ]
//       },
//       "id": "52"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 02:58",
//             "indice_cardiaco": 0.999263
//           },
//           {
//             "datetime": "21/06/2021 07:28",
//             "indice_cardiaco": 0.970225
//           },
//           {
//             "datetime": "21/06/2021 15:13",
//             "indice_cardiaco": 0.652874
//           },
//           {
//             "datetime": "21/06/2021 20:18",
//             "indice_cardiaco": 0.733331
//           },
//           {
//             "datetime": "21/06/2021 04:58",
//             "indice_cardiaco": 0.807601
//           }
//         ],
//         "cpf": "567.354.995-49",
//         "nome": "Ruan Severino da Paz",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 00:15",
//             "indice_pulmonar": 0.815343
//           },
//           {
//             "datetime": "21/06/2021 00:23",
//             "indice_pulmonar": 0.429807
//           },
//           {
//             "datetime": "21/06/2021 00:40",
//             "indice_pulmonar": 0.952768
//           },
//           {
//             "datetime": "21/06/2021 21:45",
//             "indice_pulmonar": 0.147535
//           },
//           {
//             "datetime": "21/06/2021 23:43",
//             "indice_pulmonar": 0.974063
//           },
//           {
//             "datetime": "21/06/2021 08:14",
//             "indice_pulmonar": 0.152894
//           },
//           {
//             "datetime": "21/06/2021 03:21",
//             "indice_pulmonar": 0.715305
//           },
//           {
//             "datetime": "21/06/2021 06:53",
//             "indice_pulmonar": 0.932916
//           },
//           {
//             "datetime": "21/06/2021 07:10",
//             "indice_pulmonar": 0.555215
//           },
//           {
//             "datetime": "21/06/2021 08:58",
//             "indice_pulmonar": 0.158225
//           },
//           {
//             "datetime": "21/06/2021 10:08",
//             "indice_pulmonar": 0.245226
//           },
//           {
//             "datetime": "21/06/2021 19:06",
//             "indice_pulmonar": 0.821554
//           },
//           {
//             "datetime": "21/06/2021 15:15",
//             "indice_pulmonar": 0.42365
//           }
//         ]
//       },
//       "id": "26"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 20:23",
//             "indice_cardiaco": 0.359453
//           },
//           {
//             "datetime": "21/06/2021 22:15",
//             "indice_cardiaco": 0.057175
//           },
//           {
//             "datetime": "21/06/2021 22:37",
//             "indice_cardiaco": 0.791733
//           },
//           {
//             "datetime": "21/06/2021 11:10",
//             "indice_cardiaco": 0.857677
//           },
//           {
//             "datetime": "21/06/2021 09:51",
//             "indice_cardiaco": 0.412813
//           },
//           {
//             "datetime": "21/06/2021 01:02",
//             "indice_cardiaco": 0.714193
//           },
//           {
//             "datetime": "21/06/2021 16:02",
//             "indice_cardiaco": 0.776264
//           },
//           {
//             "datetime": "21/06/2021 21:09",
//             "indice_cardiaco": 0.756238
//           },
//           {
//             "datetime": "21/06/2021 17:35",
//             "indice_cardiaco": 0.764489
//           },
//           {
//             "datetime": "21/06/2021 21:19",
//             "indice_cardiaco": 0.352002
//           },
//           {
//             "datetime": "21/06/2021 18:51",
//             "indice_cardiaco": 0.557778
//           }
//         ],
//         "cpf": "854.355.834-46",
//         "nome": "Rebeca Pietra Alana Pinto",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 00:21",
//             "indice_pulmonar": 0.164539
//           },
//           {
//             "datetime": "21/06/2021 09:01",
//             "indice_pulmonar": 0.210147
//           },
//           {
//             "datetime": "21/06/2021 22:37",
//             "indice_pulmonar": 0.481771
//           },
//           {
//             "datetime": "21/06/2021 19:52",
//             "indice_pulmonar": 0.776999
//           },
//           {
//             "datetime": "21/06/2021 15:56",
//             "indice_pulmonar": 0.948736
//           },
//           {
//             "datetime": "21/06/2021 13:12",
//             "indice_pulmonar": 0.008756
//           },
//           {
//             "datetime": "21/06/2021 06:16",
//             "indice_pulmonar": 0.286672
//           },
//           {
//             "datetime": "21/06/2021 17:56",
//             "indice_pulmonar": 0.336769
//           },
//           {
//             "datetime": "21/06/2021 13:40",
//             "indice_pulmonar": 0.537684
//           }
//         ]
//       },
//       "id": "2"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 20:56",
//             "indice_cardiaco": 0.908014
//           },
//           {
//             "datetime": "21/06/2021 10:08",
//             "indice_cardiaco": 0.026116
//           },
//           {
//             "datetime": "21/06/2021 10:05",
//             "indice_cardiaco": 0.959903
//           },
//           {
//             "datetime": "21/06/2021 20:08",
//             "indice_cardiaco": 0.68388
//           },
//           {
//             "datetime": "21/06/2021 22:26",
//             "indice_cardiaco": 0.056876
//           },
//           {
//             "datetime": "21/06/2021 01:51",
//             "indice_cardiaco": 0.967797
//           },
//           {
//             "datetime": "21/06/2021 13:01",
//             "indice_cardiaco": 0.216062
//           }
//         ],
//         "cpf": "877.232.566-63",
//         "nome": "André Gael Souza",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 13:29",
//             "indice_pulmonar": 0.435956
//           },
//           {
//             "datetime": "21/06/2021 20:21",
//             "indice_pulmonar": 0.348066
//           },
//           {
//             "datetime": "21/06/2021 15:42",
//             "indice_pulmonar": 0.733365
//           },
//           {
//             "datetime": "21/06/2021 06:12",
//             "indice_pulmonar": 0.16035
//           }
//         ]
//       },
//       "id": "13"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 01:32",
//             "indice_cardiaco": 0.084211
//           },
//           {
//             "datetime": "21/06/2021 07:40",
//             "indice_cardiaco": 0.09268
//           },
//           {
//             "datetime": "21/06/2021 11:02",
//             "indice_cardiaco": 0.511399
//           },
//           {
//             "datetime": "21/06/2021 21:26",
//             "indice_cardiaco": 0.76491
//           },
//           {
//             "datetime": "21/06/2021 10:01",
//             "indice_cardiaco": 0.960417
//           },
//           {
//             "datetime": "21/06/2021 03:53",
//             "indice_cardiaco": 0.024439
//           }
//         ],
//         "cpf": "281.885.948-49",
//         "nome": "Murilo Luan Baptista",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 23:50",
//             "indice_pulmonar": 0.517255
//           },
//           {
//             "datetime": "21/06/2021 20:06",
//             "indice_pulmonar": 0.624722
//           },
//           {
//             "datetime": "21/06/2021 12:10",
//             "indice_pulmonar": 0.035225
//           },
//           {
//             "datetime": "21/06/2021 08:16",
//             "indice_pulmonar": 0.649057
//           },
//           {
//             "datetime": "21/06/2021 05:23",
//             "indice_pulmonar": 0.010515
//           },
//           {
//             "datetime": "21/06/2021 09:01",
//             "indice_pulmonar": 0.840686
//           },
//           {
//             "datetime": "21/06/2021 11:51",
//             "indice_pulmonar": 0.93597
//           },
//           {
//             "datetime": "21/06/2021 00:59",
//             "indice_pulmonar": 0.529992
//           },
//           {
//             "datetime": "21/06/2021 23:40",
//             "indice_pulmonar": 0.286227
//           }
//         ]
//       },
//       "id": "3"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 14:45",
//             "indice_cardiaco": 0.114544
//           },
//           {
//             "datetime": "21/06/2021 08:59",
//             "indice_cardiaco": 0.907378
//           },
//           {
//             "datetime": "21/06/2021 05:30",
//             "indice_cardiaco": 0.770976
//           }
//         ],
//         "cpf": "888.087.646-56",
//         "nome": "Daniel Nicolas Anderson Nogueira",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 17:11",
//             "indice_pulmonar": 0.144127
//           },
//           {
//             "datetime": "21/06/2021 19:05",
//             "indice_pulmonar": 0.193673
//           },
//           {
//             "datetime": "21/06/2021 20:40",
//             "indice_pulmonar": 0.089275
//           }
//         ]
//       },
//       "id": "37"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 23:47",
//             "indice_cardiaco": 0.709219
//           },
//           {
//             "datetime": "21/06/2021 21:26",
//             "indice_cardiaco": 0.566788
//           },
//           {
//             "datetime": "21/06/2021 17:24",
//             "indice_cardiaco": 0.094692
//           },
//           {
//             "datetime": "21/06/2021 05:41",
//             "indice_cardiaco": 0.328214
//           },
//           {
//             "datetime": "21/06/2021 03:27",
//             "indice_cardiaco": 0.523069
//           },
//           {
//             "datetime": "21/06/2021 21:08",
//             "indice_cardiaco": 0.011179
//           },
//           {
//             "datetime": "21/06/2021 13:56",
//             "indice_cardiaco": 0.941295
//           },
//           {
//             "datetime": "21/06/2021 23:00",
//             "indice_cardiaco": 0.798978
//           }
//         ],
//         "cpf": "222.491.969-74",
//         "nome": "Lorena Mariah Barbosa",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 09:02",
//             "indice_pulmonar": 0.018878
//           },
//           {
//             "datetime": "21/06/2021 18:22",
//             "indice_pulmonar": 0.371093
//           },
//           {
//             "datetime": "21/06/2021 01:01",
//             "indice_pulmonar": 0.40336
//           },
//           {
//             "datetime": "21/06/2021 12:02",
//             "indice_pulmonar": 0.626539
//           }
//         ]
//       },
//       "id": "32"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 03:29",
//             "indice_cardiaco": 0.037706
//           },
//           {
//             "datetime": "21/06/2021 22:31",
//             "indice_cardiaco": 0.624159
//           }
//         ],
//         "cpf": "130.423.502-58",
//         "nome": "Fernando Vitor Santos",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 13:41",
//             "indice_pulmonar": 0.467
//           },
//           {
//             "datetime": "21/06/2021 09:12",
//             "indice_pulmonar": 0.34577
//           },
//           {
//             "datetime": "21/06/2021 18:41",
//             "indice_pulmonar": 0.588247
//           },
//           {
//             "datetime": "21/06/2021 19:40",
//             "indice_pulmonar": 0.856569
//           }
//         ]
//       },
//       "id": "43"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 04:00",
//             "indice_cardiaco": 0.740179
//           },
//           {
//             "datetime": "21/06/2021 23:38",
//             "indice_cardiaco": 0.28276
//           },
//           {
//             "datetime": "21/06/2021 20:09",
//             "indice_cardiaco": 0.488489
//           },
//           {
//             "datetime": "21/06/2021 01:52",
//             "indice_cardiaco": 0.0454
//           },
//           {
//             "datetime": "21/06/2021 01:57",
//             "indice_cardiaco": 0.546742
//           },
//           {
//             "datetime": "21/06/2021 08:19",
//             "indice_cardiaco": 0.568707
//           },
//           {
//             "datetime": "21/06/2021 16:16",
//             "indice_cardiaco": 0.051884
//           },
//           {
//             "datetime": "21/06/2021 12:25",
//             "indice_cardiaco": 0.49182
//           },
//           {
//             "datetime": "21/06/2021 07:29",
//             "indice_cardiaco": 0.182607
//           }
//         ],
//         "cpf": "691.304.257-43",
//         "nome": "Sabrina Daniela Gomes",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 09:23",
//             "indice_pulmonar": 0.173984
//           },
//           {
//             "datetime": "21/06/2021 11:39",
//             "indice_pulmonar": 0.286221
//           },
//           {
//             "datetime": "21/06/2021 06:21",
//             "indice_pulmonar": 0.47067
//           },
//           {
//             "datetime": "21/06/2021 05:35",
//             "indice_pulmonar": 0.351959
//           },
//           {
//             "datetime": "21/06/2021 08:02",
//             "indice_pulmonar": 0.176233
//           },
//           {
//             "datetime": "21/06/2021 22:01",
//             "indice_pulmonar": 0.419319
//           },
//           {
//             "datetime": "21/06/2021 03:06",
//             "indice_pulmonar": 0.104489
//           },
//           {
//             "datetime": "21/06/2021 17:47",
//             "indice_pulmonar": 0.28317
//           },
//           {
//             "datetime": "21/06/2021 17:14",
//             "indice_pulmonar": 0.795562
//           },
//           {
//             "datetime": "21/06/2021 06:14",
//             "indice_pulmonar": 0.221162
//           },
//           {
//             "datetime": "21/06/2021 20:37",
//             "indice_pulmonar": 0.937002
//           },
//           {
//             "datetime": "21/06/2021 12:19",
//             "indice_pulmonar": 0.057386
//           },
//           {
//             "datetime": "21/06/2021 04:26",
//             "indice_pulmonar": 0.873036
//           },
//           {
//             "datetime": "21/06/2021 07:27",
//             "indice_pulmonar": 0.735163
//           }
//         ]
//       },
//       "id": "60"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 06:11",
//             "indice_cardiaco": 0.139273
//           },
//           {
//             "datetime": "21/06/2021 16:33",
//             "indice_cardiaco": 0.53665
//           },
//           {
//             "datetime": "21/06/2021 02:39",
//             "indice_cardiaco": 0.21428
//           },
//           {
//             "datetime": "21/06/2021 20:29",
//             "indice_cardiaco": 0.495699
//           },
//           {
//             "datetime": "21/06/2021 22:15",
//             "indice_cardiaco": 0.997639
//           }
//         ],
//         "cpf": "696.077.059-98",
//         "nome": "Nicolas Daniel Theo Baptista",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 10:31",
//             "indice_pulmonar": 0.872244
//           },
//           {
//             "datetime": "21/06/2021 07:05",
//             "indice_pulmonar": 0.069396
//           },
//           {
//             "datetime": "21/06/2021 13:25",
//             "indice_pulmonar": 0.621982
//           },
//           {
//             "datetime": "21/06/2021 00:29",
//             "indice_pulmonar": 0.769708
//           },
//           {
//             "datetime": "21/06/2021 21:50",
//             "indice_pulmonar": 0.096149
//           },
//           {
//             "datetime": "21/06/2021 23:05",
//             "indice_pulmonar": 0.396093
//           },
//           {
//             "datetime": "21/06/2021 01:46",
//             "indice_pulmonar": 0.503093
//           },
//           {
//             "datetime": "21/06/2021 01:43",
//             "indice_pulmonar": 0.870738
//           },
//           {
//             "datetime": "21/06/2021 18:06",
//             "indice_pulmonar": 0.059116
//           },
//           {
//             "datetime": "21/06/2021 10:30",
//             "indice_pulmonar": 0.805739
//           }
//         ]
//       },
//       "id": "47"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 10:56",
//             "indice_cardiaco": 0.452616
//           },
//           {
//             "datetime": "21/06/2021 08:23",
//             "indice_cardiaco": 0.4853
//           },
//           {
//             "datetime": "21/06/2021 11:44",
//             "indice_cardiaco": 0.681698
//           },
//           {
//             "datetime": "21/06/2021 08:54",
//             "indice_cardiaco": 0.913741
//           },
//           {
//             "datetime": "21/06/2021 06:00",
//             "indice_cardiaco": 0.6274
//           },
//           {
//             "datetime": "21/06/2021 01:40",
//             "indice_cardiaco": 0.044331
//           },
//           {
//             "datetime": "21/06/2021 10:43",
//             "indice_cardiaco": 0.732763
//           }
//         ],
//         "cpf": "918.126.907-20",
//         "nome": "Manoel Arthur Costa",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 17:06",
//             "indice_pulmonar": 0.873599
//           },
//           {
//             "datetime": "21/06/2021 03:41",
//             "indice_pulmonar": 0.551164
//           },
//           {
//             "datetime": "21/06/2021 01:11",
//             "indice_pulmonar": 0.079602
//           },
//           {
//             "datetime": "21/06/2021 17:20",
//             "indice_pulmonar": 0.916454
//           },
//           {
//             "datetime": "21/06/2021 02:58",
//             "indice_pulmonar": 0.950175
//           },
//           {
//             "datetime": "21/06/2021 07:58",
//             "indice_pulmonar": 0.613298
//           },
//           {
//             "datetime": "21/06/2021 19:09",
//             "indice_pulmonar": 0.184617
//           },
//           {
//             "datetime": "21/06/2021 18:30",
//             "indice_pulmonar": 0.072911
//           },
//           {
//             "datetime": "21/06/2021 04:00",
//             "indice_pulmonar": 0.204828
//           },
//           {
//             "datetime": "21/06/2021 05:44",
//             "indice_pulmonar": 0.312579
//           },
//           {
//             "datetime": "21/06/2021 11:54",
//             "indice_pulmonar": 0.398116
//           },
//           {
//             "datetime": "21/06/2021 18:50",
//             "indice_pulmonar": 0.122021
//           }
//         ]
//       },
//       "id": "14"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 03:37",
//             "indice_cardiaco": 0.260116
//           },
//           {
//             "datetime": "21/06/2021 20:55",
//             "indice_cardiaco": 0.17685
//           },
//           {
//             "datetime": "21/06/2021 14:05",
//             "indice_cardiaco": 0.775367
//           },
//           {
//             "datetime": "21/06/2021 12:25",
//             "indice_cardiaco": 0.755584
//           },
//           {
//             "datetime": "21/06/2021 21:17",
//             "indice_cardiaco": 0.658214
//           },
//           {
//             "datetime": "21/06/2021 06:36",
//             "indice_cardiaco": 0.97498
//           }
//         ],
//         "cpf": "529.310.074-20",
//         "nome": "Raimundo Ricardo Figueiredo",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 08:56",
//             "indice_pulmonar": 0.122411
//           },
//           {
//             "datetime": "21/06/2021 20:49",
//             "indice_pulmonar": 0.700864
//           },
//           {
//             "datetime": "21/06/2021 19:36",
//             "indice_pulmonar": 0.625169
//           },
//           {
//             "datetime": "21/06/2021 10:19",
//             "indice_pulmonar": 0.574355
//           },
//           {
//             "datetime": "21/06/2021 21:41",
//             "indice_pulmonar": 0.842169
//           },
//           {
//             "datetime": "21/06/2021 18:49",
//             "indice_pulmonar": 0.144707
//           },
//           {
//             "datetime": "21/06/2021 13:50",
//             "indice_pulmonar": 0.997167
//           }
//         ]
//       },
//       "id": "31"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 10:06",
//             "indice_cardiaco": 0.678698
//           },
//           {
//             "datetime": "21/06/2021 23:56",
//             "indice_cardiaco": 0.078629
//           },
//           {
//             "datetime": "21/06/2021 20:15",
//             "indice_cardiaco": 0.343834
//           },
//           {
//             "datetime": "21/06/2021 13:37",
//             "indice_cardiaco": 0.12543
//           },
//           {
//             "datetime": "21/06/2021 23:55",
//             "indice_cardiaco": 0.61069
//           }
//         ],
//         "cpf": "810.489.602-42",
//         "nome": "Sandra Sophie Souza",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 06:18",
//             "indice_pulmonar": 0.495762
//           },
//           {
//             "datetime": "21/06/2021 17:51",
//             "indice_pulmonar": 0.812297
//           },
//           {
//             "datetime": "21/06/2021 07:56",
//             "indice_pulmonar": 0.960324
//           },
//           {
//             "datetime": "21/06/2021 12:37",
//             "indice_pulmonar": 0.998544
//           }
//         ]
//       },
//       "id": "59"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 16:41",
//             "indice_cardiaco": 0.208711
//           },
//           {
//             "datetime": "21/06/2021 23:50",
//             "indice_cardiaco": 0.092038
//           },
//           {
//             "datetime": "21/06/2021 11:16",
//             "indice_cardiaco": 0.971368
//           },
//           {
//             "datetime": "21/06/2021 06:28",
//             "indice_cardiaco": 0.384764
//           },
//           {
//             "datetime": "21/06/2021 13:20",
//             "indice_cardiaco": 0.49562
//           }
//         ],
//         "cpf": "371.845.242-17",
//         "nome": "Nina Laura Rezende",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 02:50",
//             "indice_pulmonar": 0.736376
//           },
//           {
//             "datetime": "21/06/2021 10:20",
//             "indice_pulmonar": 0.695998
//           },
//           {
//             "datetime": "21/06/2021 15:17",
//             "indice_pulmonar": 0.727866
//           },
//           {
//             "datetime": "21/06/2021 06:57",
//             "indice_pulmonar": 0.998498
//           },
//           {
//             "datetime": "21/06/2021 15:21",
//             "indice_pulmonar": 0.572893
//           },
//           {
//             "datetime": "21/06/2021 22:03",
//             "indice_pulmonar": 0.301736
//           }
//         ]
//       },
//       "id": "11"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 15:40",
//             "indice_cardiaco": 0.25152
//           },
//           {
//             "datetime": "21/06/2021 10:51",
//             "indice_cardiaco": 0.528739
//           },
//           {
//             "datetime": "21/06/2021 19:17",
//             "indice_cardiaco": 0.4917
//           },
//           {
//             "datetime": "21/06/2021 22:34",
//             "indice_cardiaco": 0.069874
//           },
//           {
//             "datetime": "21/06/2021 06:04",
//             "indice_cardiaco": 0.809361
//           },
//           {
//             "datetime": "21/06/2021 03:52",
//             "indice_cardiaco": 0.462184
//           },
//           {
//             "datetime": "21/06/2021 21:30",
//             "indice_cardiaco": 0.830349
//           },
//           {
//             "datetime": "21/06/2021 04:21",
//             "indice_cardiaco": 0.268344
//           }
//         ],
//         "cpf": "369.514.156-50",
//         "nome": "Bianca Aurora Andrea Caldeira",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 06:51",
//             "indice_pulmonar": 0.957842
//           },
//           {
//             "datetime": "21/06/2021 04:21",
//             "indice_pulmonar": 0.260566
//           },
//           {
//             "datetime": "21/06/2021 10:47",
//             "indice_pulmonar": 0.762145
//           },
//           {
//             "datetime": "21/06/2021 14:16",
//             "indice_pulmonar": 0.972617
//           }
//         ]
//       },
//       "id": "19"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 23:43",
//             "indice_cardiaco": 0.745614
//           },
//           {
//             "datetime": "21/06/2021 10:37",
//             "indice_cardiaco": 0.139692
//           },
//           {
//             "datetime": "21/06/2021 14:33",
//             "indice_cardiaco": 0.888618
//           },
//           {
//             "datetime": "21/06/2021 01:36",
//             "indice_cardiaco": 0.121253
//           },
//           {
//             "datetime": "21/06/2021 09:26",
//             "indice_cardiaco": 0.865614
//           },
//           {
//             "datetime": "21/06/2021 01:10",
//             "indice_cardiaco": 0.098281
//           },
//           {
//             "datetime": "21/06/2021 00:13",
//             "indice_cardiaco": 0.957866
//           },
//           {
//             "datetime": "21/06/2021 23:57",
//             "indice_cardiaco": 0.786507
//           },
//           {
//             "datetime": "21/06/2021 02:26",
//             "indice_cardiaco": 0.263802
//           }
//         ],
//         "cpf": "161.980.393-31",
//         "nome": "Sueli Tânia Raimunda Melo",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 19:11",
//             "indice_pulmonar": 0.665994
//           },
//           {
//             "datetime": "21/06/2021 00:30",
//             "indice_pulmonar": 0.419184
//           },
//           {
//             "datetime": "21/06/2021 21:16",
//             "indice_pulmonar": 0.134503
//           }
//         ]
//       },
//       "id": "10"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 01:10",
//             "indice_cardiaco": 0.857254
//           },
//           {
//             "datetime": "21/06/2021 18:14",
//             "indice_cardiaco": 0.931995
//           },
//           {
//             "datetime": "21/06/2021 08:35",
//             "indice_cardiaco": 0.504817
//           },
//           {
//             "datetime": "21/06/2021 14:23",
//             "indice_cardiaco": 0.564422
//           },
//           {
//             "datetime": "21/06/2021 16:30",
//             "indice_cardiaco": 0.270571
//           },
//           {
//             "datetime": "21/06/2021 14:10",
//             "indice_cardiaco": 0.991899
//           },
//           {
//             "datetime": "21/06/2021 15:45",
//             "indice_cardiaco": 0.50561
//           }
//         ],
//         "cpf": "410.563.467-44",
//         "nome": "Emily Aparecida Lúcia Farias",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 19:29",
//             "indice_pulmonar": 0.318131
//           },
//           {
//             "datetime": "21/06/2021 04:50",
//             "indice_pulmonar": 0.4886
//           },
//           {
//             "datetime": "21/06/2021 08:16",
//             "indice_pulmonar": 0.042748
//           }
//         ]
//       },
//       "id": "21"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 18:39",
//             "indice_cardiaco": 0.478257
//           },
//           {
//             "datetime": "21/06/2021 02:13",
//             "indice_cardiaco": 0.835309
//           },
//           {
//             "datetime": "21/06/2021 19:48",
//             "indice_cardiaco": 0.509185
//           },
//           {
//             "datetime": "21/06/2021 12:45",
//             "indice_cardiaco": 0.235703
//           },
//           {
//             "datetime": "21/06/2021 23:13",
//             "indice_cardiaco": 0.31831
//           }
//         ],
//         "cpf": "127.978.316-83",
//         "nome": "Kamilly Ana Josefa Rezende",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 21:54",
//             "indice_pulmonar": 0.141376
//           },
//           {
//             "datetime": "21/06/2021 12:05",
//             "indice_pulmonar": 0.890566
//           },
//           {
//             "datetime": "21/06/2021 15:46",
//             "indice_pulmonar": 0.413127
//           }
//         ]
//       },
//       "id": "42"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 03:03",
//             "indice_cardiaco": 0.474251
//           },
//           {
//             "datetime": "21/06/2021 02:20",
//             "indice_cardiaco": 0.235407
//           }
//         ],
//         "cpf": "063.718.156-52",
//         "nome": "Fabiana Nair Porto",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 14:33",
//             "indice_pulmonar": 0.906849
//           },
//           {
//             "datetime": "21/06/2021 15:16",
//             "indice_pulmonar": 0.481767
//           },
//           {
//             "datetime": "21/06/2021 11:30",
//             "indice_pulmonar": 0.589765
//           },
//           {
//             "datetime": "21/06/2021 08:24",
//             "indice_pulmonar": 0.152391
//           },
//           {
//             "datetime": "21/06/2021 20:17",
//             "indice_pulmonar": 0.429061
//           },
//           {
//             "datetime": "21/06/2021 08:36",
//             "indice_pulmonar": 0.901747
//           },
//           {
//             "datetime": "21/06/2021 13:58",
//             "indice_pulmonar": 0.023409
//           },
//           {
//             "datetime": "21/06/2021 16:15",
//             "indice_pulmonar": 0.122615
//           },
//           {
//             "datetime": "21/06/2021 10:44",
//             "indice_pulmonar": 0.682759
//           },
//           {
//             "datetime": "21/06/2021 02:51",
//             "indice_pulmonar": 0.597694
//           },
//           {
//             "datetime": "21/06/2021 12:32",
//             "indice_pulmonar": 0.973161
//           }
//         ]
//       },
//       "id": "51"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 02:59",
//             "indice_cardiaco": 0.164177
//           },
//           {
//             "datetime": "21/06/2021 21:00",
//             "indice_cardiaco": 0.248637
//           },
//           {
//             "datetime": "21/06/2021 13:27",
//             "indice_cardiaco": 0.07413
//           }
//         ],
//         "cpf": "686.375.378-20",
//         "nome": "Maria Simone Porto",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 08:00",
//             "indice_pulmonar": 0.273892
//           },
//           {
//             "datetime": "21/06/2021 05:29",
//             "indice_pulmonar": 0.08938
//           },
//           {
//             "datetime": "21/06/2021 11:17",
//             "indice_pulmonar": 0.638868
//           },
//           {
//             "datetime": "21/06/2021 08:09",
//             "indice_pulmonar": 0.931934
//           },
//           {
//             "datetime": "21/06/2021 03:23",
//             "indice_pulmonar": 0.781461
//           },
//           {
//             "datetime": "21/06/2021 19:40",
//             "indice_pulmonar": 0.010748
//           },
//           {
//             "datetime": "21/06/2021 07:48",
//             "indice_pulmonar": 0.16256
//           }
//         ]
//       },
//       "id": "56"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 23:53",
//             "indice_cardiaco": 0.926682
//           },
//           {
//             "datetime": "21/06/2021 15:47",
//             "indice_cardiaco": 0.158614
//           },
//           {
//             "datetime": "21/06/2021 10:40",
//             "indice_cardiaco": 0.665818
//           },
//           {
//             "datetime": "21/06/2021 12:46",
//             "indice_cardiaco": 0.322874
//           }
//         ],
//         "cpf": "819.263.701-80",
//         "nome": "Diego Caio Benjamin da Mota",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 03:21",
//             "indice_pulmonar": 0.658606
//           },
//           {
//             "datetime": "21/06/2021 04:20",
//             "indice_pulmonar": 0.333929
//           },
//           {
//             "datetime": "21/06/2021 13:29",
//             "indice_pulmonar": 0.291074
//           },
//           {
//             "datetime": "21/06/2021 02:24",
//             "indice_pulmonar": 0.658156
//           },
//           {
//             "datetime": "21/06/2021 22:17",
//             "indice_pulmonar": 0.76423
//           },
//           {
//             "datetime": "21/06/2021 04:49",
//             "indice_pulmonar": 0.584282
//           }
//         ]
//       },
//       "id": "8"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 22:02",
//             "indice_cardiaco": 0.018663
//           },
//           {
//             "datetime": "21/06/2021 05:32",
//             "indice_cardiaco": 0.708006
//           },
//           {
//             "datetime": "21/06/2021 09:03",
//             "indice_cardiaco": 0.070344
//           },
//           {
//             "datetime": "21/06/2021 22:22",
//             "indice_cardiaco": 0.501762
//           }
//         ],
//         "cpf": "748.052.735-77",
//         "nome": "Heloise Sarah Mirella da Cunha",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 00:17",
//             "indice_pulmonar": 0.0938
//           },
//           {
//             "datetime": "21/06/2021 15:08",
//             "indice_pulmonar": 0.151186
//           },
//           {
//             "datetime": "21/06/2021 03:57",
//             "indice_pulmonar": 0.829334
//           }
//         ]
//       },
//       "id": "58"
//     },
//     {
//       "data": {
//         "cardiaco": [
//           {
//             "datetime": "21/06/2021 05:12",
//             "indice_cardiaco": 0.034491
//           }
//         ],
//         "cpf": "618.702.796-54",
//         "nome": "Bernardo Nelson Noah Souza",
//         "pulmonar": [
//           {
//             "datetime": "21/06/2021 05:40",
//             "indice_pulmonar": 0.120562
//           },
//           {
//             "datetime": "21/06/2021 10:34",
//             "indice_pulmonar": 0.67482
//           },
//           {
//             "datetime": "21/06/2021 01:26",
//             "indice_pulmonar": 0.095859
//           },
//           {
//             "datetime": "21/06/2021 07:49",
//             "indice_pulmonar": 0.828615
//           },
//           {
//             "datetime": "21/06/2021 03:31",
//             "indice_pulmonar": 0.042368
//           }
//         ]
//       },
//       "id": "23"
//     }
//   ]
// }