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
        // {
        //   title: 'Todo No',
        //   data: 'id',
        // },
        {
          title: 'Task Name',
          data: 'itemName',
          name: 'itemName',
        },
        {
          title: ' Start Date',
          data: 'startDate',
          render: (data) => {
            return moment(data).format("DD/MM/YYYY")
          }
        },
        {
          title: ' End Date',
          data: 'endDate',
          render: (data) => {
            return moment(data).format("DD/MM/YYYY")
          }
        },
        {
          title: 'Status',
          data: 'description',
          name: 'description',
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
      title: 'Add New Task Form'
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
      this.selectedItem.startDate = this.selectedItem.startDate ? moment(new Date(this.selectedItem.startDate)).format('DD-MM-YYYY') : null;
      this.selectedItem.endDate = this.selectedItem.endDate ? moment(new Date(this.selectedItem.endDate)).format('DD-MM-YYYY') : null;
      const initialState = {
        todoObj: this.selectedItem,
        title: 'Edit Task Form'
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
