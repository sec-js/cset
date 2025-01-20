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

/**
 * Defines the configuration for a maturity module.
 */
export class ModuleBehavior {
     moduleName: string;
     modelId: number;

     /**
      * The key to use with Transloco for the display name of the module.
      */
     displayNameKey?: string;

     /**
      * If defined for a model, this can hide the Domain headers.  
      * 
      * This is useful if the model has a single Domain and you don't need 
      * that large header to show.
      */
     showDomainHeaders?: boolean;

     /**
      * Indicates if the Critical Service fields should show on the Demographics page.
      */
     showCriticalServiceDemog?: boolean;

     /**
      * Indicates if the "Level 1" badge/pill should show below the question title.
      */
     showMaturityLevelBadge?: boolean;

     /**
      * 
      */
     independentSuppGuidance?: boolean;

     /**
      * If true, the supplemental/guidance will be loaded automatically when the 
      * question comes into view.
      */
     autoLoadSupplemental?: boolean;


     questionIcons?: QuestionIconsConfig;


     answerOptions?: AnswerOptionConfig[];
}


export class AnswerOptionConfig {
     /**
      * Just a place for a comment.  No functionality.
      */
     note?: string;

     /**
      * The internal code of the option:  Y, N, NA, etc.
      */
     code: string;

     /**
      * The key to use with Transloco for the button label, button tooltip and answer
      * 
      * The lookup is:  
      *    answer-options.button-labels.<key>
      *    answer-options.button-tooltips.<key>
      *    answer-options.labels.<key>
      */
     buttonLabelKey: string;

     /**
      * Defines the CSS class to apply to the answer button.
      */
     buttonCss: string;

     /**
      * Defines the HTML color code for bar chart segments.
      */
     chartSegmentColor: string;

     /**
      * Allows an answer option to be defined for one particular skin/installation mode.
     */
     skin?: string;

     /**
      * Indicates if this answer is considered "implemented".
      * This is a future feature.
      */
     consideredImplemented: boolean;
}


/**
 * Defines preferences for the behavior of the "question extras" icons on each question.
 */
export class QuestionIconsConfig {
     /**
      * Indicates if the "Details" book icon should be displayed in the question icons.
      */
     showDetails: boolean;

     /**
      * Indicates if the "Supplemental Guidance" icon should be displayed in the question icons.
      */
     showGuidance?: boolean;

     /**
      * Indicates which icon should be used for supplemental/guidance.
      *    Default is the "i" icon
      *    Can be overriden with the "G" icon by setting this to "G".
      */
     guidanceIcon?: string;

     /**
      * Indicates if the "References" 'three books' icon should be displayed in the question icons.
      */
     showReferences?: boolean;

     /**
      * Indicates if the "Observations" light bulb icon should be displayed in the question icons.
      */
     showObservations?: boolean;

     /**
     * Indicates if the "Reviewed" button should be displayed in the question icons.
     */
     showReviewed: boolean;
}