import { Component } from '@angular/core';
import { QuestionDto } from '../models/QuestionDto';
import { FaqServiceService } from '../services/faq-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-question',
  templateUrl: './update-question.component.html',
  styleUrls: ['./update-question.component.css']
})
export class UpdateQuestionComponent {
  questionId!: number;
  updatedQuestion: QuestionDto = {
    questionText: '',
    createdby: ''
  };

  constructor(
    private faqService: FaqServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.questionId = +idParam;
        this.loadQuestion();
      }
    });
  }

  loadQuestion() {
    this.faqService.getQuestion(this.questionId).subscribe(
      (question) => {
        this.updatedQuestion = question;
      },
      (error) => {
        console.error('Error loading question', error);
      }
    );
  }
  navigateToFaq() {
    this.router.navigate(['/Faq']);
  }
  updateQuestion() {
    this.faqService.updateQuestion(this.questionId, this.updatedQuestion).subscribe(
      (response) => {
        console.log('Question updated successfully', response);
        this.router.navigate(['/Faq']); // Navigate somewhere after update
      },
      (error) => {
        console.error('Error updating question', error);
      }
    );
  }
}
