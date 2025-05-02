import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextCardComponent } from './text-card.component';
import { By } from '@angular/platform-browser';

describe('TextCardComponent', () => {
  let fixture: ComponentFixture<TextCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextCardComponent);
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('description', 'Test Description');
    fixture.componentRef.setInput('icon', 'test-icon.png');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display title', () => {
    const title = fixture.debugElement.query(By.css('h3'));
    expect(title.nativeElement.textContent.trim()).toBe('Test Title');
  });

  it('should display description', () => {
    const description = fixture.debugElement.query(By.css('p.text-gray-600'));
    expect(description.nativeElement.textContent.trim()).toBe(
      'Test Description'
    );
  });

  it('should display icon with correct attributes', () => {
    const icon = fixture.debugElement.query(By.css('img'));
    expect(icon.attributes['src']).toBe('test-icon.png');
    expect(icon.attributes['alt']).toBe('Test Title');
  });

  it('should have correct container classes', () => {
    const container = fixture.debugElement.query(By.css('div.bg-white'));
    expect(container.nativeElement.classList).toContain('rounded-lg');
    expect(container.nativeElement.classList).toContain('shadow-md');
    expect(container.nativeElement.classList).toContain('hover:shadow-lg');
  });

  it('should have correct icon container classes', () => {
    const iconContainer = fixture.debugElement.query(By.css('div.w-20'));
    expect(iconContainer.nativeElement.classList).toContain('bg-[#d5f5f6]');
    expect(iconContainer.nativeElement.classList).toContain('rounded-full');
  });
});
