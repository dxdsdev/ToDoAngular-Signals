import { Component, Injector, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Task, Filter } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  typeFilter = Filter;

  injector = inject(Injector);

  filter = signal<Filter>(Filter.all);

  newTaskCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  taskList = signal<Task[]>([ ]);

  taskByFilter = computed(() => {
    const filter = this.filter();
    const task = this.taskList();
    switch (filter) {
      case Filter.pending:
        return task.filter(task => !task.completed);
      case Filter.completed:
        return task.filter(task => task.completed);
      default:
        return task
    }
  });

  constructor() {

  }

  ngOnInit() {
    const storage = localStorage.getItem('task');
    if (storage) {
      const task = JSON.parse(storage);
      this.taskList.set(task);
    }
    this.trackTask();
  }

  //Detecta Cambios en las tareas
  trackTask() {
    effect(() => {
      const task = this.taskList();
      localStorage.setItem('task', JSON.stringify(task))
    }, { injector: this.injector });
  }

  //Detecta cambios en el input para añadir una nueva tarea
  changeHandler() {
    if (this.newTaskCtrl.invalid || this.newTaskCtrl.value.trim() == '') {
      return;
    }
    this.addTask(this.newTaskCtrl.value.trim())
    this.newTaskCtrl.setValue('');
  }

  //Añade una nueva tarea
  addTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false
    }
    this.taskList.update((task) => [...task, newTask]);
  }

  //Elimin Tareas
  deleteTask(index: number) {
    this.taskList.update(task => task.filter((task, position) => position !== index))
  }

  //Actualizar Tarea 
  updateTaskEditing(index: number) {
    this.taskList.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return { ...task, editing: true }
        }
        return {
          ...task,
          editing: false
        };
      })
    })
  }

  //Cambia el esado de completed true o false
  updateTask(index: number) {
    this.taskList.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return { ...task, completed: !task.completed }
        }
        return task
      })
    })
  }

  //Actualiza el contenido de la tarea
  updateTaskTitle(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.taskList.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return { ...task, title: input.value, editing: false }
        }
        return task
      })
    })
  }

  changeFilter(filter: Filter) {
    this.filter.set(filter);
  }

  
  //Elimina las tareas Completas.
  deleteCompletedTask() {
    this.taskList.update((tasks) => {
      return tasks.filter((task) => !task.completed);
    })
  }  

}
