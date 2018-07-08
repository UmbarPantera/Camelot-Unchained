
import { isEqual, isObject, transform } from 'lodash';


export function shallowDiffers(a: any, b: any): boolean {
  for (const i in b) if (a[i] !== b[i]) return true;
  return false;
}

export function shallowDiffersWithLog(a: any, b: any): boolean {
  for (const i in b) {
    if (a[i] !== b[i]) {
      console.log('different: ' + i);
      console.log(a[i]);
      console.log(b[i]);
      return true;
    }
    console.log('same: ' + i);
  }
  return false;
}

export const getDifference = (object: any, base: any) => {
  const changes = (object: any, base: any) => {
    return transform(object, (result: any, value: any, key: string) => {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  };
  return changes(object, base);
};

export const getDifferenceWithLog = (object: any, base: any) => {
  const changes = (object: any, base: any) => {
    return transform(object, (result: any, value: any, key: string) => {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  };
  const didChange = changes(object, base);
  console.log('Changes: ');
  console.log(didChange);
  return didChange;
};

// export const debounceScroll= (func:any, wait: number):any => {
//   let timeout: any;
//   let timestamp: any;
//   const run = () => {
//     timeout = null;
//     func();
//   };
//   const later = () => {
//     const last = Date.now() - timestamp;
//
//     if (last < wait) {
//       setTimeout(later, wait - last);
//     } else {
//       (window.requestIdleCallback || run)(run);
//     }
//   };
//
//   return function () {
//     timestamp = Date.now();
//
//     if (!timeout) {
//       timeout = setTimeout(later, wait);
//     }
//   };
// };
