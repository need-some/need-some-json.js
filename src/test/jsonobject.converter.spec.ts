import { JsonObjectConverter } from '../module/jsonobject.converter';
import { TestObj } from './testobj.to.mock.spec';
import { Color } from '@need-some/basic';

describe('JsonConverter', () => {
	it('unmarshal json', () => {
		const input = {
			mycolor: '#ff0000@.5'
		};
		const sut = new JsonObjectConverter(TestObj);
		const result: any = sut.unmarshal(input);
		expect(result.color.alpha).toBe(128);
	});
	it('marshal json', () => {
		const input = {
			color: new Color('#ff0000@.5')
		};
		const sut = new JsonObjectConverter(TestObj);
		const result: any = sut.marshal(<TestObj>input);
		expect(result.mycolor).toBe('#ff000080');
	});
});
