import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { AnnotationProcessor } from './annotation-processor';

/**
 * Key of the annotation
 */
const formatMetadataKey = 'annotations.JsonArray';

/**
 * Mark member to be an array.
 * @returns annotation metadata
 */
export function JsonArray(): Metadata {
	return AnnotationProcessor.registerAnnotation(formatMetadataKey);
}
