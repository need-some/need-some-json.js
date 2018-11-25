import { Marshaller, Constructor } from '@need-some/basic';
import { JSON, JsonFormatter } from './types';
import { JsonObjectMarshaller } from './jsonobject.marshaller';

/**
 * Internal formatter to convert simple json objects to strings.
 */
const _STANDARD_FORMATTER: (json: JSON) => string = (json: JSON) => JSON.stringify(json);

/**
 * Converter from typed class to json plain object.
 * @param T The object type to create
 */
export class JsonMarshaller<T> implements Marshaller<T, string> {
	/**
	 * Default formatter to convert json objects to strings.
	 * This is used if no formatter is specified for the marshaller instance.
	 */
	private static _DEFAULT_FORMATTER = _STANDARD_FORMATTER;

	/**
	 * Delegate converter that creates json object
	 */
	private marshaller: JsonObjectMarshaller<T>;

	/**
	 * Create marshaller instance with an annotated type.
	 *
	 * @param type the annotated type.
	 * @param formatter optional method to generate json string from object if different from internal json facility.
	 */
	constructor(type: Constructor<T>, private formatter?: JsonFormatter) {
		this.marshaller = new JsonObjectMarshaller(type);
	}

	/**
	 * Get Json for the given object.
	 *
	 * @param object the object to serialize.
	 * @return the serialized variant.
	 */
	marshal(object: T): string {
		const json = this.marshaller.marshal(object);
		const formatter = this.formatter || JsonMarshaller._DEFAULT_FORMATTER;
		return formatter(json);
	}

	/**
	 * Default formatter to convert json objects to strings.
	 * This is used if no formatter is specified for the marshaller instance.
	 */
	static get DEFAULT_FORMATTER(): JsonFormatter {
		return JsonMarshaller._DEFAULT_FORMATTER;
	}

	/**
	 * Default formatter to convert json objects to strings.
	 * This is used if no formatter is specified for the marshaller instance.
	 * If undefined is set, the internal json stringify is used as a default
	 */
	static set DEFAULT_FORMATTER(formatter: JsonFormatter) {
		JsonMarshaller._DEFAULT_FORMATTER = formatter || _STANDARD_FORMATTER;
	}
}
