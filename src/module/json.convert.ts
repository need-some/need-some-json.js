import { ConversionError, ScalarConstructor } from '@need-some/basic';
import { AnnotationProcessor } from './annotation/annotation-processor';
import { JsonTransform } from './annotation/json-transform.annotation';
import { JsonArray } from './annotation/json-array.annotation';
import { JsonChild } from './annotation/json-child.annotation';
import { JsonNull } from './annotation/json-null.annotation';
import { JsonOptional } from './annotation/json-optional.annotation';
import { JsonTypes } from './annotation/json-types.annotation';
import { JsonDiscriminator } from './annotation/json-discriminator.annotation';
import { JsonDiscriminatorValue } from './annotation/json-discriminator-value.annotation';

/**
 * Dummy type to show the internal convert can process anything
 */
// tslint:disable-next-line: no-any // the marshalling can process any value
export type anyValue = any;

/**
 * Perform conversion
 * @param input The element to convert
 * @param type The constructor of a value of an object instance
 * @param inverse true if the conversion should be instance to json
 * @param complexConverter function to create the marshaller or unmarshaller of child objects
 * @param convert method to convert a value
 * @returns processed object
 */
function jsonConvertItem(
	input: anyValue,
	type: ScalarConstructor<anyValue>,
	inverse: boolean,
	complexConverter: (type: ScalarConstructor<anyValue>) => anyValue,
	convert: (converter: anyValue, value: anyValue) => anyValue
): anyValue {
	const jsonTypesTargetParams = AnnotationProcessor.getParams(JsonTypes, type, undefined);
	let members = AnnotationProcessor.getMembers(type, input, inverse);
	let actualtype = type;
	// find a subclass converter
	if (jsonTypesTargetParams && jsonTypesTargetParams.types) {
		// delegate to sub class converter
		const knownTypes = jsonTypesTargetParams.types();

		// find the member marked with discriminator annotation
		const discriminator = members.filter(m => AnnotationProcessor.hasAnnotations(JsonDiscriminator, type, m))[0];
		const discriminatorInput = inverse ? AnnotationProcessor.getJsonName(type, discriminator) : discriminator;
		let discriminatorValue = input[discriminatorInput];
		if (discriminatorValue === undefined) {
			// if discriminator value is not set, take the one from the class instead
			discriminatorValue = input.constructor !== undefined ? input.constructor.discriminatorValue : undefined;
			// additionally set the discriminator in the object
			input[discriminatorInput] = discriminatorValue;
		}
		if (AnnotationProcessor.hasAnnotations(JsonDiscriminatorValue, type)) {
			// if discriminator value is still not set, take the one from the conversion type instead
			discriminatorValue = AnnotationProcessor.getParams(JsonDiscriminatorValue, type).value;
			// additionally set the discriminator in the object
			input[discriminatorInput] = discriminatorValue;
		} else {
			// find the subclass annotated with the found discrimintor
			const filter = t =>
				AnnotationProcessor.hasAnnotations(JsonDiscriminatorValue, t) &&
				AnnotationProcessor.getParams(JsonDiscriminatorValue, t).value === discriminatorValue;
			const subtype = discriminatorValue !== undefined ? knownTypes.filter(filter)[0] : undefined;
			if (subtype !== undefined) {
				actualtype = subtype;
				// re-read members of correct subtype
				members = AnnotationProcessor.getMembers(actualtype, input, inverse);
			} else {
				throw new ConversionError('Wrong discriminator for subtype', (<anyValue>type).name + '/' + discriminatorValue);
			}
		}
	}

	// perform conversion with the correct converter
	const result = inverse ? new actualtype() : {};
	const actualtypeName = (<anyValue>actualtype).name;
	members.forEach(member => {
		const jsonName = AnnotationProcessor.getJsonName(actualtype, member);
		const inputMember = inverse ? jsonName : member;
		const outputMember = inverse ? member : jsonName;
		const value = input[inputMember];
		const jsonOptionalFlag = AnnotationProcessor.hasAnnotations(JsonOptional, actualtype, member);
		if (value !== undefined) {
			// get some annotation information
			const isArray = Array.isArray(value);
			const jsonArrayFlag = AnnotationProcessor.hasAnnotations(JsonArray, actualtype, member);
			const jsonNullableFlag = AnnotationProcessor.hasAnnotations(JsonNull, actualtype, member);
			const converterParams = AnnotationProcessor.getParams(JsonTransform, actualtype, member);
			const childParams = AnnotationProcessor.getParams(JsonChild, actualtype, member);
			const convertedValues = [];
			// use element array or create a one-element array
			const values: anyValue[] = isArray ? value : [value];
			if (!jsonArrayFlag && values.length !== 1) {
				throw new ConversionError('Array not allowed for member ' + actualtypeName + '.' + member, value);
			}
			// process each array item
			values
				.filter(v => v !== undefined)
				.forEach(v => {
					if (v === null) {
						if (jsonNullableFlag) {
							// use null
							convertedValues.push(null);
						} else {
							throw new ConversionError('Null not allowed for ' + actualtypeName + '.' + member, 'null');
						}
					} else if (converterParams !== undefined && converterParams.converter !== undefined) {
						// delegate to converter
						convertedValues.push(convert(v, converterParams.converter));
					} else if (childParams !== undefined && childParams.type !== undefined) {
						// delegate to new JsonConverter
						convertedValues.push(convert(v, complexConverter(childParams.type)));
					} else {
						convertedValues.push(v);
					}
				});
			result[outputMember] = jsonArrayFlag ? convertedValues : convertedValues[0];
		} else {
			if (jsonOptionalFlag) {
				result[outputMember] = undefined;
			} else {
				throw new ConversionError('Missing member ' + actualtypeName + '.' + member, '');
			}
		}
	});
	return result;
}

/**
 * Perform conversion
 * @param input The element to convert
 * @param type The constructor of a value of an object instance
 * @param inverse true if the conversion should be instance to json
 * @param complexConverter function to create the marshaller or unmarshaller of child objects
 * @param convert method to convert a value
 * @param array flag indicating if an array is returned or not
 * @returns processed object
 */
export function jsonConvert(
	input: anyValue,
	type: ScalarConstructor<anyValue>,
	inverse: boolean,
	complexConverter: (type: ScalarConstructor<anyValue>) => anyValue,
	convert: (converter: anyValue, value: anyValue) => anyValue,
	array: boolean
): anyValue {
	let result;
	const isArray = Array.isArray(input);
	if (isArray) {
		if (!(array || input.length === 1)) {
			throw new ConversionError('Array not allowed for json', input);
		}
		result = input.map(i => jsonConvertItem(i, type, inverse, complexConverter, convert));
	} else {
		result = [jsonConvertItem(input, type, inverse, complexConverter, convert)];
	}
	return array ? result : result[0];
}
