import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTasksComponent } from './view-tasks.component';
import { TodoService } from '../service/task.service';
import { of } from 'rxjs';

describe('ViewTasksComponent', () => {
  let component: ViewTasksComponent;
  let fixture: ComponentFixture<ViewTasksComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', {
      getTasks: of([
        { id: 1, value: 'Test Task 1', completed: false },
        { id: 2, value: 'Test Task 2', completed: true },
      ]),
      updateList: undefined,
      delete: undefined
    });

    await TestBed.configureTestingModule({
      declarations: [ViewTasksComponent],
      providers: [{ provide: TodoService, useValue: todoServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTasksComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    todoService.getTasks.and.returnValue(of([
      { id: 1, value: 'Test Task 1', completed: false },
      { id: 2, value: 'Test Task 2', completed: true },
    ]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tasks on init', () => {
    expect(todoService.getTasks).toHaveBeenCalled();
    component.todos.subscribe(todos => {
      expect(todos.length).toBe(2);
    });
  });

  it('should update task completion status', () => {
    component.completeTask({ target: { checked: true } }, 0);
    expect(todoService.updateList).toHaveBeenCalledWith(0, true);
  });

  it('should delete a task', () => {
    component.deleteTask(1);
    expect(todoService.delete).toHaveBeenCalledWith(1);
  });
});