export function prettyJson(value: any): any {
  if (!value) {
    return value;
  }
  let obj;
  if (typeof value === 'string') {
    obj = JSON.parse(value);
  } else {
    obj = value;
  }
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return value;
  }
}
