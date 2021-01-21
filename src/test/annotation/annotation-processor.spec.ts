import { toBeSameJsonMatcher, xexpect } from '@need-some/test';
import { AnnotationProcessor } from '../../module/annotation/annotation-processor';
import { JsonElement } from '../../module/annotation/json-element.annotation';
import { JsonChild } from '../../module/annotation/json-child.annotation';
import { JsonTypes } from '../../module/annotation/json-types.annotation';
import { JsonDiscriminatorValue } from '../../module/annotation/json-discriminator-value.annotation';

@JsonTypes(() => [ChildClass])
export class ParentClass {
	@JsonElement()
	imported: number;
}

@JsonDiscriminatorValue('Sibling')
export class ChildClass extends ParentClass {
	anonymous: string;

	@JsonElement()
	optional?: number;

	@JsonElement('renamed')
	rename: string;

	@JsonChild(ChildClass)
	child?: ChildClass[];
}

export class SiblingClass extends ParentClass {}

export class UnrelatedClass {
	anonymous: string;
}

@JsonTypes(() => [ChildSaveNameClass])
export class ParentSaveNameClass {
	static __JSON__CLASSNAME = 'SaveNameParent';

	@JsonElement()
	parentMember: number;
}

export class ChildSaveNameClass extends ParentSaveNameClass {
	static __JSON__CLASSNAME = 'SaveNameChild';

	@JsonElement()
	childMember: string;
}

