// http://officeopenxml.com/WPnumbering.php
import { IXmlableObject, XmlComponent } from "file/xml-components";

import { DocumentAttributes } from "../document/document-attributes";
import { AbstractNumbering } from "./abstract-numbering";
import { ILevelsOptions } from "./level";
import { ConcreteNumbering } from "./num";

export interface INumberingOptions {
    readonly config: {
        readonly levels: ILevelsOptions[];
        readonly reference: string;
    }[];
}

export class Numbering extends XmlComponent {
    // tslint:disable-next-line:readonly-keyword
    private nextId: number;

    private readonly abstractNumbering: AbstractNumbering[] = [];
    private readonly concreteNumbering: ConcreteNumbering[] = [];

    constructor(options: INumberingOptions, initNumberings) {
        super("w:numbering");
        this.root.push(
            new DocumentAttributes({
                wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
                mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
                o: "urn:schemas-microsoft-com:office:office",
                r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
                m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
                v: "urn:schemas-microsoft-com:vml",
                wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
                wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
                w10: "urn:schemas-microsoft-com:office:word",
                w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
                w14: "http://schemas.microsoft.com/office/word/2010/wordml",
                w15: "http://schemas.microsoft.com/office/word/2012/wordml",
                wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
                wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
                wne: "http://schemas.microsoft.com/office/word/2006/wordml",
                wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
                Ignorable: "w14 w15 wp14",
            }),
        );

        let id = 0;
        if (initNumberings !== undefined) {
            for (; id<initNumberings.length; id++) {
                this.root.push(initNumberings[id]);
            }
        }
        this.nextId = id;

        for (const con of options.config) {
            const currentAbstractNumbering = this.createAbstractNumbering(con.levels);
            this.createConcreteNumbering(currentAbstractNumbering, con.reference);
        }
    }

    public prepForXml(): IXmlableObject | undefined {
        this.abstractNumbering.forEach((x) => this.root.push(x));
        this.concreteNumbering.forEach((x) => this.root.push(x));
        return super.prepForXml();
    }

    private createConcreteNumbering(abstractNumbering: AbstractNumbering, reference?: string): ConcreteNumbering {
        const num = new ConcreteNumbering(this.nextId++, abstractNumbering.id, reference);
        this.concreteNumbering.push(num);
        return num;
    }

    private createAbstractNumbering(options: ILevelsOptions[]): AbstractNumbering {
        const num = new AbstractNumbering(this.nextId++, options);
        this.abstractNumbering.push(num);
        return num;
    }

    public get ConcreteNumbering(): ConcreteNumbering[] {
        return this.concreteNumbering;
    }
}
