import { JsonConverter } from '../module/json.converter';
import { TestObj, AbstractTo } from './testobj.to.mock.spec';
import { Color } from '@need-some/basic';
import { JsonMarshaller } from '../module/json.marshaller';

describe('JsonMarshaller', () => {
	let saveFormatter;
	beforeEach(() => {
		saveFormatter = (<any>JsonMarshaller)._DEFAULT_FORMATTER;
	});
	afterEach(() => {
		(<any>JsonMarshaller)._DEFAULT_FORMATTER = saveFormatter;
	});

	it('marshal json', () => {
		const input = { color: new Color('#ff0000@.5') };
		const sut = new JsonConverter(TestObj);
		const result = sut.marshal(<TestObj>input);
		expect(result === '{"mycolor":"#ff000080","_type":"T1"}' || result === '{"_type":"T1","mycolor":"#ff000080"}').toBeTruthy(
			result + ' should match {"mycolor":"#ff000080","_type":"T1"}'
		);
	});

	it('marshal json with superclass', () => {
		const input = new TestObj();
		input.color = new Color('#ff0000@.5');
		const sut = new JsonConverter(AbstractTo);
		const result = sut.marshal(input);
		expect(result === '{"mycolor":"#ff000080","_type":"T1"}' || result === '{"_type":"T1","mycolor":"#ff000080"}').toBeTruthy(
			result + ' should match {"mycolor":"#ff000080","_type":"T1"}'
		);
	});

	it('marshal json with custom formatter', () => {
		const input = { color: new Color('#ff0000@.5') };
		const sut = new JsonMarshaller(TestObj, a => 'custom format');
		const result = sut.marshal(<TestObj>input);
		expect(result).toBe('custom format');
	});

	it('marshal json with default custom formatter', () => {
		JsonMarshaller.DEFAULT_FORMATTER = a => 'default custom format';
		const input = { color: new Color('#ff0000@.5') };
		const sut = new JsonMarshaller(TestObj);
		const result = sut.marshal(<TestObj>input);
		expect(result).toBe('default custom format');
	});

	it('marshal json with standard formatter after resetting default', () => {
		JsonMarshaller.DEFAULT_FORMATTER = a => 'default custom format';
		JsonMarshaller.DEFAULT_FORMATTER = undefined;
		const input = { color: new Color('#ff0000@.5') };
		const sut = new JsonConverter(TestObj);
		const result = sut.marshal(<TestObj>input);
		expect(result === '{"mycolor":"#ff000080","_type":"T1"}' || result === '{"_type":"T1","mycolor":"#ff000080"}').toBeTruthy(
			result + ' should match {"mycolor":"#ff000080","_type":"T1"}'
		);
	});

	it('get standard default formatter', () => {
		expect(JsonMarshaller.DEFAULT_FORMATTER).toBe(saveFormatter);
	});

	it('get custom default formatter', () => {
		const customFormatter = a => 'default custom format';
		JsonMarshaller.DEFAULT_FORMATTER = customFormatter;
		expect(JsonMarshaller.DEFAULT_FORMATTER).toBe(customFormatter);
	});

	it('get standard default formatter after reset', () => {
		const customFormatter = a => 'default custom format';
		JsonMarshaller.DEFAULT_FORMATTER = customFormatter;
		JsonMarshaller.DEFAULT_FORMATTER = undefined;
		expect(JsonMarshaller.DEFAULT_FORMATTER).toBe(saveFormatter);
	});
});
