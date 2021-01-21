import { toBeSameJsonMatcher, xexpect } from '@need-some/test';
import { JsonObjectUnmarshaller } from '../module/jsonobject.unmarshaller';
import { TestObj, AbstractTo } from './testobj.to.mock.spec';
import { asArray } from '@need-some/basic';

describe('JsonObjectUnmarshaller', () => {
	it('unmarshal json', () => {
		const input = {
			_type: 'T1',
			id: 55,
			name: 'the name',
			child: {
				id: 88,
				childname: 'the child',
				age: 22
			},
			mycolor: '#cccc00'
		};
		const expected = {
			type: 'T1',
			id: 55,
			name: 'the name',
			child: {
				type: 'TC',
				id: 88,
				childname: 'the child',
				childage: 22
			},
			color: {
				_string: '#cccc00' //Note that the channels are not precomputed
			}
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json with abstract class', () => {
		const input = {
			_type: 'T1',
			id: 55,
			name: 'the name',
			child: {
				type: 'TC',
				id: 88,
				childname: 'the child',
				age: 23
			},
			mycolor: '#cccc00'
		};
		const expected = {
			type: 'T1',
			id: 55,
			name: 'the name',
			child: {
				type: 'TC',
				id: 88,
				childname: 'the child',
				childage: 23
			},
			color: {
				_string: '#cccc00' //Note that the channels are not precomputed
			}
		};
		const sut = new JsonObjectUnmarshaller(AbstractTo);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
		expect(result.constructor.name).toBe('TestObj');
	});
	it('unmarshal json with null', () => {
		const input = {
			_type: 'T1',
			mycolor: null
		};
		const expected = {
			type: 'T1',
			color: null
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json with unknown item', () => {
		const input = {
			_type: 'T1',
			unknown: 123,
			name: 'parent',
			mycolor: null
		};
		const expected = {
			type: 'T1',
			name: 'parent',
			color: null
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json with factory', () => {
		const input = {
			factorized: 'foo bar',
			mycolor: null
		};
		const expected = {
			type: 'T1',
			factorized: 'bar',
			color: null
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json with factory in child class', () => {
		const input = {
			_type: 'T1',
			factorized: 'foo bar',
			mycolor: null
		};
		const expected = {
			type: 'T1',
			factorized: 'bar',
			color: null
		};
		const sut = new JsonObjectUnmarshaller(AbstractTo);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json with array', () => {
		const input = {
			_type: 'T1',
			id: 55,
			name: 'the name',
			child: {
				id: 88,
				childname: 'the child',
				age: 82,
				children: [
					{
						id: 99,
						childname: 'the grandchild',
						age: 92
					}
				]
			},
			mycolor: '#cccc00'
		};
		const expected = {
			type: 'T1',
			id: 55,
			name: 'the name',
			child: {
				type: 'TC',
				id: 88,
				childname: 'the child',
				childage: 82,
				children: [
					{
						type: 'TC',
						id: 99,
						childname: 'the grandchild',
						childage: 92
					}
				]
			},
			color: {
				_string: '#cccc00' //Note that the channels are not precomputed
			}
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json with scalar item instead array', () => {
		const input = {
			_type: 'T1',
			id: 55,
			name: 'the name',
			child: {
				id: 88,
				childname: 'the child',
				age: 82,
				children: {
					id: 99,
					childname: 'the grandchild',
					age: 92
				}
			},
			mycolor: '#cccc00'
		};
		const expected = {
			type: 'T1',
			id: 55,
			name: 'the name',
			child: {
				type: 'TC',
				id: 88,
				childname: 'the child',
				childage: 82,
				children: [
					{
						type: 'TC',
						id: 99,
						childname: 'the grandchild',
						childage: 92
					}
				]
			},
			color: {
				_string: '#cccc00' //Note that the channels are not precomputed
			}
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json with one-item array instead scalar', () => {
		const input = {
			_type: 'T1',
			id: 55,
			name: ['the name'],
			mycolor: '#cccc00'
		};
		const expected = {
			type: 'T1',
			id: 55,
			name: 'the name',
			color: {
				_string: '#cccc00' //Note that the channels are not precomputed
			}
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json with undefined in array', () => {
		const input = {
			_type: 'T1',
			child: {
				children: [
					undefined,
					{
						id: 99,
						childname: 'the grandchild',
						age: 92
					}
				]
			},
			mycolor: null
		};
		const expected = {
			type: 'T1',
			child: {
				type: 'TC',
				children: [
					{
						type: 'TC',
						id: 99,
						childname: 'the grandchild',
						childage: 92
					}
				]
			},
			color: null
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json array', () => {
		const input = [
			{
				mycolor: '#cccc00'
			},
			{
				mycolor: '#ff0000'
			}
		];
		const expected = [
			{
				type: 'T1',
				color: {
					_string: '#cccc00'
				}
			},
			{
				type: 'T1',
				color: {
					_string: '#ff0000'
				}
			}
		];
		const sut = new JsonObjectUnmarshaller(asArray(TestObj));
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json multitype array', () => {
		const input = [
			{
				_type: 'T1',
				mycolor: '#cccc00'
			},
			{
				_type: 'T2',
				text: 'ignored child text'
			}
		];
		const expected = [
			{
				type: 'T1',
				color: {
					_string: '#cccc00'
				}
			},
			{
				type: 'T2'
			}
		];
		const sut = new JsonObjectUnmarshaller(asArray(AbstractTo));
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json one item array', () => {
		const input = [
			{
				mycolor: '#ff0000'
			}
		];
		const expected = [
			{
				type: 'T1',
				color: {
					_string: '#ff0000'
				}
			}
		];
		const sut = new JsonObjectUnmarshaller(asArray(TestObj));
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal empty json array', () => {
		const input = [];
		const expected = [];
		const sut = new JsonObjectUnmarshaller(asArray(TestObj));
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json one item array to scalar', () => {
		const input = [
			{
				mycolor: '#ff0000'
			}
		];
		const expected = {
			type: 'T1',
			color: {
				_string: '#ff0000'
			}
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json scalar to array', () => {
		const input = [
			{
				mycolor: '#ff0000'
			}
		];
		const expected = [
			{
				type: 'T1',
				color: {
					_string: '#ff0000'
				}
			}
		];
		const sut = new JsonObjectUnmarshaller(asArray(TestObj));
		const result: any = sut.unmarshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('fail unmarshalling json empty array to scalar', () => {
		const input = [];
		const sut = new JsonObjectUnmarshaller(TestObj);
		xexpect(() => sut.unmarshal(input)).toThrowError('Array not allowed for json: ');
	});

	it('fail unmarshalling json with missing members', () => {
		const input = {
			wrongcolor: '#cccc00'
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		expect(() => sut.unmarshal(input)).toThrowError('Missing member TestObj.color: ');
	});
	it('fail unmarshalling json with illegal null', () => {
		const input = {
			mycolor: '#cccc00',
			name: null
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		expect(() => sut.unmarshal(input)).toThrowError('Null not allowed for TestObj.name: null');
	});
	it('fail unmarshalling json with empty array instead of scalar', () => {
		const input = {
			mycolor: '#cccc00',
			name: []
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		expect(() => sut.unmarshal(input)).toThrowError('Array not allowed for member TestObj.name: ');
	});
	it('fail unmarshalling json with array instead of scalar', () => {
		const input = {
			mycolor: '#cccc00',
			name: ['a', 'b']
		};
		const sut = new JsonObjectUnmarshaller(TestObj);
		expect(() => sut.unmarshal(input)).toThrowError('Array not allowed for member TestObj.name: a,b');
	});
});
