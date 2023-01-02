/**
 * transforms [{ name: 'speed', value: 100 }] into Map({ speed: 100 })
 */
export function propertyMap(
  properties: { name: string; value: any }[]
): Map<string, any> {
  const obj = new Map<string, any>();
  properties.forEach(({ name, value }) => obj.set(name, value));
  return obj;
}
