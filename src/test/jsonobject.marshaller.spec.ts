import { toBeSameJsonMatcher, xexpect } from '@need-some/test';
import { JsonObjectMarshaller } from '../module/jsonobject.marshaller';
import { AbstractTo, TestObj, TestChild, TestObj2, ValueEnum, NamedEnum } from './testobj.to.mock.spec';
import { Color } from '@need-some/basic/types';
import { asArray } from '@need-some/basic';

describe('JsonObjectMarshaller', () => {
	it('marshal json', () => {
		const input = new TestObj();
		input.id = 77;
		input.name = 'parent';
		input.child = new TestChild();
		input.child.id = 123;
		input.child.childname = 'child';
		input.child.childage = 5;
		input.color = new Color(255, 204, 0, 255);
		const expected = {
			_type: 'T1',
			id: 77,
			name: 'parent',
			child: {
				_type: 'TC',
				id: 123,
				childname: 'child',
				age: 5
			},
			mycolor: '#ffcc00'
		};
		const sut = new JsonObjectMarshaller(TestObj);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json with abstract class', () => {
		const input = new TestObj();
		input.id = 77;
		input.name = 'parent';
		input.child = new TestChild();
		input.child.id = 123;
		input.child.childname = 'child';
		input.child.childage = 5;
		input.color = new Color(255, 204, 0, 255);
		const expected = {
			_type: 'T1',
			id: 77,
			name: 'parent',
			child: {
				_type: 'TC',
				id: 123,
				childname: 'child',
				age: 5
			},
			mycolor: '#ffcc00'
		};
		const sut = new JsonObjectMarshaller(AbstractTo);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json with null', () => {
		const input = new TestObj();
		input.id = 77;
		input.name = 'parent';
		input.color = null;
		const expected = {
			_type: 'T1',
			id: 77,
			name: 'parent',
			mycolor: null
		};
		const sut = new JsonObjectMarshaller(TestObj);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json with unmapped item', () => {
		const input = new TestObj();
		input.id = 77;
		input.name = 'parent';
		input.color = null;
		input.internal = 77;
		const expected = {
			_type: 'T1',
			id: 77,
			name: 'parent',
			mycolor: null
		};
		const sut = new JsonObjectMarshaller(TestObj);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json with string enum', () => {
		const input = new TestObj();
		input.id = 77;
		input.color = null;
		input.valueEnum = ValueEnum.DEF;
		const expected = {
			_type: 'T1',
			id: 77,
			valueEnum: 'DEF',
			mycolor: null
		};
		const sut = new JsonObjectMarshaller(TestObj);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json with named enum', () => {
		const input = new TestObj();
		input.id = 77;
		input.color = null;
		input.namedEnum = NamedEnum.JKL;
		const expected = {
			_type: 'T1',
			id: 77,
			namedEnum: 'JKL',
			mycolor: null
		};
		const sut = new JsonObjectMarshaller(TestObj);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json with factory', () => {
		const input = new TestObj();
		input.color = null;
		input.factorized = 'bar';
		const expected = {
			_type: 'T1',
			factorized: 'foo bar',
			mycolor: null
		};
		const sut = new JsonObjectMarshaller(TestObj);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json with factory in child class', () => {
		const input = new TestObj();
		input.color = null;
		input.factorized = 'bar';
		const expected = {
			_type: 'T1',
			factorized: 'foo bar',
			mycolor: null
		};
		const sut = new JsonObjectMarshaller(AbstractTo);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json with array', () => {
		const input = new TestObj();
		input.id = 77;
		input.name = 'parent';
		input.child = new TestChild();
		input.child.id = 123;
		input.child.childname = 'child';
		input.child.childage = 5;
		input.child.children = [new TestChild()];
		input.child.children[0].id = 124;
		input.child.children[0].childname = 'grandchild';
		input.child.children[0].childage = 17;
		input.color = new Color(255, 204, 0, 255);
		const expected = {
			_type: 'T1',
			id: 77,
			name: 'parent',
			child: {
				_type: 'TC',
				id: 123,
				childname: 'child',
				age: 5,
				children: [
					{
						_type: 'TC',
						id: 124,
						childname: 'grandchild',
						age: 17
					}
				]
			},
			mycolor: '#ffcc00'
		};
		const sut = new JsonObjectMarshaller(TestObj);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json with undefined in array', () => {
		const input = new TestObj();
		input.color = null;
		input.child = new TestChild();
		input.child.children = [undefined, new TestChild()];
		input.child.children[1].id = 124;
		input.child.children[1].childname = 'grandchild';
		input.child.children[1].childage = 29;
		const expected = {
			_type: 'T1',
			child: {
				_type: 'TC',
				children: [
					{
						_type: 'TC',
						id: 124,
						childname: 'grandchild',
						age: 29
					}
				]
			},
			mycolor: null
		};
		const sut = new JsonObjectMarshaller(TestObj);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json array', () => {
		const input = [new TestObj(), new TestObj()];
		input[0].color = new Color(255, 204, 0, 255);
		input[1].color = new Color(255, 204, 0, 128);
		const expected = [
			{
				_type: 'T1',
				mycolor: '#ffcc00'
			},
			{
				_type: 'T1',
				mycolor: '#ffcc0080'
			}
		];
		const sut = new JsonObjectMarshaller(asArray(TestObj));
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json multitype array', () => {
		const input = [new TestObj(), new TestObj2()];
		(<TestObj>input[0]).color = new Color(255, 204, 0, 255);
		(<TestObj2>input[1]).text = 'ignored text';
		const expected = [
			{
				_type: 'T1',
				mycolor: '#ffcc00'
			},
			{
				_type: 'T2'
			}
		];
		const sut = new JsonObjectMarshaller(asArray(AbstractTo));
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal json one item array', () => {
		const input = [new TestObj()];
		input[0].color = new Color(255, 204, 0, 255);
		const expected = [
			{
				_type: 'T1',
				mycolor: '#ffcc00'
			}
		];
		const sut = new JsonObjectMarshaller(asArray(TestObj));
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('marshal empty json array', () => {
		const input = [];
		const expected = [];
		const sut = new JsonObjectMarshaller(asArray(TestObj));
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
});
