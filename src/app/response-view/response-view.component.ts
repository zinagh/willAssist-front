import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionDto } from '../models/QuestionDto';
import { ReponseDto } from '../models/ReponseDto';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqServiceService } from '../services/faq-service.service';

@Component({
  selector: 'app-response-view',
  templateUrl: './response-view.component.html',
  styleUrls: ['./response-view.component.css']
})
export class ResponseViewComponent implements OnInit {
  response: any;

  constructor(
    private route: ActivatedRoute,
        private router: Router,
    private responseService: FaqServiceService
  ) {}
  navigateToUpdate(){

    this.router.navigate(['/updateUser' ]);

}
  ngOnInit(): void {
    const questionId = this.route.snapshot.paramMap.get('id');
    if (questionId) {
      this.responseService.getResponseByQuestionId(+questionId).subscribe(
        (data) => {
          this.response = data;
        },
        (error) => {
          console.error('Error fetching response:', error);
        }
      );
    }
  }

  navigateToFaq() {
    this.router.navigate(['/Faq']);
  }
}
