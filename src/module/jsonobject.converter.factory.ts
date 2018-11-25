import { ConverterFactory, ScalarConstructor } from '@need-some/basic';
import { JsonObjectConverter } from './jsonobject.converter';
import { JSON } from './types';

/**
 * Converter from typed class to json plain object.
 * @param T The object type to create
 */
export class JsonObjectConverterFactory<T> implements ConverterFactory<T, JSON, { type: ScalarConstructor<T> }> {
	/**
	 * Create a json converter instance.
	 * @param the parameter to instantiate the converter {type: constructor}
	 */
	createConverter(param): JsonObjectConverter<T> {
		return new JsonObjectConverter<T>(param.type);
	}
}
