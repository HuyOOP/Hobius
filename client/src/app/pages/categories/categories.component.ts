import {
  AfterViewInit,
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import { CardComponent } from '../../components/card/card.component';
import { EbookModel } from '../../../models/ebook.model';
import { CardService } from '../../../services/card.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MaterialModule, SharedModule, CardComponent, NgForOf],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements AfterViewInit {
  @ViewChildren('viewport') viewports!: QueryList<ElementRef>;
  theLoai: string[] = [];
  thinhHanhCards: EbookModel[] = [];

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.theLoai = [
      'History',
      'Humor',
      'Mystery',
      'Non-fiction',
      'Philosophy',
      'Poetry',
      'Romance',
      'Religion',
      'Science fiction',
      'Short stories',
      'Teen',
      'Literature',
    ]; // Example categories
    this.thinhHanhCards = this.cardService.cards;
  }

  ngAfterViewInit() {
    this.viewports.forEach((viewport) => {
      const slider = viewport.nativeElement as HTMLElement;
      let isDown = false;
      let startX: number;
      let scrollLeft: number;
      let velocity = 0;
      let lastMoveTime: number;
      let lastMoveX: number;

      slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        lastMoveTime = Date.now();
        lastMoveX = e.pageX;
      });

      slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
      });

      slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
        applyInertia();
      });

      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.1; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;

        const now = Date.now();
        const deltaTime = now - lastMoveTime;
        const deltaX = e.pageX - lastMoveX;
        velocity = deltaX / deltaTime;

        lastMoveTime = now;
        lastMoveX = e.pageX;
      });

      function applyInertia() {
        const friction = 0.95;
        const step = () => {
          if (Math.abs(velocity) < 0.1) return;
          slider.scrollLeft -= velocity * 5;
          velocity *= friction;
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }

      // Add click event listener to toggle selected class
      const theLoaiElements = slider.querySelectorAll('.theLoai');
      theLoaiElements.forEach((element) => {
        element.addEventListener('click', () => {
          element.classList.toggle('selected');
        });
      });
    });
  }
}
