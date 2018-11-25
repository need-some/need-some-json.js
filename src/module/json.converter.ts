import { Converter, Constructor } from '@need-some/basic';
import { JsonMarshaller } from './json.marshaller';
import { JsonUnmarshaller } from './json.unmarshaller';
import { JsonFormatter, JsonParser } from './types';

/**
 * Converter from typed class to json string.
 * @param T The object type to create
 */
export class JsonConverter<T> implements Converter<T, string> {
	/**
	 * Delegate marshaller
	 */
	private marshaller: JsonMarshaller<T>;

	/**
	 * Delegate unmarshaller
	 */
	private unmarshaller: JsonUnmarshaller<T>;

	/**
	 * Create converter instance with an annotated type.
	 *
	 * @param type the annotated type.
	 */
	constructor(type: Constructor<T>, formatter?: JsonFormatter, parser?: JsonParser) {
		this.marshaller = new JsonMarshaller<T>(type, formatter);
		this.unmarshaller = new JsonUnmarshaller<T>(type, parser);
	}

	/**
	 * Get Json string for the given object.
	 *
	 * @param object the object to serialize.
	 * @return the serialized variant.
	 */
	marshal(object: T): string {
		return this.marshaller.marshal(object);
	}

	/**
	 * Create object instance for the given json string.
	 *
	 * @param serialized the json string.
	 * @return the object instance.
	 */
	unmarshal(serialized: string): T {
		return this.unmarshaller.unmarshal(serialized);
	}
}
