import { Converter, ScalarConstructor } from '@need-some/basic';
import { JsonObjectMarshaller } from './jsonobject.marshaller';
import { JsonObjectUnmarshaller } from './jsonobject.unmarshaller';
import { JSON } from './types';

/**
 * Converter from typed class to json plain object.
 * @param T The object type to create
 */
export class JsonObjectConverter<T> implements Converter<T, JSON> {
	/**
	 * Delegate marshaller
	 */
	private marshaller: JsonObjectMarshaller<T>;

	/**
	 * Delegate unmarshaller
	 */
	private unmarshaller: JsonObjectUnmarshaller<T>;

	/**
	 * Create converter instance with an annotated type.
	 *
	 * @param type the annotated type.
	 */
	constructor(type: ScalarConstructor<T>) {
		this.marshaller = new JsonObjectMarshaller<T>(type);
		this.unmarshaller = new JsonObjectUnmarshaller<T>(type);
	}

	/**
	 * Get Json for the given object.
	 *
	 * @param object the object to serialize.
	 * @return the serialized variant.
	 */
	marshal(object: T) {
		return this.marshaller.marshal(object);
	}

	/**
	 * Create object instance for the given json string.
	 *
	 * @param serialized the json string.
	 * @return the object instance.
	 */
	unmarshal(serialized: JSON) {
		return this.unmarshaller.unmarshal(serialized);
	}
}
