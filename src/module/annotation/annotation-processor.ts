import { Metadata, AnnotationMethod } from './metadata.type';
import { JsonElement } from './json-element.annotation';
import { ScalarConstructor } from '@need-some/basic';

/**
 * Type wrapping any for annotation params
 */
// tslint:disable-next-line: no-any // the annotation can define any param
export type anyAnnotationParam = any;

/**
 * Type wrapping any for processed objects
 */
// tslint:disable-next-line: no-any // any object can be processed
export type anyAnnotatedObject = any;

/**
 * Helper functions for processing the json annotations
 */
export class AnnotationProcessor {
	/**
	 * Cache of member names per type
	 */
	private static membercache = {};

	/**
	 * Cache of different json names per type member
	 */
	private static memberinverse = {};

	/**
	 * Flag indicating if a type and its super classes is processed
	 */
	private static memberprocessed = {};

	/**
	 * Insert a member name to the cache
	 * @param typeName name of the type
	 * @param member name of the member
	 * @param inverseName optional name of the member in json
	 */
	private static cacheMember(typeName: string, member: string, inverseName?: string): void {
		if (!AnnotationProcessor.membercache[typeName]) {
			AnnotationProcessor.membercache[typeName] = [];
		}
		if (!AnnotationProcessor.membercache[typeName].includes(member)) {
			AnnotationProcessor.membercache[typeName].push(member);
			AnnotationProcessor.membercache[typeName].sort();
		}
		if (inverseName !== undefined) {
			this.memberinverse[inverseName] = member;
		}
	}

	/**
	 * Compute the name of the metadata key of an annotation method
	 * @param annotation the annotation method
	 * @returns name of the metadata
	 */
	private static annotationName(annotation: AnnotationMethod): string {
		// tslint:disable-next-line: no-any // method has a name
		return 'annotations.' + (<any>annotation).name;
	}

	/**
	 * Get classname of an object prototype
	 * @param prototype the class prototype
	 * @returns class name
	 */
	private static getClassName(prototype: anyAnnotatedObject): string {
		return prototype.constructor.name;
	}

	/**
	 * Get all extended classnames of an object
	 * @param obj the object to look up
	 * @returns list of class names
	 */
	private static getClassNames(obj: anyAnnotatedObject): string[] {
		const classNames = [];
		let prototype = Object.getPrototypeOf(obj);
		let className: string;

		while ((className = AnnotationProcessor.getClassName(prototype)) !== 'Object') {
			classNames.push(className);
			prototype = Object.getPrototypeOf(prototype);
		}

		return classNames;
	}

	/**
	 * Register member and param of an annotation
	 * @param formatMetadataKey the annotation metadata key
	 * @param param optional params of the annotation
	 * @param inverseName optional different name of the member in the json representation
	 * @returns Metadata processing function
	 */
	static registerAnnotation(formatMetadataKey: string, param?: anyAnnotationParam, inverseName?: string) {
		param = param === undefined ? {} : param;
		const result = Reflect.metadata(formatMetadataKey, param);
		const decoratedResult = (target, propertyKey) => {
			if (propertyKey !== undefined) {
				// undefined propertyKey shows annotation is declared on class
				AnnotationProcessor.cacheMember(target.constructor.name, propertyKey, inverseName);
			} else {
				if (target.annotationMetadata === undefined) {
					target.annotationMetadata = {};
				}
				target.annotationMetadata[target.name + '.' + formatMetadataKey] = param;
			}
			return result(target, propertyKey);
		};
		return <Metadata>decoratedResult;
	}

	/**
	 * Check whether the annotation is present on the member
	 * @param annotation the annotation method
	 * @param type the type to check
	 * @param member optional member name. if undefined, the annotation is checked on class level
	 * @returns boolean indicating if annotation is present
	 */
	static hasAnnotations<T>(annotation: AnnotationMethod, type: ScalarConstructor<T>, member?: string): boolean {
		return AnnotationProcessor.getParams(annotation, type, member) !== undefined;
	}

	/**
	 * Get parameters defined on the annotation. Undefined if annotation is not present.
	 * An empty object is returned if no parameter is defined for the annotation
	 * @param annotation the annotation method
	 * @param type the type to check
	 * @param member optional member name. if undefined, the annotation is checked on class level
	 * @returns parameters given for the annotation
	 */
	static getParams<T>(annotation: AnnotationMethod, type: ScalarConstructor<T>, member?: string): anyAnnotationParam {
		const instance = new type();
		const formatMetadataKey = AnnotationProcessor.annotationName(annotation);
		if (member !== undefined) {
			return Reflect.getMetadata(formatMetadataKey, instance, member);
			// tslint:disable-next-line: no-any // a constructor has a name
		} else if ((<any>type).annotationMetadata !== undefined) {
			return (
				AnnotationProcessor.getClassNames(instance)
					// tslint:disable-next-line: no-any // a constructor has a name
					.map(name => (<any>type).annotationMetadata[name + '.' + formatMetadataKey])
					.filter(p => p !== undefined)[0]
			);
		}
	}

	/**
	 * Get list of members in the given type. The members are collected by inspecing the
	 * annotations on the type. Additional present members in the given object are ignored.
	 * The members are returned from the perspective of the class, not the json member names.
	 * @param type the type to check
	 * @param obj the instance to process
	 * @param inverse if true, the given object is treated as json object. members of the object are renamed to the type names.
	 * @returns list of member names.
	 */
	static getMembers<T>(type: ScalarConstructor<T>, obj: anyAnnotatedObject, inverse: boolean): ReadonlyArray<string> {
		const instance = new type();
		// tslint:disable-next-line: no-any // a constructor has a name
		const constructor = <any>instance.constructor;
		const typename = constructor.name;
		if (!AnnotationProcessor.memberprocessed[typename]) {
			AnnotationProcessor.getClassNames(instance)
				.filter(classname => AnnotationProcessor.membercache[classname] !== undefined)
				.forEach(classname => {
					AnnotationProcessor.membercache[classname].forEach(member => AnnotationProcessor.cacheMember(typename, member));
				});
			AnnotationProcessor.memberprocessed[typename] = true;
		}
		return AnnotationProcessor.membercache[typename];
	}

	/**
	 * Get name of the corresponding members in the json.
	 * @param type the type to inspect
	 * @param member the member name in the type
	 * @returns member name in the json.
	 */
	static getJsonName<T>(type: ScalarConstructor<T>, member: string) {
		const elementParams = AnnotationProcessor.getParams(JsonElement, type, member);
		const result = elementParams !== undefined && elementParams.name !== undefined ? elementParams.name : member;
		return result;
	}
}
