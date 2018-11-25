import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { AnnotationProcessor } from './annotation-processor';

/**
 * Key of the annotation
 */
const formatMetadataKey = 'annotations.JsonOptional';

/**
 * Mark member to be an optional member of the class. Will be converted to undefined
 * @returns annotation metadata
 */
export function JsonOptional(): Metadata {
	return AnnotationProcessor.registerAnnotation(formatMetadataKey);
}
