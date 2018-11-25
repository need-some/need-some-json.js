# need-some-json.js
[![Build Status](https://travis-ci.org/need-some/need-some-json.js.svg?branch=master)](https://travis-ci.org/need-some/need-some-json.js)

_need-some_ is a collection of small yet useful functions.
The json package provides typed json binding

## Installation
Simply install as dependency

	npm install @need-some/json --save

### Usage

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

##### @JsonElement
Simple annotation denoting an element to be a json element. Optional, if no renaming of the member is done. and other json annotations are present.

	@JsonElement()
	id: number;
	
	@JsonElement('nameInJson')
	nameInObj: string;

##### @JsonChild
Define class of member to delegate to new JsonConverter for the given class.

	@JsonChild(ChildClass)
	nameInObj: ChildClass;

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

