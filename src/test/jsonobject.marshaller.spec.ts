import { toBeSameJsonMatcher, xexpect } from '@need-some/test';
import { JsonObjectMarshaller } from '../module/jsonobject.marshaller';
import { AbstractTo, TestObj, TestChild, TestObj2 } from './testobj.to.mock.spec';
import { Color } from '@need-some/basic/types';
import { asArray } from '@need-some/basic';

describe('JsonObjectMarshaller', () => {
	it('marshal json', () => {
		const input = new TestObj();
		input.id = 77;
		input.name = 'parent';
		input.child = new TestChild();
		input.child.id = 123;
		input.child.name = 'child';
		input.color = new Color(255, 204, 0, 255);
		const expected = {
			_type: 'T1',
			id: 77,
			name: 'parent',
			child: {
				_type: 'TC',
				id: 123,
				name: 'child'
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
		input.child.name = 'child';
		input.color = new Color(255, 204, 0, 255);
		const expected = {
			_type: 'T1',
			id: 77,
			name: 'parent',
			child: {
				_type: 'TC',
				id: 123,
				name: 'child'
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
		input.child.name = 'child';
		input.child.children = [new TestChild()];
		input.child.children[0].id = 124;
		input.child.children[0].name = 'grandchild';
		input.color = new Color(255, 204, 0, 255);
		const expected = {
			_type: 'T1',
			id: 77,
			name: 'parent',
			child: {
				_type: 'TC',
				id: 123,
				name: 'child',
				children: [
					{
						_type: 'TC',
						id: 124,
						name: 'grandchild'
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
		input.child.children[1].name = 'grandchild';
		const expected = {
			_type: 'T1',
			child: {
				_type: 'TC',
				children: [
					{
						_type: 'TC',
						id: 124,
						name: 'grandchild'
					}
				]
			},
			mycolor: null
		};
		const sut = new JsonObjectMarshaller(TestObj);
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
	it('unmarshal json array', () => {
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
	it('unmarshal json multitype array', () => {
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
	it('unmarshal json one item array', () => {
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
	it('unmarshal empty json array', () => {
		const input = [];
		const expected = [];
		const sut = new JsonObjectMarshaller(asArray(TestObj));
		const result = sut.marshal(input);
		xexpect(result).toBeSameJson(expected);
	});
});
