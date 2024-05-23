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

import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, EmptyContentComponent, FormRenderingService, provideTranslations } from '@alfresco/adf-core';

import { MaterialModule } from './material.module';

import { ProcessListModule } from './process-list/process-list.module';
import { TaskListModule } from './task-list/task-list.module';
import { ProcessCommentsModule } from './process-comments/process-comments.module';
import { PeopleModule } from './people/people.module';
import { FormModule } from './form/form.module';
import { ProcessFormRenderingService } from './form/process-form-rendering.service';
import { TaskCommentsModule } from './task-comments/task-comments.module';
import { ProcessUserInfoModule } from './process-user-info/process-user-info.module';
import { ATTACHMENT_DIRECTIVES } from './attachment';
import { APPS_LIST_DIRECTIVES } from './app-list';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        ProcessCommentsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ProcessListModule,
        TaskListModule,
        TaskCommentsModule,
        ...APPS_LIST_DIRECTIVES,
        ProcessUserInfoModule,
        ...ATTACHMENT_DIRECTIVES,
        PeopleModule,
        FormModule,
        EmptyContentComponent
    ],
    providers: [provideTranslations('adf-process-services', 'assets/adf-process-services')],
    exports: [
        CommonModule,
        ProcessCommentsModule,
        FormsModule,
        ReactiveFormsModule,
        ProcessListModule,
        TaskListModule,
        TaskCommentsModule,
        ...APPS_LIST_DIRECTIVES,
        ProcessUserInfoModule,
        ...ATTACHMENT_DIRECTIVES,
        PeopleModule,
        FormModule
    ]
})
export class ProcessModule {
    static forRoot(): ModuleWithProviders<ProcessModule> {
        return {
            ngModule: ProcessModule,
            providers: [
                provideTranslations('adf-process-services', 'assets/adf-process-services'),
                FormRenderingService,
                { provide: FormRenderingService, useClass: ProcessFormRenderingService }
            ]
        };
    }

    static forChild(): ModuleWithProviders<ProcessModule> {
        return {
            ngModule: ProcessModule
        };
    }
}
