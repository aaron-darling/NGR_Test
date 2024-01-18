import { Component } from '@angular/core';
import {NgFor} from "@angular/common";
import { ChartComponent } from '../chart/chart.component';
import { read, utils } from "xlsx"


@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [ChartComponent, NgFor],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent {
  public ChartTypes: string[] = [];
  public LineDataSets: any[] = [];
  public LineXAxisLables: string[] = [];
  public BarDataSets: any[] = [];
  public BarXAxisLables: string[] = [];

  public arrayBuffer: any;
  public exceljsondata: any;

  public ChooseBackgroundColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  FindChartType( tabName:string) :string {
    if (tabName.endsWith("_BarChart")) {
      return "bar";
    }
    else if (tabName.endsWith("_LineChart")) {
      return "line";
    }
    else {
      alert("Invalid File Input: Excel tab needs to end in _BarChart or _LineChart.  Defaulting to Bar Chart.");
      return "bar";
    }
  }


  loadFile(event:any) {


    var input, uploadEvent, file:any, fileReader: FileReader;
    if (event.target.files.length > 0) {
      file = event.target.files[0];
      uploadEvent = event;
    }
    else{
      alert("File Selection Is Required.");
      return;
    }

    fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var ws = 0; ws != data.length; ++ws)
        arr[ws] = String.fromCharCode(data[ws]);
      var bstr = arr.join("");
      var workbook = read(bstr, {
        type: "binary"
      });
      var barDataSetCell = 0;
      var lineDataSetCell = 0;
      //worksheets loop
      for (var ws = 0; ws < workbook.SheetNames.length; ws++) {
        var sheet_name = workbook.SheetNames[ws];
        var worksheet = workbook.Sheets[sheet_name];
        this.exceljsondata = utils.sheet_to_json(worksheet, {
          raw: true,
          defval: "",
        });
        var labels = Object.keys(this.exceljsondata[0]);
        //worksheet col loop
        for( var col = 0; col < labels.length; col++){
          if(col != 0){
            this.ChartTypes.push(this.FindChartType(sheet_name));
          }

          var dataArr : number[] = [];
          for(var row = 0; row < this.exceljsondata.length; row++){
             //first col is always the x axis labels
            if(col == 0){
              if (this.FindChartType(sheet_name) == 'line'){
                this.LineXAxisLables.push(this.exceljsondata[row][labels[0]]);

              }
              else
              {
                this.BarXAxisLables.push(this.exceljsondata[row][labels[0]]);

              }

             }

             else{
              dataArr.push( this.exceljsondata[row][labels[col]]);
             }
          }
          if(col != 0){
            if (this.FindChartType(sheet_name) == 'line'){
              this.LineDataSets.push({label: labels[col], data: dataArr, backgroundColor: this.ChooseBackgroundColor()});
              lineDataSetCell++;
            }
            else
            {
              this.BarDataSets.push({label: labels[col], data: dataArr, backgroundColor: this.ChooseBackgroundColor()});
              barDataSetCell++;
            }
          }
        }

      }
    };
    fileReader.readAsArrayBuffer(file);
  }
}
