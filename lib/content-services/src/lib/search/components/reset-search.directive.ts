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

import { Directive, HostListener } from '@angular/core';
import { SearchFacetFiltersService } from '../services/search-facet-filters.service';

@Directive({
    selector: '[adf-reset-search]',
    standalone: true
})
export class ResetSearchDirective {
    @HostListener('click')
    onClick() {
        this.filterService.reset();
    }

    constructor(private filterService: SearchFacetFiltersService) {}
}
