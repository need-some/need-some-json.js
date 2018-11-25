import { Marshaller, ArrayConstructor, ScalarConstructor, Constructor } from '@need-some/basic';
import { JSON } from './types';
import { jsonConvert } from './json.convert';

// tslint:disable-next-line: no-any // arrayconstructor safely wraps scalar type
type anyArrayType = any;

/**
 * Converter from typed class to json plain object.
 * @param T The object type to create
 */
export class JsonObjectMarshaller<T> implements Marshaller<T, JSON> {
	/**
	 * Create marshaller instance with an annotated type.
	 *
	 * @param type the annotated type.
	 */
	constructor(private type: Constructor<T>) {}

	/**
	 * Get Json for the given object.
	 *
	 * @param object the object to serialize.
	 * @return the serialized variant.
	 */
	marshal(object: T): JSON {
		const array = (<ArrayConstructor<T, anyArrayType>>this.type).type !== undefined;
		const ctype = array ? (<ArrayConstructor<T, anyArrayType>>this.type).type : <ScalarConstructor<T>>this.type;
		return jsonConvert(object, ctype, false, type => new JsonObjectMarshaller(type), (v, converter) => converter.marshal(v), array);
	}
}
