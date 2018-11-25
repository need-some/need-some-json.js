/**
 * return type of an annotation function
 */
export interface Metadata {
	(target: Function): void;
	(target: Object, propertyKey: string | symbol): void;
}

/**
 * Type of an annotation merthod
 */
// tslint:disable-next-line: no-any // the annotation can define any param
export type AnnotationMethod = (...args: any[]) => Metadata;
