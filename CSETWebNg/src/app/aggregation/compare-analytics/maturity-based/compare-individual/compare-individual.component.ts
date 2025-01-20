////////////////////////////////
//
//   Copyright 2024 Battelle Energy Alliance, LLC
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.
//
////////////////////////////////
import { Component, OnInit } from '@angular/core';
import { AggregationService } from '../../../../services/aggregation.service';
import { ChartService } from '../../../../services/chart.service';
import { ColorService } from '../../../../services/color.service';
import { QuestionsService } from '../../../../services/questions.service';

@Component({
  selector: 'app-compare-individual-maturity',
  templateUrl: './compare-individual.component.html',
  // eslint-disable-next-line
  host: { class: 'd-flex flex-column flex-11a' }
})
export class CompareMaturityIndividualComponent implements OnInit {

  answerCounts: any[] = null;
  answerLabels: string[] = [];
  chartsMaturityCompliance: any[];
  

  constructor(
    public aggregationSvc: AggregationService,
    public questionSvc: QuestionsService,
    public chartSvc: ChartService,
    public colorSvc: ColorService
  ) { }

  ngOnInit() {
    this.colorSvc.reset();
    this.populateCharts();
  }

  /**
   * 
   */
  populateCharts() {
    // Assessment Answer Summary - tabular data
    this.aggregationSvc.getMaturityAnswerTotals().subscribe((x: any) => {
      // 
      this.answerCounts = x;

      // build a list of answer options for the table columns
      this.answerLabels = [];
      x[0].answerCounts.forEach(opt => {
        const label = this.questionSvc.answerDisplayLabel(x[0].modelId, opt.answer_Text);
        this.answerLabels.push(label);
      });
    });

    // Maturity Compliance By Model/Domain
    this.aggregationSvc.getAggregationCompliance().subscribe((resp: any) => {
      let showLegend = true;

      if (!resp.length) {
        showLegend = false;
        resp = [{
          chartName: '',
          labels: ['No Maturity Models Selected'],
          datasets: [{ data: 0 }],
          chart: null
        }];
      }

      this.chartsMaturityCompliance = resp;

      resp.forEach(x => {
        this.buildMaturityChart(x, showLegend);
      });
    });
  }

  /**
   * 
   */
  buildMaturityChart(c, showLegend) {
    c.datasets.forEach(ds => {
      ds.backgroundColor = this.colorSvc.getColorForAssessment(ds.label);
    });


    setTimeout(() => {
      c.chart = this.chartSvc.buildHorizBarChart('canvasMaturityBars-' + c.chartName, c, showLegend, true)
    }, 1000);
  }
}
