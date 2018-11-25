import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { AnnotationProcessor } from './annotation-processor';

/**
 * Key of the annotation
 */
const formatMetadataKey = 'annotations.JsonNull';

/**
 * Mark member to be a nullable member of the class. Null is transferred as a defined json null member.
 * @returns annotation metadata
 */
export function JsonNull(): Metadata {
	return AnnotationProcessor.registerAnnotation(formatMetadataKey);
}
