import { IQuestion, QuestionTextModel } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class TextFieldBrick extends PdfBrick {
    protected question: QuestionTextModel;
    public constructor(question: IQuestion, controller: DocController,
        rect: IRect, protected isQuestion: boolean,
        protected fieldName: string, protected value: string,
        protected placeholder: string, protected isReadOnly: boolean,
        protected isMultiline: boolean, protected inputType: string) {
        super(question, controller, rect);
        this.question = <QuestionTextModel>question;
    }
    public async renderInteractive(): Promise<void> {
        if (this.inputType === 'color') {
            let oldFillColor: string = this.controller.doc.getFillColor();
            this.controller.doc.setFillColor(this.question.value || 'black');
            this.controller.doc.rect(this.xLeft, this.yTop,
                this.width, this.height, 'F');
            this.controller.doc.setFillColor(oldFillColor);
            return;
        }
        let inputField: any = this.inputType === 'password' ?
            new (<any>this.controller.doc.AcroFormPasswordField)() :
            new (<any>this.controller.doc.AcroFormTextField)();
        inputField.fieldName = this.fieldName;
        inputField.fontName = this.controller.fontName;
        inputField.fontSize = this.fontSize;
        inputField.isUnicode = SurveyHelper.isCustomFont(
            this.controller, inputField.fontName);
        if (this.inputType !== 'password') {
            inputField.V = ' ' + this.value;
            inputField.DV = ' ' + this.placeholder;
        }
        else inputField.value = '';
        inputField.multiline = this.isMultiline;
        inputField.readOnly = this.isReadOnly;
        inputField.color = this.textColor;
        let formScale: number = SurveyHelper.formScale(this.controller, this);
        inputField.maxFontSize = this.controller.fontSize * formScale;
        inputField.Rect = SurveyHelper.createAcroformRect(
            SurveyHelper.scaleRect(this, formScale));
        this.controller.doc.addField(inputField);
        SurveyHelper.renderFlatBorders(this.controller, this);
    }
    public async renderReadOnly(): Promise<void> {
        this.controller.pushMargins(this.xLeft,
            this.controller.paperWidth - this.xRight);
        await SurveyHelper.renderReadOnlyTextField(this.controller,
            this.question, this, this.value, !this.isMultiline);
        this.controller.popMargins();
    }
}