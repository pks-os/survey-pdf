(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { QuestionRatingModel } from 'survey-core';
import { SurveyPDF } from '../src/survey';
import { IRect, DocOptions, IDocOptions, DocController } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatRating } from '../src/flat_layout/flat_rating';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_rt = new FlatRating(null, null);

test('Check rating two elements', async () => {
    let json = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    survey.controller.margins.left += survey.controller.unitWidth;
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getRatingMinWidth(survey.controller) * 2,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.unitHeight * SurveyHelper.RATING_MIN_HEIGHT
    };
    TestHelper.equalRect(expect, flats[0][0], assumeRating);
});
test('Check rating two elements with min rate description', async () => {
    let json = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2,
                minRateDescription: 'I\'m sooooooo little'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    survey.controller.margins.left += survey.controller.unitWidth;
    let question: QuestionRatingModel = <QuestionRatingModel>survey.getAllQuestions()[0];
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getRatingMinWidth(survey.controller) + survey.controller.measureText(
                SurveyHelper.getRatingItemText(question, 0, question.visibleRateValues[0].locText),
                'bold').width + survey.controller.unitHeight,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.unitHeight * SurveyHelper.RATING_MIN_HEIGHT
    };
    TestHelper.equalRect(expect, flats[0][0], assumeRating);
});
test('Check rating two elements with max rate description', async () => {
    let json = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2,
                maxRateDescription: 'High rate !'
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let question: QuestionRatingModel = <QuestionRatingModel>survey.getAllQuestions()[0];
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft + survey.controller.unitWidth,
        xRight: survey.controller.leftTopPoint.xLeft + survey.controller.unitWidth +
            SurveyHelper.getRatingMinWidth(survey.controller) + survey.controller.measureText(
                SurveyHelper.getRatingItemText(question, 1,
                    question.visibleRateValues[0].locText), 'bold').width +
            survey.controller.unitHeight,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.unitHeight * SurveyHelper.RATING_MIN_HEIGHT
    };
    TestHelper.equalRect(expect, flats[0][0], assumeRating);
});
test('Check rating many elements', async () => {
    let json: any = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 6
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    options.format = [options.margins.left + options.margins.right +
        SurveyHelper.getRatingMinWidth(new DocController(options)) * 3 /
            DocOptions.MM_TO_PT + new DocController(options).unitWidth /
            DocOptions.MM_TO_PT, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    survey.controller.margins.left += survey.controller.unitWidth;
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.unitHeight * SurveyHelper.RATING_MIN_HEIGHT * 2.0
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeRating);
});
test('Check rating two elements with long min rate description', async () => {
    let json: any = {
        elements: [
            {
                type: 'rating',
                name: 'rateme',
                titleLocation: 'hidden',
                rateMax: 2,
                minRateDescription: '123456789'
            }
        ]
    };
    let dummyController: DocController = new DocController(TestHelper.defaultOptions);
    let longRateDesc: number = (dummyController.measureText(
        json.elements[0].minRateDescription + ' 1', 'bold').width +
        dummyController.unitWidth) / DocOptions.MM_TO_PT;
    let options: IDocOptions = TestHelper.defaultOptions;
    options.format = [options.margins.left + dummyController.unitWidth / DocOptions.MM_TO_PT +
        options.margins.right + longRateDesc, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    survey.controller.margins.left += survey.controller.unitWidth;
    let assumeRating: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop +
            survey.controller.unitHeight * SurveyHelper.RATING_MIN_HEIGHT * 2.0
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeRating);
});