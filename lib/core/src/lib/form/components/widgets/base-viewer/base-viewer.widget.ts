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

import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ViewerComponent } from '../../../../viewer';
import { FormService } from '../../../services/form.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { WidgetComponent } from '../widget.component';

/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'base-viewer-widget',
    standalone: true,
    templateUrl: './base-viewer.widget.html',
    styleUrls: ['./base-viewer.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    imports: [NgIf, TranslateModule, ViewerComponent, ErrorWidgetComponent],
    encapsulation: ViewEncapsulation.None
})
export class BaseViewerWidgetComponent extends WidgetComponent implements OnInit {
    constructor(formService: FormService) {
        super(formService);
    }

    ngOnInit(): void {
        if (this.field?.value) {
            if (Array.isArray(this.field.value) && this.field.value.length > 0) {
                const file = this.field.value[0];
                this.field.value = file.id;
            } else if (typeof this.field.value === 'object' && this.field.value.id) {
                this.field.value = this.field.value.id;
            }
        }
    }
}
