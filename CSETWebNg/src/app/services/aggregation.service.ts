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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';
import { Aggregation } from '../models/aggregation.model';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AggregationService {

  private apiUrl: string;

  /**
   * Contains 'TREND' or 'COMPARE'
   */
  public mode: string;

  public currentAggregation: Aggregation;

  /**
   * Constructor.
   * @param http
   * @param configSvc
   */
  constructor(
    private http: HttpClient,
    private configSvc: ConfigService,
    private router: Router
  ) {

    this.apiUrl = this.configSvc.apiUrl + "aggregation/";
    this.currentAggregation = null;
  }


  id(): number {
    return +localStorage.getItem('aggregationId');
  }


  /**
   * Returns the singluar or plural name for the aggretation type.
   * @param plural
   */
  modeDisplay(plural: boolean) {
    if (!this.mode) {
      return '';
    }

    switch (this.mode.toLowerCase()) {
      case 'trend':
        return plural ? 'Trends' : 'Trend';
      case 'compare':
        return plural ? 'Comparisons' : 'Comparison';
    }
  }


  getList() {
    return this.http.post(this.apiUrl + 'getaggregations?mode=' + this.mode, '');
  }


  /**
   * Calls the API to create a new aggregation record
   */
  createAggregation() {
    return this.http.post(this.apiUrl + 'create?mode=' + this.mode, '');
  }


  /**
   *
   * @param id
   */
  loadAggregation(id: number) {
    this.getAggregationToken(id).then(() => {
      this.getAggregation().subscribe((agg: any) => {
        this.currentAggregation = agg;
        this.router.navigate(['/alias-assessments', id]);
      });
    });
  }


  /**
   *
   * @param aggId
   */
  getAggregationToken(aggId: number) {
    const obs = this.http.get(this.configSvc.apiUrl + 'auth/token?aggregationId=' + aggId);
    const prom = firstValueFrom(obs);

    return prom.then((response: { token: string }) => {
        localStorage.removeItem('userToken');
        localStorage.setItem('userToken', response.token);
        if (aggId) {
          localStorage.removeItem('aggregationId');
          localStorage.setItem(
            'aggregationId',
            aggId ? aggId.toString() : ''
          );
        }
      });
  }


  getAggregation() {
    return this.http.post(this.apiUrl + 'get', '');
  }


  updateAggregation() {
    const agg = this.currentAggregation;
    const aggForSubmit = {
      aggregationId: agg.aggregationId,
      aggregationName: agg.aggregationName.substring(0, 99),
      aggregationDate: agg.aggregationDate
    };
    return this.http.post(this.apiUrl + 'update', aggForSubmit);
  }


  deleteAggregation(id: any) {
    return this.http.post(this.apiUrl + 'delete?aggregationId=' + id, '');
  }


  getAssessments() {
    return this.http.post(this.apiUrl + 'getassessments', '');
  }


  saveAssessmentSelection(selected: boolean, assessment: any) {
    return this.http.post(this.apiUrl + 'saveassessmentselection',
      { selected: selected, assessmentId: assessment.assessmentId });
  }


  saveAssessmentAlias(assessment: any, aliasData: any[]) {
    return this.http.post(this.apiUrl + 'saveassessmentalias',
      { aliasAssessment: assessment, assessmentList: aliasData }, { responseType: 'text' });
  }

  getAnswerTotals() {
    return this.http.post(this.apiUrl + 'analysis/getanswertotals', null);
  }

  getMaturityAnswerTotals() {
    return this.http.post(this.apiUrl + 'analysis/maturity/answertotals', null);
  }



  ////////////////////////////////  Trend  //////////////////////////////////

  getOverallComplianceScores() {
    return this.http.post(this.apiUrl + 'analysis/overallcompliancescore', null);
  }

  getTrendTop5() {
    return this.http.post(this.apiUrl + 'analysis/top5', null);
  }

  getTrendBottom5() {
    return this.http.post(this.apiUrl + 'analysis/bottom5', null);
  }

  getCategoryPercentageComparisons() {
    return this.http.post(this.apiUrl + 'analysis/categorypercentcompare', null);
  }



  ////////////////////////////////  Compare  //////////////////////////////////

  getOverallAverageSummary() {
    return this.http.post(this.apiUrl + 'analysis/overallaverages', null);
  }

  getOverallComparison() {
    return this.http.post(this.apiUrl + 'analysis/overallcomparison', null);
  }

  getStandardsAnswers() {
    return this.http.post(this.apiUrl + 'analysis/standardsanswers', null);
  }

  getComponentsAnswers() {
    return this.http.post(this.apiUrl + 'analysis/componentsanswers', null);
  }

  getCategoryAverages() {
    return this.http.post(this.apiUrl + 'analysis/categoryaverages', null);
  }

  getAggregationCompliance() {
    return this.http.get(this.apiUrl + 'analysis/maturity/compliance', null);
  }


  getMissedQuestions() {
    return this.http.post(this.apiUrl + 'missedquestions', {});
  }

  getSalComparison() {
    return this.http.post(this.apiUrl + 'analysis/salcomparison', null);
  }

  getBestToWorst() {
    return this.http.post(this.apiUrl + 'analysis/getbesttoworst', null);
  }

  /**
   * Gets a list of questions that were missed in all assessments
   */
  getMaturityMissedQuestions() {
    return this.http.post(this.apiUrl + 'maturity/missedquestions', {});
  }

  /**
   * Get the maturity "best to worst" model 
   */
  getMaturityBestToWorst() {
    return this.http.post(this.apiUrl + 'analysis/maturity/besttoworst', null);
  }


  //////////////////////////////// Merge //////////////////////////////////////

  getMergeSourceAnswers() {
    return this.http.post(this.apiUrl + 'getanswers', '');
  }

  setMergeAnswer(answerId: number, answerText: string) {
    return this.http.post(this.apiUrl + 'setmergeanswer?answerId=' + answerId + '&answerText=' + answerText, null);
  }
}
