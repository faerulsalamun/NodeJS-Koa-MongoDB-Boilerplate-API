/**
 * Created by faerulsalamun on 7/30/17.
 */

/**
 * Created by faerulsalamun on 5/18/17.
 */

'use strict';

const _ = require(`lodash`);
const moment = require(`moment-timezone`);

module.exports = {

  hasProperty(objects, props) {
    let has = true;
    for (let i = 0, l = props.length; i < l; i++) {
      if (!objects.hasOwnProperty(props[i])) {
        has = false;
        break;
      }
    }

    return has;
  },

  /**
   * Reverse of hasProperty, nice to craft message of what's missing.
   * @param  object obj   Checked objects.
   * @param  array props  Array of checked object key.
   * @return string       Missing object key name.
   */
  missingProperty(obj, props) {
    for (let i = 0, l = props.length; i < l; i++) {
      if (!obj.hasOwnProperty(props[i])) return props[i];
    }

    return false;
  },

  // http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects/979325
  // http://jsfiddle.net/gfullam/sq9U7/
  sortBy(field, reverse, primer) {
    const key = primer ? x => primer(x[field])
            : x => x[field];

    reverse = [-1, 1][+!!reverse];

    return (a, b) => {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    };
  },

  zeroPad(num, numZeros) {
    const n = Math.abs(num);
    const zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
    let zeroString = Math.pow(10, zeros).toString().substr(1);
    if (num < 0) {
      zeroString = `-${zeroString}`;
    }

    return zeroString + n;
  },

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && n > 0;
  },

  randomString(bits) {
    const chars =
            `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ab`;

    return this.getRandom(bits, chars);
  },

  randomActivationCode(bits) {
    const chars =
            `0123456789012345678901234567890123456789012345678901234567890123`;

    return this.getRandom(bits, chars);
  },

  censorEmail(email) {
    let strCensor = ``;
    let strRep = ``;

    const newEmail = email.split(`@`);
    const lastNewEmail = newEmail[1].split(`.`);
    strRep = newEmail[0].substring(1, newEmail[0].length - 1);

    for (let i = 0, length = strRep.length; i < length; i += 1) {
      strCensor += `*`;
    }

    return `${newEmail[0][0]}${strCensor}${newEmail[0][newEmail[0].length - 1]}@${lastNewEmail[0][0]}*****.${lastNewEmail[1]}`;
  },

  getRandom(bits, chars) {
    let rand;
    let i;
    let randomizedString = ``;

    // in v8, Math.random() yields 32 pseudo-random bits (in spidermonkey
    // it gives 53)
    while (bits > 0) {
      // 32-bit integer
      rand = Math.floor(Math.random() * 0x100000000);

      // base 64 means 6 bits per character, so we use the top 30 bits from rand
      // to give 30/6=5 characters.
      for (i = 26; i > 0 && bits > 0; i -= 6, bits -= 6) {
        randomizedString += chars[0x3F & rand >>> i];
      }
    }

    return randomizedString;
  },

  uuid(len, radix) {
    const CHARS = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`.split(``);

    const chars = CHARS;
    const uuid = [];
    let i;

    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = `-`;
      uuid[14] = `4`;

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join(``);
  },

  uid(len) {
    const buf = [];
    const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
    const charlen = chars.length;

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join(``);
  },

  getRandomNumbers(length) {
    const arr = [];
    while (arr.length < length) {
      const randomnumber = Math.ceil(Math.random() * length - 1);
      let found = false;
      for (let i = 0, l = arr.length; i < l; i++) {
        if (arr[i] == randomnumber) {
          found = true;
          break;
        }
      }

      if (!found)arr[arr.length] = randomnumber;
    }

    return arr;
  },

  stringifyWithOrder(json, order) {
    const keys = Object.keys(json);
    const orderKeys = [];
    for (let i = 0, l = order.length; i < l; i++) {
      orderKeys.push(keys[order[i]]);
    }

    return JSON.stringify(json, orderKeys);
  },

  showErrorValidationMongo(err) {
    for (const field in err.errors) {
      return err.errors[field];
    }
  },

  isValidObjectID(str) {
    str = `${str}`;
    const len = str.length;
    let valid = false;

    if (len === 12 || len === 24) {
      valid = /^[0-9a-fA-F]+$/.test(str);
    }

    return valid;
  },

  checkErrorCode(errorData) {
    if (typeof errorData.properties === `undefined`) {
      return 500;
    } else if (typeof errorData.properties.http !== `undefined`) {
      return errorData.properties.http;
    } else if (errorData.properties.type === `required`) {
      return 400;
    } else if (errorData.properties.path === `email`) {
      return 409;
    }
    return 400;
  },

  checkNotNullValue(value) {
    return (typeof value !== `undefined` && value !== null && value !== ``);
  },

  getTimeNow() {
    return moment().tz(`Asia/Jakarta`).format(`YYYY-MM-DDTHH:mm:ss`);
  },

  getDateNow() {
    return moment().tz(`Asia/Jakarta`).format(`YYYY-MM-DD`);
  },

  getTimeEpoch() {
    // return moment.tz(`Asia/Jakarta`).unix() + (3600 * 7);
    return moment.tz(`Asia/Jakarta`).unix();
  },

  getDifferentTime(timeStart, timeEnd) {
    return moment.duration(timeEnd.diff(timeStart)).asSeconds();
  },

  hasBody(req) {
    return `transfer-encoding` in req.headers || `content-length` in req.headers;
  },

  mime(req) {
    const str = req.headers[`content-type`] || ``;
    return str.split(`;`)[0];
  },

  checkImageExtension(ext) {
    const extensions = [`.jpg`, `.jpeg`, `.png`, `.gif`, `jpg`, `jpeg`, `png`, `gif`];

    return _.indexOf(extensions, ext) === -1;
  },

  checkRegexUsername(username) {
    const reg = /([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,30}(?:[A-Za-z0-9_]))?)/g;
    return reg.exec(username);
  },

  checkRegexEmail(email) {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  },

  changeDatatabelFormat(ctx) {
    const searchDatas = {
      draw: ctx.request.query.draw,
      start: ctx.request.query.start,
      length: ctx.request.query.length,
      _: ctx.request.query._,
      columns: [],
      order: [],
      search: {
        value: ctx.request.query[`search[value]`],
        regex: ctx.request.query[`search[regex]`],
      },
    };

    const columnsStop = true;
    let columnsPosition = 0;
    while (columnsStop) {
      if (ctx.request.query[`columns[${columnsPosition}][data]`] === undefined) {
        break;
      } else {
        searchDatas.columns.push({
          data: ctx.request.query[`columns[${columnsPosition}][data]`],
          name: ctx.request.query[`columns[${columnsPosition}][name]`],
          searchable: ctx.request.query[`columns[${columnsPosition}][searchable]`],
          orderable: ctx.request.query[`columns[${columnsPosition}][orderable]`],
          search: {
            value: ctx.request.query[`columns[${columnsPosition}][search][value]`],
            regex: ctx.request.query[`columns[${columnsPosition}][search][regex]`],
          },
        });
        columnsPosition += 1;
      }
    }

    const ordersStop = true;
    let orderPosition = 0;
    while (ordersStop) {
      if (ctx.request.query[`order[${orderPosition}][column]`] === undefined) {
        break;
      } else {
        searchDatas.order.push({
          column: ctx.request.query[`order[${orderPosition}][column]`],
          dir: ctx.request.query[`order[${orderPosition}][dir]`],
        });
        orderPosition += 1;
      }
    }

    return searchDatas;
  },
};
