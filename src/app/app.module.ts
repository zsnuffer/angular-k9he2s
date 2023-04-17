import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgressBarModule } from "@progress/kendo-angular-progressbar";
import { AppComponent, UploadInterceptor } from './app.component';
import { IconsModule } from "@progress/kendo-angular-icons";
@NgModule({
    bootstrap:    [AppComponent],
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ProgressBarModule,
        FormsModule,
        ButtonsModule,
        InputsModule,
        UploadsModule,
        CommonModule,
        HttpClientModule,
        IconsModule
      ],
  providers: [
      {
          provide: HTTP_INTERCEPTORS,
          useClass: UploadInterceptor,
          multi: true
      }
  ]
})
export class AppModule {}
