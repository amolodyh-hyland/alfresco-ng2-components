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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsComponent } from './comments.component';
import { CommentsServiceMock, commentsResponseMock } from './mocks/comments.service.mock';
import { of, throwError } from 'rxjs';
import { ADF_COMMENTS_SERVICE } from './interfaces/comments.token';
import { CommentsService } from './interfaces/comments-service.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NoopTranslateModule } from '../testing/noop-translate.module';
import { UnitTestingUtils } from '../testing/unit-testing-utils';

describe('CommentsComponent', () => {
    let component: CommentsComponent;
    let fixture: ComponentFixture<CommentsComponent>;
    let getCommentSpy: jasmine.Spy;
    let addCommentSpy: jasmine.Spy;
    let commentsService: CommentsService;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, NoopTranslateModule, CommentsComponent],
            providers: [
                {
                    provide: ADF_COMMENTS_SERVICE,
                    useClass: CommentsServiceMock
                }
            ]
        });
        fixture = TestBed.createComponent(CommentsComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);

        commentsService = TestBed.inject<CommentsService>(ADF_COMMENTS_SERVICE);

        getCommentSpy = spyOn(commentsService, 'get').and.returnValue(commentsResponseMock.getComments());
        addCommentSpy = spyOn(commentsService, 'add').and.returnValue(commentsResponseMock.addComment());
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should load comments when id specified', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ id: change });

        expect(getCommentSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading comments', () => {
        const emitSpy = spyOn(component.error, 'emit');
        getCommentSpy.and.returnValue(throwError(() => new Error('error')));

        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ id: change });

        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not load comments when no id is specified', () => {
        fixture.detectChanges();
        expect(getCommentSpy).not.toHaveBeenCalled();
    });

    it('should display comments when the entity has comments', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ id: change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(testingUtils.getAllByCSS('.adf-comment-message').length).toBe(3);
        expect(testingUtils.getByCSS('.adf-comment-message:empty')).toBeNull();
    });

    it('should display comments count when the entity has comments', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ id: change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(testingUtils.getInnerTextByCSS('#comment-header')).toBe('COMMENTS.HEADER');
    });

    it('should not display comments when the entity has no comments', async () => {
        component.id = '123';
        getCommentSpy.and.returnValue(of([]));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(testingUtils.getByCSS('#comment-container')).toBeNull();
    });

    it('should display comments input by default', async () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ id: change });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(testingUtils.getByCSS('#comment-input')).not.toBeNull();
    });

    it('should not display comments input when the entity is readonly', async () => {
        component.readOnly = true;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(testingUtils.getByCSS('#comment-input')).toBeNull();
    });

    describe('Change detection id', () => {
        const change = new SimpleChange('123', '456', true);
        const nullChange = new SimpleChange('123', null, true);

        beforeEach(() => {
            component.id = '123';
            fixture.detectChanges();
        });

        it('should fetch new comments when id changed', () => {
            component.ngOnChanges({ id: change });
            expect(getCommentSpy).toHaveBeenCalledWith('456');
        });

        it('should not fetch new comments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getCommentSpy).not.toHaveBeenCalled();
        });

        it('should not fetch new comments when id changed to null', () => {
            component.ngOnChanges({ id: nullChange });
            expect(getCommentSpy).not.toHaveBeenCalled();
        });
    });

    describe('Add comment', () => {
        beforeEach(() => {
            component.id = '123';
            fixture.detectChanges();
            fixture.whenStable();
        });

        it('should normalize comment when user input contains spaces sequence', async () => {
            component.message = 'test comment';
            testingUtils.clickByCSS('.adf-comments-input-add');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(addCommentSpy).toHaveBeenCalledWith('123', 'test comment');
        });

        it('should support multiline comments with HTML', async () => {
            const commentText: string = [
                `<form action="/action_page.php">`,
                `First name: <input type="text" name="fname"><br>`,
                `Last name: <input type="text" name="lname"><br>`,
                `<input type="submit" value="Submit">`,
                `</form>`
            ].join('\n');

            getCommentSpy.and.returnValue(of([]));
            addCommentSpy.and.returnValue(commentsResponseMock.addComment(commentText));

            component.message = commentText;
            testingUtils.clickByCSS('.adf-comments-input-add');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(addCommentSpy).toHaveBeenCalledWith('123', commentText);
            expect(testingUtils.getInnerTextByCSS('.adf-comment-message')).toBe(commentText);
        });

        it('should call service to add a comment when add button is pressed', async () => {
            component.message = 'Test Comment';
            addCommentSpy.and.returnValue(commentsResponseMock.addComment(component.message));
            testingUtils.clickByCSS('.adf-comments-input-add');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(addCommentSpy).toHaveBeenCalled();
            const elements = testingUtils.getAllByCSS('.adf-comment-message');
            expect(elements.length).toBe(1);
            expect(elements[0].nativeElement.innerText).toBe('Test Comment');
        });

        it('should not call service to add a comment when comment is empty', async () => {
            component.message = '';
            testingUtils.clickByCSS('.adf-comments-input-add');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(addCommentSpy).not.toHaveBeenCalled();
        });

        it('should clear comment when escape key is pressed', async () => {
            testingUtils.keyBoardEventByCSS('#comment-input', 'keydown', 'Escape', 'Escape');

            fixture.detectChanges();
            await fixture.whenStable();

            const input = testingUtils.getByCSS('#comment-input');
            expect(input.nativeElement.value).toBe('');
        });

        it('should emit an error when an error occurs adding the comment', () => {
            const emitSpy = spyOn(component.error, 'emit');
            addCommentSpy.and.returnValue(throwError(() => new Error('error')));
            component.message = 'Test comment';
            component.addComment();
            expect(emitSpy).toHaveBeenCalled();
        });

        it('should set beingAdded variable back to false when an error occurs adding the comment', () => {
            addCommentSpy.and.returnValue(throwError(() => new Error('error')));
            component.addComment();
            expect(component.beingAdded).toBeFalse();
        });

        it('should set beingAdded variable back to false on successful response when adding the comment', () => {
            addCommentSpy.and.returnValue(commentsResponseMock.addComment());
            component.addComment();
            expect(component.beingAdded).toBeFalse();
        });

        it('should not add comment if id is not provided', () => {
            component.id = '';
            component.addComment();
            expect(addCommentSpy).not.toHaveBeenCalled();
        });

        it('should not add comment if message is empty', () => {
            component.message = '';
            component.addComment();
            expect(addCommentSpy).not.toHaveBeenCalled();
        });
    });
});
