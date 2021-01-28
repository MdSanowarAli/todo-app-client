import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoAddOrEditComponent } from './todo-add-or-edit.component';

describe('TodoAddOrEditComponent', () => {
  let component: TodoAddOrEditComponent;
  let fixture: ComponentFixture<TodoAddOrEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoAddOrEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoAddOrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
