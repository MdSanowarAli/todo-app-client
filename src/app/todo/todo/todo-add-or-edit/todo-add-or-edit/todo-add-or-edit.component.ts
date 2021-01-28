import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { TodoModel } from 'src/app/core/todo-model.model';
import { TodoServiceService } from 'src/app/core/todo-service.service';

@Component({
  selector: 'app-todo-add-or-edit',
  templateUrl: './todo-add-or-edit.component.html',
  styleUrls: ['./todo-add-or-edit.component.css']
})
export class TodoAddOrEditComponent implements OnInit {
  onClose: Subject<boolean>;
  todoObj: TodoModel = new TodoModel();

  title: any = '';

  constructor(
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private todoService: TodoServiceService,
  ) { }

  ngOnInit() {
    console.log('Selected Obj: ', this.todoObj);
    this.onClose = new Subject();
  }

  saveOrUpdate(): void {
    if (this.todoObj.id != null || this.todoObj.id != undefined) {
      this.update();
    } else {
      this.save();
    }
  }

  save(): void {
    this.todoObj.date = moment(new Date(this.todoObj.date)).toDate();
    this.todoService.onSaveItem(this.todoObj).subscribe(
      res => {
        if (res.success) {
          this.toastr.success('', res.message);
          this.bsModalRef.hide();
          this.onClose.next(true);
        } else {
          this.toastr.warning('', res.message);
          this.onClose.next(true);
        }
      }, err => {
        console.error('Error occured when save ', err);
        this.toastr.error('', err.message);
      }
    );
  }

  update(): void {
    this.todoObj.date = moment(new Date(this.todoObj.date)).toDate();
    this.todoService.onUpdateItem(this.todoObj).subscribe(
      res => {
        if (res.success) {
          this.toastr.success('', res.message);
          this.bsModalRef.hide();
          this.onClose.next(true);
        } else {
          this.toastr.warning('', res.message);
          this.onClose.next(false);
        }
      }, err => {
        console.error('Error occured when Update', err);
        this.toastr.error('', err.message);
      }
    );
  }
}
