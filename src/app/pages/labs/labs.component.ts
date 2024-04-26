import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.scss'
})
export class LabsComponent {

  title = 'TodoApp Angular DotXen';

  taskList = signal([
    'Formatear PC',
    'Quitar Bloatware',
    'Instalar Sowtware basico',
  ])

  urlImg = "https://w3schools.com/howto/img_avatar.png";


  colorCtrl=new FormControl();

  constructor(){
    this.colorCtrl.valueChanges.subscribe(value=>{
      console.log(value)
    })
  }

  eventoBoton(){

  }

}
