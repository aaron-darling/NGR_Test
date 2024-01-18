import { Component, OnInit, Input , ChangeDetectorRef } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  public LineChart: any;
  public BarChart: any;
  public update:any;

  @Input() LineDataSets: any = [];// {label: string, data: number[], backgroundColor: string}[] = [];

  @Input() LineXAxisLables: string[] = [];
  @Input() BarDataSets: any = [];// {label: string, data: number[], backgroundColor: string}[] = [];

  @Input() BarXAxisLables: string[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

ngOnInit(): void {
  console.log("ngOnInit ");
  this.createLineChart();
  this.createBarChart();

}

  createLineChart(){

    this.LineChart = new Chart("MyLineChart", {
      type: "line", //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.LineXAxisLables,
	       datasets:this.LineDataSets
      },
      options: {
        aspectRatio:2.5
      }

    });
    this.changeDetectorRef.detectChanges();
  }

  createBarChart(){

    this.BarChart = new Chart("MyBarChart", {
      type: "bar",

      data: {// values on X-Axis
        labels:  this.BarXAxisLables,
	       datasets: this.BarDataSets
      },
      options: {
        aspectRatio:2.5
      }

    });
    this.changeDetectorRef.detectChanges();
  }

}
