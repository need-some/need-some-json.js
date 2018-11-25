import 'reflect-metadata';
import { Metadata } from './metadata.type';
import { AnnotationProcessor } from './annotation-processor';
import { ScalarConstructor } from '@need-some/basic';

/**
 * Key of the annotation
 */
const formatMetadataKey = 'annotations.JsonTypes';

/**
 * the annotation can define any type
 */
// tslint:disable-next-line: no-any // the annotation can define any type
export type anyType = any;

/**
 * List all subclasses of the given class. Given as function, so declaration before the actual child classes is possible
 * @param types function ()=>constructor[] that creates list of possible subclasses
 * @returns annotation metadata
 */
export function JsonTypes(types: (() => ScalarConstructor<anyType>[])): Metadata {
	return AnnotationProcessor.registerAnnotation(formatMetadataKey, { types: types });
}
