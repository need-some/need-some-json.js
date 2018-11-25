import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { AnnotationProcessor } from './annotation-processor';
import { ScalarConstructor } from '@need-some/basic';

/**
 * Key of the annotation
 */
const formatMetadataKey = 'annotations.JsonChild';

/**
 * Define class of member to delegate to new JsonConverter for the given class.
 * @param type the constructor of an instance of the member
 * @returns annotation metadata
 */
export function JsonChild<T>(type: ScalarConstructor<T>): Metadata {
	return AnnotationProcessor.registerAnnotation(formatMetadataKey, { type: type });
}
