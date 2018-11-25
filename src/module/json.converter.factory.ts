import { ConverterFactory, Constructor } from '@need-some/basic';
import { JsonConverter } from './json.converter';
import { JsonFormatter, JsonParser } from './types';

/**
 * Converter from typed class to json plain object.
 * @param T The object type to create
 */
export class JsonConverterFactory<T>
	implements ConverterFactory<T, string, { type: Constructor<T>; formatter?: JsonFormatter; parser: JsonParser }> {
	/**
	 * Create a json converter instance.
	 * @param the parameter to instantiate the converter {type: constructor}
	 */
	createConverter(param): JsonConverter<T> {
		return new JsonConverter<T>(param.type, param.formatter, param.parser);
	}
}
