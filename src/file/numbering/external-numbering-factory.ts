import { convertToXmlComponent, ImportedXmlComponent } from "file/xml-components";
import { Element as XMLElement, xml2js } from "xml-js";

export class ExternalNumberingFactory {
    /**
     * Creates new Numbering based on the given numbering.
     * Parses the numbering and convert them to XmlComponent.
     * Example content from numbering.xml:
     * <?xml version="1.0">
     * <w:numbering xmlns:mc="some schema" ...>
     *
     *   <w:numbering w:type="paragraph" w:numberingId="Heading1">
     *           <w:name w:val="heading 1"/>
     *           .....
     *   </w:numbering>
     *
     *   <w:numbering w:type="paragraph" w:numberingId="Heading2">
     *           <w:name w:val="heading 2"/>
     *           .....
     *   </w:numbering>
     *
     *   <w:docDefaults>Or any other element will be parsed to</w:docDefaults>
     *
     * </w:numbering>
     * @param externalNumberings context from numbering.xml
     */
    public newInstance(xmlData: string) {
        const xmlObj = xml2js(xmlData, { compact: false }) as XMLElement;
        let numberingXmlElement;
        for (const xmlElm of xmlObj.elements || []) {
            if (xmlElm.name === "w:numbering") {
                numberingXmlElement = xmlElm;
            }
        }
        if (numberingXmlElement === undefined) {
            throw new Error("can not find numbering element");
        }
        const numberingElements = numberingXmlElement.elements || [];
        return numberingElements.map((childElm) => convertToXmlComponent(childElm) as ImportedXmlComponent);
    }
}
