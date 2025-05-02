import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the brand name', () => {
    const brandElement = fixture.debugElement.query(By.css('h2:first-child'));
    expect(brandElement.nativeElement.textContent).toContain('FreshStore');
  });

  it('should have three main sections', () => {
    const sections = fixture.debugElement.queryAll(By.css('div > div'));
    expect(sections.length).toBe(3);
  });

  describe('Contact Section', () => {
    it('should display contact information', () => {
      const contactSection = fixture.debugElement.queryAll(
        By.css('div > div')
      )[1];

      const contactTitle = contactSection.query(By.css('h2'));
      expect(contactTitle.nativeElement.textContent).toContain('Contacto');

      const contactItems = contactSection.queryAll(By.css('p'));
      expect(contactItems.length).toBe(3);

      expect(contactItems[0].nativeElement.textContent).toContain(
        '123 Fashion Street'
      );
      expect(contactItems[1].nativeElement.textContent).toContain(
        '+1 (234) 567-8900'
      );
      expect(contactItems[2].nativeElement.textContent).toContain(
        'info@freshstore.com'
      );
    });

    it('should have interactive contact items', () => {
      const contactItems = fixture.debugElement.queryAll(
        By.css('div > div:nth-child(2) p')
      );
      contactItems.forEach((item) => {
        expect(item.nativeElement.classList).toContain('hover:text-[#38b2ac]');
        expect(item.nativeElement.classList).toContain('cursor-pointer');
      });
    });
  });

  describe('Business Hours Section', () => {
    it('should display business hours', () => {
      const hoursSection = fixture.debugElement.queryAll(
        By.css('div > div')
      )[2];
      const titleElement = hoursSection.query(By.css('h2'));

      expect(titleElement.nativeElement.textContent).toContain(
        'Horario de atención'
      );

      const hoursItems = hoursSection.queryAll(By.css('p'));
      expect(hoursItems.length).toBe(2);

      expect(hoursItems[0].nativeElement.textContent).toContain(
        'Lunes - Viernes: 9:00 AM - 8:00 PM'
      );
      expect(hoursItems[1].nativeElement.textContent).toContain(
        'Sábado - Domingo: 10:00 AM - 6:00 PM'
      );
    });
  });

  it('should have proper styling classes', () => {
    const footer = fixture.debugElement.query(By.css('footer'));
    expect(footer.nativeElement.classList).toContain('bg-[#1a202c]');
    expect(footer.nativeElement.classList).toContain('py-20');
    expect(footer.nativeElement.classList).toContain('px-5');
  });

  it('should display contact icons', () => {
    const icons = fixture.debugElement.queryAll(By.css('img'));
    expect(icons.length).toBe(3);
    expect(icons[0].attributes['alt']).toBe('Icono ubicación');
    expect(icons[1].attributes['alt']).toBe('Icono Telefono');
    expect(icons[2].attributes['alt']).toBe('Icono email');
  });
});
