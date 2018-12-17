import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { anyType } from '../types';
import { JsonTransform } from './json-transform.annotation';
import { EnumStringConverter } from '@need-some/basic';

/**
 * Mark member to be an enum of the given class.
 * @param type the enum type of the member
 * @returns annotation metadata
 */
export function JsonEnum<T>(type: anyType): Metadata {
	return JsonTransform(new EnumStringConverter(type));
}
