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
import { Component } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-report-advisory',
  templateUrl: './report-advisory.component.html',
  styleUrls: ['./report-advisory.component.scss', '../../reports.scss']
})
export class ReportAdvisoryComponent {

  appLongName: string;
  appShortName: string;

  /**
   * 
   */
  constructor(
    public configSvc: ConfigService,
    public tSvc: TranslocoService
  ) {
    this.appLongName = this.tSvc.translate(`publisher.${configSvc.installationMode.toLowerCase()}.app long name`);
    this.appShortName = this.tSvc.translate(`publisher.${configSvc.installationMode.toLowerCase()}.app short name`);
  }
}
