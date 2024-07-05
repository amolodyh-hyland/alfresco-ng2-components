/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @angular-eslint/component-selector */

import { NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimepickerInputEvent, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { TranslateModule } from '@ngx-translate/core';
import { isValid } from 'date-fns';
import { ADF_DATE_FORMATS, ADF_DATETIME_FORMATS, AdfDateFnsAdapter, AdfDateTimeFnsAdapter, DateFnsUtils } from '../../../../common';
import { FormService } from '../../../services/form.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { WidgetComponent } from '../widget.component';

@Component({
    selector: 'date-time-widget',
    standalone: true,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: MAT_DATETIME_FORMATS, useValue: ADF_DATETIME_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: DatetimeAdapter, useClass: AdfDateTimeFnsAdapter }
    ],
    templateUrl: './date-time.widget.html',
    styleUrls: ['./date-time.widget.scss'],
    imports: [
        NgIf,
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatetimepickerModule,
        FormsModule,
        MatTooltipModule,
        ErrorWidgetComponent
    ],
    encapsulation: ViewEncapsulation.None
})
export class DateTimeWidgetComponent extends WidgetComponent implements OnInit {
    minDate: Date;
    maxDate: Date;

    @Input()
    value: any = null;

    constructor(public formService: FormService, private dateAdapter: DateAdapter<Date>, private dateTimeAdapter: DatetimeAdapter<Date>) {
        super(formService);
    }

    ngOnInit() {
        if (this.field.dateDisplayFormat) {
            const dateAdapter = this.dateAdapter as AdfDateFnsAdapter;
            dateAdapter.displayFormat = this.field.dateDisplayFormat;

            const dateTimeAdapter = this.dateTimeAdapter as AdfDateTimeFnsAdapter;
            dateTimeAdapter.displayFormat = this.field.dateDisplayFormat;
        }

        if (this.field) {
            if (this.field.minValue) {
                this.minDate = DateFnsUtils.getDate(this.field.minValue);
            }

            if (this.field.maxValue) {
                this.maxDate = DateFnsUtils.getDate(this.field.maxValue);
            }

            if (this.field.value) {
                this.value = DateFnsUtils.getDate(this.field.value);
            }
        }
    }

    onValueChanged(event: Event) {
        const input = event.target as HTMLInputElement;
        const newValue = this.dateTimeAdapter.parse(input.value, this.field.dateDisplayFormat);

        if (isValid(newValue)) {
            this.field.value = newValue.toISOString();
        } else {
            this.field.value = input.value;
        }

        this.value = DateFnsUtils.getDate(this.field.value);
        this.onFieldChanged(this.field);
    }

    onDateChanged(event: MatDatetimepickerInputEvent<Date>) {
        const newValue = event.value;
        const input = event.targetElement as HTMLInputElement;

        if (newValue && isValid(newValue)) {
            this.field.value = newValue.toISOString();
        } else {
            this.field.value = input.value;
        }

        this.onFieldChanged(this.field);
    }
}
