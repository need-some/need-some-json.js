import { Unmarshaller, ArrayConstructor, ScalarConstructor, Constructor } from '@need-some/basic';
import { JSON } from './types';
import { jsonConvert } from './json.convert';

// tslint:disable-next-line: no-any // arrayconstructor safely wraps scalar type
type anyArrayType = any;

/**
 * Converter from typed class to json plain object.
 * @param T The object type to create
 */
export class JsonObjectUnmarshaller<T> implements Unmarshaller<T, JSON> {
	/**
	 * Create unmarshaller instance with an annotated type.
	 *
	 * @param type the annotated type.
	 */
	constructor(private type: Constructor<T>) {}

	/**
	 * Create object instance for the given json string.
	 *
	 * @param serialized the json string.
	 * @return the object instance.
	 */
	unmarshal(serialized: JSON): T {
		const array = (<ArrayConstructor<T, anyArrayType>>this.type).type !== undefined;
		const ctype = array ? (<ArrayConstructor<T, anyArrayType>>this.type).type : <ScalarConstructor<T>>this.type;
		return jsonConvert(serialized, ctype, true, type => new JsonObjectUnmarshaller(type), (v, converter) => converter.unmarshal(v), array);
	}
}
