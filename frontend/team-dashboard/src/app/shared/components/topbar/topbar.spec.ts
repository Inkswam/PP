import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopbarComponent } from './topbar.component';
import {TeamsStoreService} from 'src/app/core/services/TeamsStoreService';
import {TeamService} from 'src/app/core/services/teamService';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [
        { provide: TeamService, useValue: {} },
        { provide: TeamsStoreService, useValue: { add: jasmine.createSpy() } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
