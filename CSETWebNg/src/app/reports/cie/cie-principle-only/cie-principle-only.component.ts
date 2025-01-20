import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GroupingDescriptionComponent } from '../../../assessment/questions/grouping-description/grouping-description.component';
import { AssessmentService } from '../../../services/assessment.service';
import { CieService } from '../../../services/cie.service';
import { ConfigService } from '../../../services/config.service';
import { ObservationsService } from '../../../services/observations.service';
import { QuestionsService } from '../../../services/questions.service';
import { ReportService } from '../../../services/report.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { FileUploadClientService } from '../../../services/file-client.service';
import { QuestionFilterService } from '../../../services/filtering/question-filter.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuestionFiltersReportsComponent } from '../../../dialogs/question-filters-reports/question-filters-reports.component';

@Component({
  selector: 'app-cie-principle-only',
  templateUrl: './cie-principle-only.component.html',
  styleUrls: ['../../reports.scss', '../../acet-reports.scss', './cie-principle-only.component.scss']
})
export class CiePrincipleOnlyComponent {
  response: any = {};

  hasComments: any[] = [];
  // showSubcats: Map<String, boolean> = new Map<String, boolean>();
  expandedOptions: Map<String, boolean> = new Map<String, boolean>();
  principleTitleList: string[] = [];

  examLevel: string = '';
  loading: boolean = true;

  filterDialogRef: MatDialogRef<QuestionFiltersReportsComponent>;

  @ViewChild('groupingDescription') groupingDescription: GroupingDescriptionComponent;

  constructor(
    public reportSvc: ReportService,
    public assessSvc: AssessmentService,
    public questionsSvc: QuestionsService,
    private titleService: Title,
    public cieSvc: CieService,
    public configSvc: ConfigService,
    public observationSvc: ObservationsService,
    public authSvc: AuthenticationService,
    public fileSvc: FileUploadClientService,
    private dialog: MatDialog,
    private filterSvc: QuestionFilterService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Export Principle-Scope CIE - Report");

    this.cieSvc.getCiePrincipleQuestions().subscribe(
      (r: any) => {
        this.response = r;

        // goes through domains
        for (let i = 0; i < this.response?.matAnsweredQuestions[0]?.assessmentFactors?.length; i++) {
          let domain = this.response?.matAnsweredQuestions[0]?.assessmentFactors[i];
          this.expandedOptions.set(domain?.title, false);
          this.principleTitleList.push(domain?.title);
        }

        this.loading = false;
      },
      error => console.log('Assessment Answered Questions Error: ' + (<Error>error).message)
    );
  }

  /**
   * checks if the quesiton needs to appear
   */
  requiredQuestion(q: any) {
    if (q.answerText == 'U' && q.maturityLevel == 'CORE+') {
      return false;
    }
    return true;
  }

  /**
   * Flips the 'expand' boolean value based off the given 'title' key
   */
  toggleExpansion(title: string) {
    let expand = this.expandedOptions.get(title);
    this.expandedOptions.set(title, !expand);
    return expand;
  }
  /**
   * checks if section should expand by checking the boolean value attached to the 'title'
   */
  shouldExpand(title: string) {
    if (this.expandedOptions.get(title)) {
      return true;
    }
    return false;
  }

  getClasses(q: any, top: boolean) {
    let combinedClass = '';
    if (q.title.length == 10 || q.title.charAt(q.title.length - 1) == '0') {
      combinedClass = 'background-3 ';
    }

    if (top) {
      if (q.freeResponseText == null) {
        combinedClass += 'full-border ';
      }
      else {
        combinedClass += 'top-half-border';
      }
    }
    else{
      combinedClass += 'bottom-half-border';
    }
    return combinedClass;
  }

  /**
   *
   */
  download(doc: any) {
    // get short-term JWT from API
    this.authSvc.getShortLivedToken().subscribe((response: any) => {
      const url = this.fileSvc.downloadUrl + doc.document_Id + "?token=" + response.token;
      window.location.href = url;
    });
  }

  /**
   *
   */
  downloadFile(document) {
    this.fileSvc.downloadFile(document.document_Id).subscribe((data: Response) => {
      // this.downloadFileData(data),
    },
      error => console.log(error)
    );
  }

  /**
   * Controls the mass expansion/collapse of all subcategories on the screen.
   * @param mode
   */
  expandAll(mode: boolean) {
    for(let i = 0; i < this.principleTitleList.length; i++ ) {
      this.expandedOptions.set(this.principleTitleList[i], mode);
    }
  }

  /**
   * Re-evaluates the visibility of all questions/subcategories/categories
   * based on the current filter settings.
   * Also re-draws the sidenav category tree, skipping categories
   * that are not currently visible.
   */
  refreshQuestionVisibility(matLevel: number) {
    this.filterSvc.evaluateFiltersForReportCategories(this.response?.matAnsweredQuestions[0], matLevel);
  }

  /**
   *
   */
  showFilterDialog(matLevel: number) {
    this.filterDialogRef = this.dialog.open(QuestionFiltersReportsComponent);
    this.filterDialogRef.componentInstance.filterChanged.asObservable().subscribe(() => {
      this.refreshQuestionVisibility(matLevel);
    });
    this.filterDialogRef
      .afterClosed()
      .subscribe(() => {
        this.refreshQuestionVisibility(matLevel);
      });
  }
}
