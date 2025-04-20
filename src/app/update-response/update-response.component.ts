import { ActivatedRoute, Router } from '@angular/router';
import { FaqServiceService } from '../services/faq-service.service';
import { ReponseDto } from './../models/ReponseDto';
import { Component } from '@angular/core';

@Component({
  selector: 'app-update-response',
  templateUrl: './update-response.component.html',
  styleUrls: ['./update-response.component.css']
})
export class UpdateResponseComponent {
 responseId!: number;
  updatedResponse: ReponseDto = {
    responseText: '',
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
        this.responseId = +idParam;
        this.loadResponse();
      }
    });
  }

  loadResponse() {
    this.faqService.getResponseByQuestionId(this.responseId).subscribe(
      (reponse) => {
        this.updatedResponse = reponse;
      },
      (error) => {
        console.error('Error loading response', error);
      }
    );
  }
  navigateToFaq() {
    this.router.navigate(['/Faq']);
  }
  updateResponde() {
    this.faqService.updateResponde(this.responseId, this.updatedResponse).subscribe(
      (response) => {
        console.log('Response updated successfully', response);
        this.router.navigate(['/Faq']);
      },
      (error) => {
        console.error('Error updating response', error);
      }
    );
  }
}
