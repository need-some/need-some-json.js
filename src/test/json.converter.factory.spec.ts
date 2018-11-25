import { JsonConverterFactory } from '../module/json.converter.factory';
import { TestObj } from './testobj.to.mock.spec';
import { Color } from '@need-some/basic';
import { JsonMarshaller } from '../module/json.marshaller';
import { JsonUnmarshaller } from '../module/json.unmarshaller';

describe('JsonConverterFactory', () => {
	it('unmarshal json', () => {
		const input = '{"mycolor": "#ff0000@.5"}';
		const sut = new JsonConverterFactory();
		const result = sut.createConverter({ type: TestObj }).unmarshal(input);
		expect((<TestObj>result).color.alpha).toBe(128);
	});
	it('marshal json', () => {
		const input = {
			color: new Color('#ff0000@.5')
		};
		const sut = new JsonConverterFactory();
		const result = sut.createConverter({ type: TestObj }).marshal(<TestObj>input);
		expect(result === '{"mycolor":"#ff000080","_type":"T1"}' || result === '{"_type":"T1","mycolor":"#ff000080"}').toBeTruthy(
			result + ' should match {"mycolor":"#ff000080","_type":"T1"}'
		);
	});
});
