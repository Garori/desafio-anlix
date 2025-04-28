import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { IntegrationAPIService } from '../../integration-api.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExportService } from '../../export.service';
import { MY_FORMATS } from '../indices/indices.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';


@Component({
  selector: 'app-chart',
  imports: [CommonModule, RouterModule, CanvasJSAngularChartsModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatButtonModule],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {

  patient: { [key: string]: any } = {};
  patientData: { [key: string]: any }[] = [{"data":{"cardiaco":[],"pulmonar":[]}}];
  data_str = "";
  data_final_str = "";
  id:string = "";
  got_data = false;
  has_csv_button=false;
  chart: any;


  constructor(private integrationAPIService: IntegrationAPIService, private route: ActivatedRoute, private exportService: ExportService){
    this.id = this.route.snapshot.paramMap.get("id") ?? "-1"
    this.integrationAPIService.getPatientById(this.id).subscribe(res => {
      this.patient = res[0];
      // console.log(this.patient);
    });
    
    // console.log(menu?.innerHTML)
    // this.initTeste();
    // console.log(this.patientData)
  }

  indicesForm = new FormGroup({
    data: new FormControl(moment(), [Validators.required]),
    data_final: new FormControl(moment(), [Validators.required]),
  });

  handleSubmit() {
    // console.log(this.indicesForm.value.data);
    this.data_str = this.indicesForm.value.data?.format("YYYY-MM-DD") as string;
    this.data_final_str = this.indicesForm.value.data_final?.format("YYYY-MM-DD") as string;
    let body: { [key: string]: any } = { "date": this.data_str, "final_date": this.data_final_str }
    this.integrationAPIService.getPatientDatesIndices(this.id, body).subscribe(res => {
      this.patientData = res;
      this.got_data = true;
      
      // this.chart.render()
      // this.chart.options = this.chartOptions;
      if (this.patientData.length > 0 ){
        try {
          const auxChart = document.getElementById("chartchart") as HTMLElement;
          if (auxChart)
          {
            auxChart.style.display = "flex";
          }
          
          this.chart.options.data[0].dataPoints = this.patientData[0]["data"]["cardiaco"];
          this.chart.options.data[1].dataPoints = this.patientData[0]["data"]["pulmonar"];
          this.chart.render();
          console.log(this.patientData)
          if (! this.has_csv_button){
            // essa parte toda é para criar um botão a mais no menu do gráfico
            const menu = document.getElementById("canvasjs-angular-chart-container-0")?.querySelector("div[tabindex='-1']");
            const firstchild = menu?.querySelectorAll("div")[0];
            let csv = document.createElement("div");
            csv.innerHTML = "Exportar para CSV";
            let a = menu?.firstChild;
            csv.setAttribute("style", firstchild?.getAttribute("style")!);
            csv.style.lineHeight = "15px";
            csv.addEventListener("click", ()=>{this.export_graph_csv()});
            csv.addEventListener("mousemove", function () { this.setAttribute("style","padding: 12px 8px; background-color: white; color: black; line-height: 15px; background-color: rgb(33, 150, 243);")});
            csv.addEventListener("mouseout", function () { this.setAttribute("style", "padding: 12px 8px; background-color: white; color: black; line-height: 15px; background-color: white;") });
            menu?.appendChild(csv);
            this.has_csv_button = true;
          }
        } catch (error) {
          console.log(error)
          this.patientData = []
          const auxChart = document.getElementById("chartchart") as HTMLElement;
          if (auxChart) {
            auxChart.style.display = "none";
          }

        }
      }
      else{
        const auxChart = document.getElementById("chartchart") as HTMLElement;
        if (auxChart) {
          auxChart.style.display = "none";
        }
      }
        
        // console.log(res)
      // console.log(this.patientData)
      // console.log(this.patientData.length)
      // this.chart.data[0].
    });

    console.log(this.chart)
  }

  handleExport(min_date = -1, max_date = -1) {
    console.log("entrei");
    let to_export: object[] = [];
    this.patientData.forEach(element => {
      // let aux:{[key:string]:any} = {}
      element["data"]["cardiaco"].forEach((element2: { [x: string]: any; }) => {
        if (min_date != -1 && element2["x"] >= min_date && element2["x"] <= max_date){
          let to_append = JSON.parse(JSON.stringify(element2)) // fazendo uma deep copy para não apagar os elementos do gráfico
          to_append["indice_pulmonar"] = "-";
          delete to_append["x"] //apagando x e y para não aparecer no csv
          delete to_append["y"] //apagando x e y para não aparecer no csv
          to_export.push(to_append);
        }
      });

      element["data"]["pulmonar"].forEach((element2: { [x: string]: any; }) => {
        if (min_date != -1 && element2["x"] >= min_date && element2["x"] <= max_date) {
          let to_append = JSON.parse(JSON.stringify(element2)) // fazendo uma deep copy para não apagar os elementos do gráfico
          to_append["indice_cardiaco"] = "-";
          delete to_append["x"] //apagando x e y para não aparecer no csv
          delete to_append["y"] //apagando x e y para não aparecer no csv
          to_export.push(to_append);
        }
      }
      );
      // to_export.push({element["data"]:})
    });
    // console.log(to_export)
    let data_to_name = ""
    if(min_date != -1){
      // let data_to_name = 0;
      let minDate = new Date(min_date);
      let maxDate = new Date(max_date);
      data_to_name = minDate.toLocaleDateString("ja-JP").replaceAll("/", "-") + " to " + maxDate.toLocaleDateString("ja-JP").replaceAll("/", "-")
    }
    else{
      data_to_name = this.data_str + " to " + this.data_final_str
    }
    this.exportService.exportToCsv(to_export, this.patient["nome"] + " ("+data_to_name+")");
  }
  

  chartOptions = {
    zoomEnabled: true,
    exportEnabled: true,
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Índice(s) x Data"
    },
    axisX: {
      valueFormatString: "DD/MM/YY"
    },
    axisY: {
      title: "Taxa",
      minimum: 0
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },

    data: [{
      type: "line",
      markerType: "circle",
      showInLegend: true,
      name: "Índice Cardiaco",
      xValueType: "dateTime",
      xValueFormatString: "DD/MMM/YY HH:MM",
      dataPoints: this.patientData[0]["data"]["cardiaco"],
    }, {
      type: "line",
      markerType: "circle",
      showInLegend: true,
      name: "Índice Pulmonar",
      xValueType: "dateTime",
      xValueFormatString: "DD/MMM/YY HH:MM",
      dataPoints: this.patientData[0]["data"]["pulmonar"],
    }]
  }

  getChartInstance(chart: object) {
    this.chart = chart;
    console.log(this.chart);
  }

  export_graph_csv() {
    console.log(this.chart);
    try {
      this.handleExport(this.chart.axisX[0].get("viewportMinimum"), this.chart.axisX[0].get("viewportMaximum"))
      console.log(this.chart.axisX[0].get("viewportMinimum"))
      console.log(this.chart.axisX[0].get("viewportMaximum"))
      
    } catch (error) {
      console.log("Algum erro ocorreu!")
    }
  }


    
  }
  