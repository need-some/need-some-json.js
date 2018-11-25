/**
 * Dummy type replacing any for json.
 */
// tslint:disable-next-line: no-any // JSON may be any object
export type JSON = any;

/**
 * Function to format json object to string
 */
export type JsonFormatter = ((json: JSON) => string);

/**
 * Function to parse json object from string
 */
export type JsonParser = ((s: string) => JSON);
