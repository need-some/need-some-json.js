import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { AnnotationProcessor } from './annotation-processor';

/**
 * Key of the annotation
 */
const formatMetadataKey = 'annotations.JsonElement';

/**
 * Simple annotation denoting an element to be a json element. Optional, if no renaming of the member is done
 * @param name name of the member in the json
 * @returns annotation metadata
 */
export function JsonElement(name?: string): Metadata {
	return AnnotationProcessor.registerAnnotation(formatMetadataKey, { name: name }, name);
}
