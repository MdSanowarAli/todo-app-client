import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TodoServiceService } from 'src/app/core/todo-service.service';
import { environment } from 'src/environments/environment';
import { TodoAddOrEditComponent } from './todo-add-or-edit/todo-add-or-edit/todo-add-or-edit.component';

// import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  id: number | undefined;
  selectedItem: any;

  @ViewChild('todoGridListTable', { static: true }) todoGridListTable: any;
  todoList: any;
  todoListObj: any;
  dataParam: any = {};

  // For Modal
  bsModalRef: BsModalRef;
  prescroptionBsModalRef: BsModalRef;

  constructor(
    private todoService: TodoServiceService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.todolistGrid();
  }

  todolistGrid() {
    let that = this;
    this.todoList = $(this.todoGridListTable.nativeElement);
    this.todoListObj = this.todoList.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: environment.baseUrl + environment.todoApiUrl + '/to-do/grid-list',
        type: 'GET',
        data: function (sendData: any) {
          // sendData.id   = that.dataParam.id;
        },
        dataSrc: function (response) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          console.log("response: ", response.obj.data);
          return response.obj.data;

        },
        error: function (request) {
          console.log('request.responseText', request.responseText);
        }
      },
      'order': [[0, 'desc']],
      columns: [
        {
          title: 'SL',
          data: 'id',
          render: function (data, type, row, meta) {
            return '<span>' + (meta.row + 1) + '</span>';
          }
        },
        {
          title: 'Todo No',
          data: 'id',
        },
        {
          title: 'Item Name',
          data: 'itemName',
          name: 'itemName',
        },
        {
          title: 'Description',
          data: 'description',
          name: 'description',
        },
        {
          title: ' Date',
          data: 'date',
          render: (data) => {
            return moment(data).format("DD/MM/YYYY")
          }
        },
        {
          title: 'Action',
          className: 'text-center',
          render: function (data, type, row) {
            return '<button class="btn-danger deleteTodo"><i class="fas fa-trash-alt"></i> Delete</button>';
          }
        }
      ],
      responsive: true,
      select: true,
      rowCallback: (row: Node, data: any[] | Object) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.selectedItem = data;
          console.log("Selected Patient ", self.selectedItem);
        });
        $(row).find('.deleteTodo').click(function () {
          that.onDeleteToDo(data);
        });
        $(row).on('dblclick', () => {
          this.editTodo();
        });
        return row;
      }
    });
  }

  addTodo(): void {
    const initialState = {
      title: 'Add Todo'
    }
    this.bsModalRef = this.modalService.show(TodoAddOrEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe(result => {
      if (result == true) {
        this.todoListObj.draw();
      }
    });
  }

  editTodo(): void {
    if (this.selectedItem) {
      this.selectedItem.date = this.selectedItem.date ? moment(new Date(this.selectedItem.date)).format('DD-MM-YYYY') : null;
      const initialState = {
        todoObj: this.selectedItem,
        title: 'Update Todo'
      }
      this.bsModalRef = this.modalService.show(TodoAddOrEditComponent, { class: 'modal-md', initialState, backdrop: 'static' });
      this.bsModalRef.content.onClose.subscribe(result => {
        if (result == true) {
          this.todoListObj.draw();
          this.selectedItem = null;
        }
      });
    } else {
      this.toastr.warning('', "Please select an Item")
    }
  }

  onDeleteToDo(selectedItem) {
    console.log('Selected Patient for Delete', selectedItem);
    if (selectedItem) {
      this.todoService.onDelete(selectedItem.id).subscribe(
        () => {
          this.toastr.success('', "Deleted Successfull")
          this.selectedItem = null;
          this.todoListObj.draw();
        },
        () => {
          this.toastr.warning('', "Not Delete, Please Check")
        }
      )
    }
  }

}
