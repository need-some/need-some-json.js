import { TestObj, AbstractTo } from './testobj.to.mock.spec';
import { Color, asArray } from '@need-some/basic';
import { JsonUnmarshaller } from '../module/json.unmarshaller';

describe('JsonUnmarshaller', () => {
	let saveParser;
	beforeEach(() => {
		saveParser = (<any>JsonUnmarshaller)._DEFAULT_PARSER;
	});
	afterEach(() => {
		(<any>JsonUnmarshaller)._DEFAULT_PARSER = saveParser;
	});

	it('unmarshal json', () => {
		const input = '{"mycolor": "#ff0000@.5"}';
		const sut = new JsonUnmarshaller(TestObj);
		const result = sut.unmarshal(input);
		expect(result.color.alpha).toBe(128);
	});

	it('unmarshal json array', () => {
		const input = '[{"mycolor": "#ff0000@.5"}, {"mycolor": "#ff0000"}]';
		const sut = new JsonUnmarshaller(asArray(TestObj));
		const result = sut.unmarshal(input);
		expect(result.length).toBe(2);
		expect(result[0].color.alpha).toBe(128);
		expect(result[0].color.red).toBe(255);
		expect(result[1].color.alpha).toBe(255);
		expect(result[1].color.red).toBe(255);
	});

	it('unmarshal json with superclass', () => {
		const input = '{"_type": "T1", "mycolor": "#ff0000@.5"}';
		const sut = new JsonUnmarshaller(AbstractTo);
		const result = sut.unmarshal(input);
		expect((<any>result.constructor).name).toBe('TestObj');
		expect((<TestObj>result).color.alpha).toBe(128);
	});

	it('unmarshal json with object input', () => {
		const input = {
			mycolor: '#cccc00@.5'
		};
		const sut = new JsonUnmarshaller(TestObj);
		const result = sut.unmarshal(<any>input);
		expect(result.color.alpha).toBe(128);
	});

	it('unmarshal json with custom parser', () => {
		const input = '{"mycolor": "#ff0000@.5"}';
		const sut = new JsonUnmarshaller(TestObj, s => {
			return { name: 'hallo', mycolor: null };
		});
		const result = sut.unmarshal(input);
		expect(result.color).toBeNull();
		expect(result.name).toBe('hallo');
	});

	it('unmarshal json with default custom parser', () => {
		JsonUnmarshaller.DEFAULT_PARSER = s => {
			return { name: 'hallo default', mycolor: null };
		};
		const input = '{"mycolor": "#ff0000@.5"}';
		const sut = new JsonUnmarshaller(TestObj);
		const result = sut.unmarshal(input);
		expect(result.color).toBeNull();
		expect(result.name).toBe('hallo default');
	});

	it('unmarshal json with standard parser after resetting default', () => {
		JsonUnmarshaller.DEFAULT_PARSER = s => {
			return { name: 'hallo default' };
		};
		JsonUnmarshaller.DEFAULT_PARSER = undefined;
		const input = '{"mycolor": "#ff0000@.5"}';
		const sut = new JsonUnmarshaller(TestObj);
		const result = sut.unmarshal(input);
		expect(result.color.alpha).toBe(128);
	});

	it('get standard default parser', () => {
		expect(JsonUnmarshaller.DEFAULT_PARSER).toBe(saveParser);
	});

	it('get custom default parser', () => {
		const customParser = a => 'default custom format';
		JsonUnmarshaller.DEFAULT_PARSER = customParser;
		expect(JsonUnmarshaller.DEFAULT_PARSER).toBe(customParser);
	});

	it('get standard default parser after reset', () => {
		const customParser = a => 'default custom format';
		JsonUnmarshaller.DEFAULT_PARSER = customParser;
		JsonUnmarshaller.DEFAULT_PARSER = undefined;
		expect(JsonUnmarshaller.DEFAULT_PARSER).toBe(saveParser);
	});

	it('fail unmarshalling json with unknown discriminator', () => {
		const input = '{"_type": "X", "mycolor": "#ff0000@.5"}';
		const sut = new JsonUnmarshaller(AbstractTo);
		expect(() => sut.unmarshal(input)).toThrowError('Wrong discriminator for subtype: AbstractTo/X');
	});

	it('fail unmarshalling json with unparseable input', () => {
		const input = '{"a string"';
		const sut = new JsonUnmarshaller(AbstractTo);
		expect(() => sut.unmarshal(input)).toThrowError('Unexpected end of JSON input');
	});

	it('fail unmarshalling json with wrong type', () => {
		const input = '"a string"';
		const sut = new JsonUnmarshaller(AbstractTo);
		expect(() => sut.unmarshal(input)).toThrowError('Cannot handle json type: string');
	});
});
