import { Component } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpProgressEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, concat } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  template: `
        <div class="wrapper">
        <div><label> Survey Progress </label></div>
        <kendo-chunkprogressbar
            [chunkCount]="chunks"
            [min]="min"
            [max]="max"
            [indeterminate]="indeterminate"
            [value]="value"></kendo-chunkprogressbar>
        <div *ngFor="let item of items;" class="survey-section">
          <div class="section-header"><label>{{item.title}}</label></div>
          <div><kendo-upload [saveUrl]="uploadSaveUrl" [removeUrl]="uploadRemoveUrl"></kendo-upload></div>
          <div style="overflow: auto; height: 100%;">
            <div class="section-question" *ngFor="let question of item.questions;index as i "> 
            <div class="question-row" style="{{i % 2 ==0 ? '': 'background-color: #f5f5f5;'}}">
            <div class="question-col"><label style="font-weight:bold;">Question {{question.questionNumber}}</label></div>
            <div class="question-col question-text"><label>{{question.text}}</label></div>
            <div class="question-col">
              <div class="question-answer">
                <label class="k-radio-label">
                <input type="radio" kendoRadioButton name="{{question.questionNumber}}" #optFilterByPosition id="optFilterByPosition" />
                  Yes
                </label>
                <label class="k-radio-label">
                  <input type="radio" kendoRadioButton name="{{question.questionNumber}}" #optFilterByPosition id="optFilterByPosition" />
                  No
                </label>
                <label class="k-radio-label">
                  <input type="radio" kendoRadioButton name="{{question.questionNumber}}" #optFilterByPosition id="optFilterByPosition" />
                  N/A
                </label>
                </div>
            </div>
          </div>
          <div class="question-row" style=" background-color: {{i % 2 ==0 ? '#e5eef9;': '#cbd7e5;'}}">
          <div class="question-col" style="width:100%">
          <div class="question-row" style="margin:5px">
            <label>Upload Photos:</label>
          </div>
          <div class="question-row">
          <kendo-upload style="width:100%" [saveUrl]="uploadSaveUrl" [removeUrl]="uploadRemoveUrl"></kendo-upload>
          </div>
          </div>
        </div>
        </div>
        </div>
        <div class="survey-buttons">
        <button kendoButton><kendo-icon name="chevron-left"></kendo-icon> previous section</button>
        <button kendoButton>next section<kendo-icon name="chevron-right"></kendo-icon></button>
        </div>
        </div>
 `,
  styles: [
    `
      .wrapper {
        padding-bottom: 20px;
        overflow: hidden;
        height:100%;
        display:flex; flex-direction:column; flex:1;
      }
      .survey-section{
        margin-top: 8px;
        overflow: hidden;
        flex: 1;
        display: flex;
        flex-direction: column;
            }
      .section-header {
        padding: 8px 8px 0 8px;
        border: 0 1px 1px 1px solid #b8bcbf;
        border-top-right-radius: 5.25px;
        border-top-left-radius: 5.25px;
        background-color: #cbd7e5;
      }
      .section-question { 
        border: 1px solid #b8bcbf;
        display:flex; 
        flex-direction: row;
        flex-wrap: wrap;
      }
      .question-col {
        display:flex; flex-direction: column;
        padding: 12px;
        flex-wrap: wrap;
      }
      .question-row { 
         display:flex;
         flex-direction:row;
         flex: 1;
         flex-wrap: wrap;
      }
      .question-text {
        flex-basis: 400px;
      }
      .question-answer { display: flex; flex-direction: row; justify-content: space-between; flex:1; width: 200px; }
      .question-answer label { margin: 5px; }
      .survey-buttons { padding: 8px 8px 8px 8px;
        border: 0 1px 1px 1px solid #b8bcbf;
        border-bottom-right-radius: 5.25px;
        border-bottom-left-radius: 5.25px;
        background-color: #cac9c9;
        display:flex;
        flex-direction:row;
        justify-content: space-between;
        flex: 1;
      }
    `,
  ],
})
export class AppComponent {
  public value = 0;
  public indeterminate = false;
  public min = -10;
  public max = 10;
  public chunks = 10;
  uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
  public items = [
    {
      title: 'Parking',
      description:
        'Only complete this section if off-street parking is provided to voters. If off-street parking is not provided to voters, go to Section B. If more than 25 parking spaces are provided  to voters, see the 2010 Standards for the number of accessible parking spaces required. (§208.2)',
      commentTemplate: '',
      displayOrder: 1,
      isMultipleApply: false,
      isExpanded: true,
      questions: [
        {
          questionNumber: 1,
          text: 'Is off-street parking provided to voters?',
          commentTemplate: ' ',
        },
        {
          questionNumber: 2,
          text: 'Is there at least one designated van accessible space with signage with the International Symbol of Accessibility and designated /“van accessible/”? (§§208.2, 208.2.4, 502.6)',
          commentTemplate: ' ',
        },
        {
          questionNumber: 3,
          text: 'Are the designated van accessible spaces at least 96” wide with a 96” wide access aisle, or 132” wide with a 60” wide access aisle? (§§502.2, 502.3)',
          commentTemplate: 'Width of space: \nWidth of access aisle:',
        },
        {
          questionNumber: 4,
          text: 'For van accessible spaces (particularly in a garage or parking structure), is there vertical clearance of at least 98” for the vehicular route to the parking space, in the parking space and access aisle, and along the vehicular route to the exit? (§502.5)',
          commentTemplate: ' ',
        },
      ],
    },
  ];
}

export class UploadInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.url === 'saveUrl') {
      const events: Observable<HttpEvent<unknown>>[] = [0, 30, 60, 100].map(
        (x) =>
          of(<HttpProgressEvent>{
            type: HttpEventType.UploadProgress,
            loaded: x,
            total: 100,
          }).pipe(delay(1000))
      );

      const success = of(new HttpResponse({ status: 200 })).pipe(delay(1000));
      events.push(success);

      return concat(...events);
    }

    if (req.url === 'removeUrl') {
      return of(new HttpResponse({ status: 200 }));
    }

    return next.handle(req);
  }
}
