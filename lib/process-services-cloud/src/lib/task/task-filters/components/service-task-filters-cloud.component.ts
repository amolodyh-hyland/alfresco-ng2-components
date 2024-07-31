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

import { Component, EventEmitter, OnChanges, Output, SimpleChanges, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterParamsModel, ServiceTaskFilterCloudModel } from '../models/filter-cloud.model';
import { takeUntil } from 'rxjs/operators';
import { BaseTaskFiltersCloudComponent } from './base-task-filters-cloud.component';
import { ServiceTaskFilterCloudService } from '../services/service-task-filter-cloud.service';
import { TranslationService } from '@alfresco/adf-core';

@Component({
    selector: 'adf-cloud-service-task-filters',
    templateUrl: './base-task-filters-cloud.component.html',
    styleUrls: ['./base-task-filters-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ServiceTaskFiltersCloudComponent extends BaseTaskFiltersCloudComponent implements OnInit, OnChanges {
    /** Emitted when a filter is being selected based on the filterParam input. */
    @Output()
    filterSelected = new EventEmitter<ServiceTaskFilterCloudModel>();

    /** Emitted when a filter is being clicked from the UI. */
    @Output()
    filterClicked = new EventEmitter<ServiceTaskFilterCloudModel>();

    filters$: Observable<ServiceTaskFilterCloudModel[]>;
    filters: ServiceTaskFilterCloudModel[] = [];
    currentFilter: ServiceTaskFilterCloudModel;

    private readonly serviceTaskFilterCloudService = inject(ServiceTaskFilterCloudService);
    private readonly translationService = inject(TranslationService);

    ngOnInit() {
        this.getFilters(this.appName);
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        const filter = changes['filterParam'];
        if (appName && appName.currentValue !== appName.previousValue) {
            this.getFilters(appName.currentValue);
        } else if (filter && filter.currentValue !== filter.previousValue) {
            this.selectFilterAndEmit(filter.currentValue);
        }
    }

    /**
     * Load the filter list filtered by appName
     *
     * @param appName application name
     */
    getFilters(appName: string): void {
        this.filters$ = this.serviceTaskFilterCloudService.getTaskListFilters(appName);

        this.filters$.pipe(takeUntil(this.onDestroy$)).subscribe(
            (res: ServiceTaskFilterCloudModel[]) => {
                this.resetFilter();
                this.filters = res || [];
                this.selectFilterAndEmit(this.filterParam);
                this.success.emit(res);
            },
            (err: any) => {
                this.error.emit(err);
            }
        );
    }

    /**
     * Select filter
     *
     * @param paramFilter filter model
     */
    selectFilter(paramFilter: FilterParamsModel) {
        if (!paramFilter) {
            return;
        }

        const preferredFilter = this.filters.find((filter) => filter.id === paramFilter.id);

        this.currentFilter =
            preferredFilter ??
            this.filters.find(
                (filter, index) =>
                    paramFilter.index === index ||
                    paramFilter.key === filter.key ||
                    paramFilter.id === filter.id ||
                    (paramFilter.name && paramFilter.name.toLocaleLowerCase() === this.translationService.instant(filter.name).toLocaleLowerCase())
            ); // fallback to preserve the previous behavior
    }

    public selectFilterAndEmit(newParamFilter: FilterParamsModel) {
        if (newParamFilter) {
            this.selectFilter(newParamFilter);

            if (this.currentFilter) {
                this.filterSelected.emit(this.currentFilter);
            }
        } else {
            this.currentFilter = undefined;
        }
    }

    /**
     * Selects and emits the clicked filter.
     *
     * @param filter filter to select
     */
    onFilterClick(filter: FilterParamsModel) {
        if (filter) {
            this.selectFilter(filter);
            this.filterClicked.emit(this.currentFilter);
        } else {
            this.currentFilter = undefined;
        }
    }

    /**
     * Select as default task filter the first in the list
     */
    public selectDefaultTaskFilter() {
        if (!this.isFilterListEmpty()) {
            this.currentFilter = this.filters[0];
        }
    }

    /**
     * Check if the filter list is empty
     *
     * @returns `true` if filter list is empty, otherwise `false`
     */
    isFilterListEmpty(): boolean {
        return this.filters === undefined || (this.filters && this.filters.length === 0);
    }

    /**
     * Reset the filters properties
     */
    private resetFilter() {
        this.filters = [];
        this.currentFilter = undefined;
    }
}
