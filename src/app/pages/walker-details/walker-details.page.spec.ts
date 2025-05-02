import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalkerDetailsPage } from './walker-details.page';

describe('WalkerDetailsPage', () => {
  let component: WalkerDetailsPage;
  let fixture: ComponentFixture<WalkerDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkerDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
