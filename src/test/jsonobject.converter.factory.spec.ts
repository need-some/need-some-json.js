import { JsonObjectConverterFactory } from '../module/jsonobject.converter.factory';
import { TestObj } from './testobj.to.mock.spec';
import { Color } from '@need-some/basic';

describe('JsonConverterFactory', () => {
	it('unmarshal json', () => {
		const input = {
			mycolor: '#ff0000@.5'
		};
		const sut = new JsonObjectConverterFactory();
		const result: any = sut.createConverter({ type: TestObj }).unmarshal(input);
		expect(result.color.alpha).toBe(128);
	});
	it('marshal json', () => {
		const input = {
			color: new Color('#ff0000@.5')
		};
		const sut = new JsonObjectConverterFactory();
		const result: any = sut.createConverter({ type: TestObj }).marshal(<TestObj>input);
		expect(result.mycolor).toBe('#ff000080');
	});
});
