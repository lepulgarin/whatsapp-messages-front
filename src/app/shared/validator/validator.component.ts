import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss'],
})
export class ValidatorComponent implements OnInit {
  @Input() public control!: FormControl;

  public name = '';

  constructor(private readonly translateService: TranslateService) {}

  ngOnInit(): void {
    const fieldName: string = this.getControlName();
    this.name = this.translateService.instant(`fields.${fieldName}`);
    this.translateService.onLangChange.subscribe({
      next: () => {
        this.name = this.translateService.instant(`fields.${fieldName}`);
      },
    })
  }

  public getControlName(): string {
    let controlName = '';
    const parent = this.control['parent'];

    if (parent instanceof FormGroup) {
      for (const name in parent.controls) {
        if (this.control === parent.controls[name]) {
          controlName = name;
        }
      }
    }

    return controlName;
  }

  public message(errors: ValidationErrors | null): string {
    if (errors) {
      const properties = Object.keys(errors);
      return `validators.${properties[0]}`;
    }
    return '';
  }
}
