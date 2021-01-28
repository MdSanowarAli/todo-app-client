import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TodoComponent } from './todo/todo/todo.component';
import { TodoAddOrEditComponent } from './todo/todo/todo-add-or-edit/todo-add-or-edit/todo-add-or-edit.component';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Common and Others
import { CommonModule } from '@angular/common';

// datatables
import { DataTablesModule } from 'angular-datatables';

//HTTP
import { HttpClientModule } from '@angular/common/http';

// Toastr and animation
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modal
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';

// Date Picker
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';

//tooltip
import { TooltipModule } from 'ngx-bootstrap/tooltip';

//CkEditor for Report
// import { CKEditorModule } from 'ng2-ckeditor';


@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodoAddOrEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DataTablesModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    // CKEditorModule,
  ],
  providers: [
    BsModalRef
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TodoAddOrEditComponent
  ],
})
export class AppModule { }
