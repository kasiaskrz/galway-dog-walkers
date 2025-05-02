import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOfferPage } from './create-offer.page';

describe('CreateOfferPage', () => {
  let component: CreateOfferPage;
  let fixture: ComponentFixture<CreateOfferPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