describe('AnnotationProcessor', () => {
	let saveMembercache;
	let saveMemberinverse;
	let saveMemberprocessed;
	beforeEach(() => {
		saveMembercache = {};
		for (const key in (<any>AnnotationProcessor).membercache) {
			saveMembercache[key] = [...(<any>AnnotationProcessor).membercache[key]];
		}
		saveMemberinverse = { ...(<any>AnnotationProcessor).memberinverse };
		saveMemberprocessed = { ...(<any>AnnotationProcessor).memberprocessed };
	});
	afterEach(() => {
		(<any>AnnotationProcessor).membercache = saveMembercache;
		(<any>AnnotationProcessor).memberinverse = saveMemberinverse;
		(<any>AnnotationProcessor).memberprocessed = saveMemberprocessed;
	});

	describe('private', () => {
		describe('annotationName', () => {
			it('gets name of annotation', () => {
				expect((<any>AnnotationProcessor).annotationName(JsonElement)).toBe('annotations.JsonElement');
			});
		});
		describe('getClassName', () => {
			it('gets name of class', () => {
				expect((<any>AnnotationProcessor).getClassName(ChildClass.prototype)).toBe('ChildClass');
			});
			it('gets name of abstract class', () => {
				expect((<any>AnnotationProcessor).getClassName(ParentClass.prototype)).toBe('ParentClass');
			});
			it('gets save name of class', () => {
				expect((<any>AnnotationProcessor).getClassName(ChildSaveNameClass.prototype)).toBe('SaveNameChild');
			});
			it('gets save name of abstract class', () => {
				expect((<any>AnnotationProcessor).getClassName(ParentSaveNameClass.prototype)).toBe('SaveNameParent');
			});
		});
		describe('getClassNames', () => {
			it('gets names of class', () => {
				xexpect((<any>AnnotationProcessor).getClassNames(new ChildClass()).sort()).toBeSameJson(['ChildClass', 'ParentClass']);
			});
			it('gets name of abstract class', () => {
				xexpect((<any>AnnotationProcessor).getClassNames(new ParentClass())).toBeSameJson(['ParentClass']);
			});
			it('gets save names of class', () => {
				xexpect((<any>AnnotationProcessor).getClassNames(new ChildSaveNameClass()).sort()).toBeSameJson([
					'SaveNameChild',
					'SaveNameParent'
				]);
			});
			it('gets save name of abstract class', () => {
				xexpect((<any>AnnotationProcessor).getClassNames(new ParentSaveNameClass())).toBeSameJson(['SaveNameParent']);
			});
		});
	});

	describe('hasAnnotation', () => {
		it('checks existing annotation', () => {
			expect(AnnotationProcessor.hasAnnotations(JsonElement, ChildClass, 'optional')).toBeTruthy();
		});
		it('checks existing class annotation', () => {
			expect(AnnotationProcessor.hasAnnotations(JsonTypes, ParentClass)).toBeTruthy();
		});
		it('checks existing class annotation in child class', () => {
			expect(AnnotationProcessor.hasAnnotations(JsonTypes, ChildClass)).toBeTruthy();
		});
		it('checks missing class annotation', () => {
			expect(AnnotationProcessor.hasAnnotations(JsonTypes, UnrelatedClass)).toBeFalsy();
		});
		it('denies missing annotation', () => {
			expect(AnnotationProcessor.hasAnnotations(JsonChild, ChildClass, 'optional')).toBeFalsy();
		});
	});

	describe('getParams', () => {
		it('returns empty param', () => {
			xexpect(AnnotationProcessor.getParams(JsonElement, ChildClass, 'optional')).toBeSameJson({});
		});
		it('returns given param', () => {
			xexpect(AnnotationProcessor.getParams(JsonElement, ChildClass, 'rename')).toBeSameJson({ name: 'renamed' });
		});
		it('returns undefined for missing annotation', () => {
			xexpect(AnnotationProcessor.getParams(JsonChild, ChildClass, 'anonymous')).toBeUndefined();
		});
		it('returns param of class annotation', () => {
			expect(
				AnnotationProcessor.getParams(JsonTypes, ParentClass)
					.types()
					.map(t => t.name)[0]
			).toBe('ChildClass');
		});
		it('returns param of class annotation in child class', () => {
			expect(
				AnnotationProcessor.getParams(JsonTypes, ChildClass)
					.types()
					.map(t => t.name)[0]
			).toBe('ChildClass');
		});
		it('returns param for child class annotation', () => {
			expect(AnnotationProcessor.getParams(JsonDiscriminatorValue, ChildClass).value).toBe('Sibling');
		});
		it('returns undefined for parent class annotation', () => {
			expect(AnnotationProcessor.getParams(JsonDiscriminatorValue, SiblingClass)).toBeUndefined();
		});
		it('returns undefined for sibling class annotation', () => {
			expect(AnnotationProcessor.getParams(JsonDiscriminatorValue, ParentClass)).toBeUndefined();
		});
	});

	describe('getMembers', () => {
		it('returns members', () => {
			xexpect(AnnotationProcessor.getMembers(ParentClass)).toBeSameJson(['imported']);
		});
		it('returns members of subclass', () => {
			xexpect(AnnotationProcessor.getMembers(ChildClass)).toBeSameJson(['child', 'imported', 'optional', 'rename']);
		});
		it('returns members of save class', () => {
			xexpect(AnnotationProcessor.getMembers(ParentSaveNameClass)).toBeSameJson(['parentMember']);
		});
		it('returns members of save subclass', () => {
			xexpect(AnnotationProcessor.getMembers(ChildSaveNameClass)).toBeSameJson(['childMember', 'parentMember']);
		});
		it('returns members with unknown member', () => {
			xexpect(AnnotationProcessor.getMembers(ChildClass)).toBeSameJson(['child', 'imported', 'optional', 'rename']);
		});
		it('returns members with renamed member inverse', () => {
			xexpect(AnnotationProcessor.getMembers(ChildClass)).toBeSameJson(['child', 'imported', 'optional', 'rename']);
		});
		it('returns members with unknown member inverse', () => {
			xexpect(AnnotationProcessor.getMembers(ChildClass)).toBeSameJson(['child', 'imported', 'optional', 'rename']);
		});
	});

	describe('getJsonName', () => {
		it('returns name for known member', () => {
			expect(AnnotationProcessor.getJsonName(ParentClass, 'id')).toBe('id');
		});
		it('returns name for unknown member', () => {
			expect(AnnotationProcessor.getJsonName(ParentClass, 'unknown')).toBe('unknown');
		});
		it('returns alternative name for renamed member', () => {
			expect(AnnotationProcessor.getJsonName(ChildClass, 'rename')).toBe('renamed');
		});
	});
});
