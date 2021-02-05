/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ProcessServiceTabBarPage } from './process-service-tab-bar.page';

import { Locator, element, by, browser } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { TasksPage } from './tasks.page';

export class ProcessServicesPage {

    apsAppsContainer = element(by.css('.adf-app-listgrid'));
    taskApp = element(by.css('mat-card[title="Task App"]'));
    iconTypeLocator: Locator = by.css('mat-icon[class*="card-logo-icon"]');
    descriptionLocator: Locator = by.css('mat-card-subtitle[class*="subtitle"]');

    async checkApsContainer(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.apsAppsContainer);
    }

    async goToApp(applicationName: string): Promise<ProcessServiceTabBarPage> {
        const app = element(by.css('mat-card[title="' + applicationName + '"]'));
        await BrowserActions.click(app);
        const taskPage = new TasksPage();
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        return new ProcessServiceTabBarPage();
    }

    async goToTaskApp(): Promise<ProcessServiceTabBarPage> {
        await BrowserActions.click(this.taskApp);
        return new ProcessServiceTabBarPage();
    }

    async goToAppByAppId(appId: string): Promise<void> {
        const urlToNavigateTo = `${browser.baseUrl}/activiti/apps/${appId}/tasks/`;
        await BrowserActions.getUrl(urlToNavigateTo);
        const taskPage = new TasksPage();
        await taskPage.tasksListPage().checkTaskListIsLoaded();
    }

    async getAppIconType(applicationName: string): Promise<string> {
        const app = element(by.css('mat-card[title="' + applicationName + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(app);
        const iconType = app.element(this.iconTypeLocator);
        return BrowserActions.getText(iconType);
    }

    async getBackgroundColor(applicationName: string): Promise<string> {
        const app = element(by.css('mat-card[title="' + applicationName + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(app);
        return app.getCssValue('background-color');
    }

    async getDescription(applicationName: string): Promise<string> {
        const app = element(by.css('mat-card[title="' + applicationName + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(app);
        const description = app.element(this.descriptionLocator);
        return BrowserActions.getText(description);
    }

    async checkAppIsNotDisplayed(applicationName: string): Promise<void> {
        const app = element(by.css('mat-card[title="' + applicationName + '"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(app);
    }

    async checkAppIsDisplayed(applicationName: string): Promise<void> {
        const app = element(by.css('mat-card[title="' + applicationName + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(app);
    }
}
