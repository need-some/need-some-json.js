import { JsonElement } from '../module/annotation/json-element.annotation';
import { JsonEnum } from '../module/annotation/json-enum.annotation';
import { JsonArray } from '../module/annotation/json-array.annotation';
import { JsonChild } from '../module/annotation/json-child.annotation';
import { JsonNull } from '../module/annotation/json-null.annotation';
import { JsonOptional } from '../module/annotation/json-optional.annotation';
import { JsonTransform } from '../module/annotation/json-transform.annotation';
import { JsonTypes } from '../module/annotation/json-types.annotation';
import { JsonDiscriminator } from '../module/annotation/json-discriminator.annotation';
import { JsonDiscriminatorValue } from '../module/annotation/json-discriminator-value.annotation';
import { Color, ColorConverter, Converter, ConverterFactory } from '@need-some/basic';

export class PrefixConverterFactory implements ConverterFactory<string, string, string> {
	createConverter(param: string): Converter<string, string> {
		return {
			marshal: function(obj) {
				return param + obj;
			},
			unmarshal: function(ser) {
				return ser.substr(param.length);
			}
		};
	}
}

@JsonTypes(() => [TestObj, TestObj2])
export class AbstractTo {
	@JsonDiscriminator()
	@JsonElement('_type')
	private type: string;

	@JsonElement()
	@JsonOptional()
	id: number;
}
@JsonDiscriminatorValue('TC')
export class TestChild extends AbstractTo {
	@JsonElement()
	@JsonOptional()
	name: string;
	@JsonChild(TestChild)
	@JsonOptional()
	@JsonArray()
	children: TestChild[];
}

export enum ValueEnum {
	ABC = 'ABC',
	DEF = 'DEF'
}

export enum NamedEnum {
	GHI,
	JKL
}

export enum NumberEnum {
	MNO = 1,
	PQR = 2
}

@JsonDiscriminatorValue('T1')
export class TestObj extends AbstractTo {
	@JsonElement()
	@JsonOptional()
	name: string;

	internal: number;

	@JsonElement('mycolor')
	@JsonTransform(ColorConverter)
	@JsonNull()
	color: Color | null;

	@JsonElement()
	@JsonEnum(ValueEnum)
	@JsonOptional()
	valueEnum?: ValueEnum;

	@JsonElement()
	@JsonEnum(NamedEnum)
	@JsonOptional()
	namedEnum?: NamedEnum;

	@JsonElement()
	@JsonEnum(NumberEnum)
	@JsonOptional()
	numberEnum?: NumberEnum;

	@JsonElement()
	@JsonTransform(PrefixConverterFactory, 'foo ')
	@JsonOptional()
	factorized: string;

	@JsonChild(TestChild)
	@JsonOptional()
	child?: TestChild;
}

@JsonDiscriminatorValue('T2')
export class TestObj2 extends AbstractTo {
	text: string;
}
