# need-some-json.js
[![Build Status](https://travis-ci.org/need-some/need-some-json.js.svg?branch=master)](https://travis-ci.org/need-some/need-some-json.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40need-some%2Fjson.svg)](https://badge.fury.io/js/%40need-some%2Fjson)
[![need-some/json](https://img.shields.io/badge/need--some-json-ff69b4.svg)](https://www.npmjs.com/org/need-some)
[![Dependencies](https://david-dm.org/need-some/need-some-json.js/status.svg)](https://david-dm.org/need-some/need-some-json.js)

_need-some_ is a collection of small yet useful functions.
The json package provides typed json binding

## Installation
Simply install as dependency

	npm install @need-some/json --save

### Usage

Use JsonConverter to translate json strings to typed objects(using the concrete classes) and back.
The Json annotations cannot type check its annotated members, so it must be defined carefully. 

#### Create a converter

	class MyClass {
		id: number
	}

	const converter = new JsonConverter(MyClass);
	
	const json = converter.marshal(obj);
	
	const obj2 = converter.unmarshal(json);

#### JsonMarshaller
Instance to convert objects to json strings.

#### JsonMarshaller
Instance to convert json strings to objects.

##### JsonConverter
Bot Marshaller and Unmarshaller

#### Binding annotations

##### Force Classname
If running minified code, the marshaller is not able to find the class name and adds members to random class descriptors.
To mitigate or allow multiple classes to be named identical, add a static member to the class:

	static __JSON__CLASSNAME = 'SomeReallyUniqueName';

##### @JsonElement
Simple annotation denoting an element to be a json element. Optional, if no renaming of the member is done. and other json annotations are present.

	@JsonElement()
	id: number;
	
	@JsonElement('nameInJson')
	nameInObj: string;

##### @JsonNull
Define member to be nullable. The json representation is the "null" json value

	@JsonNull()
	nember: string | null;

##### @JsonOptional
Define member to be optional. The json will not contain the key if the object representation is undefined.

	@JsonOptional()
	nember?: string;

##### @JsonChild
Define class of member to delegate to new JsonConverter for the given class.

	@JsonChild(ChildClass)
	child: ChildClass;

##### @JsonEnum
Define enum type of member. The Json representation is the string key.

	@JsonEnum(Enum)
	nember: Enum;

##### @JsonDiscriminator
Mark member to be the discriminator member of a super class. Should be used on string members.
Note that the type can be private to the parent class and will be set when performing a conversion

	@JsonDiscriminator()
	private type: string

##### @JsonDiscriminatorValue
Set value to identify subclass in the discriminator member

	@JsonDiscriminatorValue('CAR')
	class Car extends Vehicle

##### @JsonTypes
List all subclasses of the given class. Given as function, so declaration before the actual child classes is possible

	@JsonTypes(()=>[Car, Motorbike])
	class Vehicle

##### @JsonTransform
Declare a converter to be used when processing the member. A converter has a marshal and an unmarshal function.
The parameter may be a converter instance, converter constructor or a converter factory or even a converter factory constructor

	@JsonTransform(DateConverter)
	date:Date;

