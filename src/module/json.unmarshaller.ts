import { Unmarshaller, Constructor } from '@need-some/basic';
import { JsonParser } from './types';
import { JsonObjectUnmarshaller } from './jsonobject.unmarshaller';
import { ConversionError } from '@need-some/basic';

/**
 * Internal parser to convert strings to simple json objects.
 */
const _STANDARD_PARSER = (s: string) => JSON.parse(s);

/**
 * Converter from typed class to json plain object.
 * @param T The object type to create
 */
export class JsonUnmarshaller<T> implements Unmarshaller<T, string> {
	/**
	 * Default parser to convert strings to simple json objects.
	 * This is used if no parser is specified for the unmarshaller instance.
	 */
	private static _DEFAULT_PARSER = _STANDARD_PARSER;

	/**
	 * Delegate converter that processes the parsed json object
	 */
	private unmarshaller: JsonObjectUnmarshaller<T>;

	/**
	 * Create marshaller instance with an annotated type.
	 *
	 * @param type the annotated type.
	 * @param formatter optional method to generate json string from object if different from internal json facility.
	 */
	constructor(type: Constructor<T>, private parser?: JsonParser) {
		this.unmarshaller = new JsonObjectUnmarshaller(type);
	}

	/**
	 * Get object instance for Json string.
	 *
	 * @param serialized the json string.
	 * @return the object instance.
	 */
	unmarshal(serialized: string): T {
		// not type safe operation: use object or array directly with the delegate unmarshaller
		// this might be necessary if called with a parsed object (as e.g. a http client could deliver)
		if (typeof serialized === 'object') {
			return this.unmarshaller.unmarshal(serialized);
		}
		const parser = this.parser || JsonUnmarshaller._DEFAULT_PARSER;
		const json = parser(serialized);
		if (typeof json !== 'object') {
			throw new ConversionError('Cannot handle json type', typeof json);
		}
		return this.unmarshaller.unmarshal(json);
	}

	/**
	 * Default parser to convert strings to simple json objects.
	 * This is used if no parser is specified for the unmarshaller instance.
	 */
	static get DEFAULT_PARSER(): JsonParser {
		return JsonUnmarshaller._DEFAULT_PARSER;
	}

	/**
	 * Default parser to convert strings to simple json objects.
	 * This is used if no parser is specified for the unmarshaller instance.
	 * If undefined is set, the internal parser is used as a default
	 */
	static set DEFAULT_PARSER(formatter: JsonParser) {
		JsonUnmarshaller._DEFAULT_PARSER = formatter || _STANDARD_PARSER;
	}
}
