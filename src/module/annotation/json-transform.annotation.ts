import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { AnnotationProcessor } from './annotation-processor';
import { Converter, ConverterFactory, ScalarConstructor } from '@need-some/basic';

// tslint:disable-next-line: no-any // the annotation can use any converter
export type anyConverter = Converter<any, any>;
// tslint:disable-next-line: no-any // the annotation can use any converter
export type anyConverterFactory = ConverterFactory<any, any, any>;
// tslint:disable-next-line: no-any // the annotation can define any param
export type anyParam = any;

/**
 * Key of the annotation
 */
const formatMetadataKey = 'annotations.JsonTransform';

/**
 * Declare a converter to be used when processing the member. A converter has a marshal and an unmarshal function.
 * @param converter factory for converter that is used to transform the member
 * @param params parameter for the converter factory
 * @returns annotation metadata
 */
export function JsonTransform(converter: anyConverterFactory, params: anyParam): Metadata;

/**
 * Declare a converter to be used when processing the member. A converter has a marshal and an unmarshal function.
 * @param converter constructor of a factory
 * @param params parameter for the converter factory
 * @returns annotation metadata
 */
export function JsonTransform(converter: ScalarConstructor<anyConverterFactory>, params: anyParam): Metadata;

/**
 * Declare a converter to be used when processing the member. A converter has a marshal and an unmarshal function.
 * @param converter constructor instance
 * @returns annotation metadata
 */
export function JsonTransform(converter: anyConverter): Metadata;

/**
 * Declare a converter to be used when processing the member. A converter has a marshal and an unmarshal function.
 * @param converter constructor of a converter
 * @returns annotation metadata
 */
export function JsonTransform(converter: ScalarConstructor<anyConverter>): Metadata;

/**
 * Internal signature.
 * @param converter different types of converter initializers
 * @param params parameter for the converter factory
 * @returns annotation metadata
 */
export function JsonTransform(
	converter: anyConverter | anyConverterFactory | ScalarConstructor<anyConverter> | ScalarConstructor<anyConverterFactory>,
	params?: anyParam
): Metadata {
	let converterInstance: anyConverter;
	// run two times if the parameter is a constructor
	for (let i = 0; i < 2; i++) {
		if ((<anyConverter>converter).marshal !== undefined) {
			// a converter is detected if the marshal method exists
			converterInstance = <anyConverter>converter;
			break; // dont repeat
		} else if ((<anyConverterFactory>converter).createConverter !== undefined) {
			// a converterFactory is detected if the createConverter method exists
			converterInstance = (<anyConverterFactory>converter).createConverter(params);
			break; // dont repeat
		} else {
			converter = new (<ScalarConstructor<anyParam>>converter)();
			// repeat loop once
		}
	}
	return AnnotationProcessor.registerAnnotation(formatMetadataKey, { converter: converterInstance });
}
