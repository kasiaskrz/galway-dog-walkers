import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWalkerAvailabilityPage } from './create-walker-availability.page';

describe('CreateWalkerAvailabilityPage', () => {
  let component: CreateWalkerAvailabilityPage;
  let fixture: ComponentFixture<CreateWalkerAvailabilityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWalkerAvailabilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
