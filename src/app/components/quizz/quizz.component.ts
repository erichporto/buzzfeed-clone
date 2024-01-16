import { Component, OnInit } from '@angular/core';
import QuizzQuestions from '../../../assets/data/quizz_questions.json'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.css'
})

export class QuizzComponent implements OnInit{

  protected title:string = '';
  protected questions:any;
  protected selectedQuestion:any;
  protected answers:string[] = [];
  protected selectedAnswer:string = '';
  protected questionIndex:number;
  protected questionMaxIndex:number;
  protected quizzFinished:boolean;

  constructor() {
    this.questionMaxIndex = 0;
    this.questionIndex = 0;
    this.quizzFinished = false;
  }

  ngOnInit(): void {

    if(QuizzQuestions){
      this.title = QuizzQuestions.title;
      this.questionMaxIndex = QuizzQuestions.questions.length;
      this.questions = QuizzQuestions.questions;
      this.selectedQuestion = this.questions[this.questionIndex];
    }

  }

  protected playerChoice(alias:string) {
    this.answers.push(alias);
    this.nextStep()
  }

  protected async nextStep(){
    this.questionIndex += 1;

    if(this.questionIndex < this.questionMaxIndex ){
      this.selectedQuestion = this.questions[this.questionIndex];
    } 
    else {
      this.quizzFinished = true;
      const selectedAnswerKey:string = await this.checkResult(this.answers)
      this.selectedAnswer = QuizzQuestions.results[selectedAnswerKey as keyof typeof QuizzQuestions.results];
    }
  }

  protected async checkResult(answers:string[]){
    const result = answers.reduce(
      (previous, current, _, arr) => {

        const totalPrevious = arr.filter(item => item === previous).length
        const totalCurrent = arr.filter(item => item === current).length

        return (totalPrevious > totalCurrent) ? previous : current;
      }
    );

    return result;
  }
}
