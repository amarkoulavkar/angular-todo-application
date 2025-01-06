import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddTaskComponent } from './add-task.component';
import { TodoService } from '../service/task.service';
import { of } from 'rxjs';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', ['create']);

    await TestBed.configureTestingModule({
      declarations: [AddTaskComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: TodoService, useValue: todoServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.todoForm).toBeDefined();
    expect(component.todoForm.controls['todo']).toBeDefined();
  });

  it('should disable the Add button if the form is invalid', () => {
    component.todoForm.controls['todo'].setValue('');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTruthy();
  });

  it('should enable the Add button if the form is valid', () => {
    component.todoForm.controls['todo'].setValue('Test Todo');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeFalsy();
  });

  it('should call the create method of TodoService when addTasks is called', () => {
    component.todoForm.controls['todo'].setValue('Test Todo');
    component.addTasks();
    expect(todoService.create).toHaveBeenCalledWith({
      value: 'Test Todo',
      completed: false,
    });
  });

  it('should reset the form after adding a task', () => {
    component.todoForm.controls['todo'].setValue('Test Todo');
    component.addTasks();
    expect(component.todoForm.controls['todo'].value).toBe('');
  });
});