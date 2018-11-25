import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { AnnotationProcessor } from './annotation-processor';

/**
 * Key of the annotation
 */
const formatMetadataKey = 'annotations.JsonDiscriminatorValue';

/**
 * Set value to identify subclass in the discriminator member.
 * @param value discriminator value to denote the annotated subclass
 * @returns annotation metadata
 */
export function JsonDiscriminatorValue<T>(value: string): Metadata {
	const result = AnnotationProcessor.registerAnnotation(formatMetadataKey, { value: value });
	const decoratedResult = (target, propertyKey) => {
		// add value to the constructor, so it can be read afterwards
		target.constructor.discriminatorValue = value;
		target.prototype.constructor.discriminatorValue = value;
		return result(target, propertyKey);
	};
	return <Metadata>decoratedResult;
}
