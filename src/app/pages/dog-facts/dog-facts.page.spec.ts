import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogFactsPage } from './dog-facts.page';

describe('DogFactsPage', () => {
  let component: DogFactsPage;
  let fixture: ComponentFixture<DogFactsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DogFactsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
