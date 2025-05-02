import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-selector-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Select Profile Image</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="image-grid">
        <img *ngFor="let img of images"
             [src]="img"
             (click)="select(img)"
             class="avatar-option"/>
      </div>
    </ion-content>
  `,
  styles: [`
    .image-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }
    .avatar-option {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .avatar-option:hover {
      transform: scale(1.1);
    }
  `]
})
export class ImageSelectorModal {
  @Input() images: string[] = [];

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }

  select(image: string) {
    this.modalCtrl.dismiss(image);
  }
}
