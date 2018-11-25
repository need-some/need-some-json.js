import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { AnnotationProcessor } from './annotation-processor';

/**
 * Key of the annotation
 */
const formatMetadataKey = 'annotations.JsonDiscriminator';

/**
 * Mark member to be the discriminator member of a super class. Should be used on string members.
 * Note that the type can be private to the parent class and will be set when performing a conversion
 * @returns annotation metadata
 */
export function JsonDiscriminator(): Metadata {
	return AnnotationProcessor.registerAnnotation(formatMetadataKey);
}
